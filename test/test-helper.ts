import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { ConfigModule } from '@nestjs/config';
import { User } from '../src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExamTemplateSectionQuestion } from '../src/learning/entities/exam-template-section-question.entity';
import { ExamTemplateSection } from '../src/learning/entities/exam-template-section.entity';
import { ExamTemplate } from '../src/learning/entities/exam-template.entity';
import { InstructionalCourse } from '../src/learning/entities/instructional-course.entity';
import { LearningInstitution } from '../src/learning/entities/learning-institution.entity';
import * as bcrypt from 'bcrypt';
import { TUserRole } from '../src/users/types';

let testDataSource: DataSource;
let testModule: TestingModule;
let testApp: INestApplication;

export const setupTestDatabase = async () => {
  if (!testDataSource || !testDataSource.isInitialized) {
    testDataSource = new DataSource({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
      synchronize: false,
      dropSchema: false,
    });

    await testDataSource.initialize();
  }

  if (!testModule) {
    testModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        AppModule,
      ],
    }).compile();
  }

  if (!testApp) {
    testApp = testModule.createNestApplication({
      cors: true,
      logger: console,
    });
    await testApp.init();
  }

  return { app: testApp, module: testModule };
};

export const cleanupTestDatabase = async () => {
  try {
    if (testApp) {
      await testApp.close();
      testApp = null;
    }

    if (testModule) {
      await testModule.close();
      testModule = null;
    }

    if (testDataSource && testDataSource.isInitialized) {
      await testDataSource.destroy();
      testDataSource = null;
    }
  } catch (error) {
    console.error('Error during database cleanup:', error);
    throw error;
  }
};

export const getTestApp = () => testApp;

export const getTestModule = () => testModule;

export const cleanupTestEntityData = async (
  module: TestingModule,
  Entity: { new (...args: any[]): any },
  identifier: Record<string, any>,
) => {
  try {
    console.log(
      `Cleaning up test data for ${Entity.name} with identifier:`,
      identifier,
    );
    const repository = module.get<Repository<any>>(getRepositoryToken(Entity));

    if (Entity === LearningInstitution || Entity === User) {
      // For entities with foreign key constraints, first cleanup their dependent records
      const courseRepository = module.get<Repository<InstructionalCourse>>(
        getRepositoryToken(InstructionalCourse),
      );

      // Delete related courses first
      if (Entity === LearningInstitution) {
        await courseRepository
          .createQueryBuilder('course')
          .delete()
          .from(InstructionalCourse)
          .where(
            'institution_id IN (SELECT id FROM learning_institutions WHERE name = :name)',
            { name: identifier.name },
          )
          .execute();
      } else {
        await courseRepository
          .createQueryBuilder('course')
          .delete()
          .from(InstructionalCourse)
          .where('instructor_id = :id', { id: identifier.id })
          .execute();
      }
    } else if (
      Entity === ExamTemplate ||
      Entity === ExamTemplateSection ||
      Entity === ExamTemplateSectionQuestion
    ) {
      // For exam template entities, ensure we clean up in the correct order
      const questionRepository = module.get<
        Repository<ExamTemplateSectionQuestion>
      >(getRepositoryToken(ExamTemplateSectionQuestion));
      const sectionRepository = module.get<Repository<ExamTemplateSection>>(
        getRepositoryToken(ExamTemplateSection),
      );
      const templateRepository = module.get<Repository<ExamTemplate>>(
        getRepositoryToken(ExamTemplate),
      );

      if (Entity === ExamTemplate) {
        // Find template IDs
        const templates = await templateRepository
          .createQueryBuilder('template')
          .where(identifier)
          .getMany();

        for (const template of templates) {
          // Delete questions first
          await questionRepository
            .createQueryBuilder()
            .delete()
            .from(ExamTemplateSectionQuestion)
            .where(
              'section_id IN (SELECT id FROM exam_template_sections WHERE exam_template_id = :id)',
              { id: template.id },
            )
            .execute();

          // Delete sections
          await sectionRepository
            .createQueryBuilder()
            .delete()
            .from(ExamTemplateSection)
            .where('exam_template_id = :id', { id: template.id })
            .execute();

          // Delete template
          await templateRepository
            .createQueryBuilder()
            .delete()
            .from(ExamTemplate)
            .where('id = :id', { id: template.id })
            .execute();
        }
        return;
      } else if (Entity === ExamTemplateSection) {
        // Find section IDs
        const sections = await sectionRepository
          .createQueryBuilder('section')
          .where(identifier)
          .getMany();

        for (const section of sections) {
          // Delete questions first
          await questionRepository
            .createQueryBuilder()
            .delete()
            .from(ExamTemplateSectionQuestion)
            .where('section_id = :id', { id: section.id })
            .execute();

          // Delete section
          await sectionRepository
            .createQueryBuilder()
            .delete()
            .from(ExamTemplateSection)
            .where('id = :id', { id: section.id })
            .execute();
        }
        return;
      } else if (Entity === ExamTemplateSectionQuestion) {
        // Delete questions directly
        await questionRepository
          .createQueryBuilder()
          .delete()
          .from(ExamTemplateSectionQuestion)
          .where(identifier)
          .execute();
        return;
      }
    }

    // Delete all matching records
    await repository
      .createQueryBuilder()
      .delete()
      .from(Entity)
      .where(identifier)
      .execute();

    console.log(`Successfully cleaned up test data for ${Entity.name}`);
  } catch (error) {
    console.error(`Error cleaning up test data for ${Entity.name}:`, error);
    throw error;
  }
};

export const createTestUser = async (
  module: TestingModule,
  username: string,
  roles: TUserRole[] = ['admin:exams'],
) => {
  const userRepository = module.get<Repository<User>>(getRepositoryToken(User));

  try {
    console.log(`Creating test user: ${username}`);

    // Clean up existing test user first
    await userRepository.delete({ username });

    const plainTextPassword = 'password123';
    const hashedPassword = await bcrypt.hash(plainTextPassword, 10);
    const user = userRepository.create({
      username,
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      email: username,
      roles,
    });

    const savedUser = await userRepository.save(user);
    console.log(`Successfully created test user: ${username}`);
    return { ...savedUser, plainTextPassword };
  } catch (error) {
    console.error(`Error creating test user ${username}:`, error);
    throw error;
  }
};

export const createTestInstitution = async (
  module: TestingModule,
  name: string,
  userId: string,
) => {
  const institutionRepository = module.get<Repository<LearningInstitution>>(
    getRepositoryToken(LearningInstitution),
  );

  try {
    console.log(`Creating test institution: ${name}`);

    // Clean up existing test institution first
    await institutionRepository.delete({ name });

    const institution = institutionRepository.create({
      name,
      description: `Test institution for ${name}`,
      website: `https://${name.toLowerCase().replace(/\s+/g, '-')}.test.edu`,
      email: `contact@${name.toLowerCase().replace(/\s+/g, '-')}.test.edu`,
      phone: '123-456-7890',
      address: '123 Test St',
      created_by: userId,
    });

    const savedInstitution = await institutionRepository.save(institution);
    console.log(`Successfully created test institution: ${name}`);
    return savedInstitution;
  } catch (error) {
    console.error(`Error creating test institution ${name}:`, error);
    throw error;
  }
};

export const cleanupTestData = async () => {
  if (!testModule) return;

  try {
    console.log('Starting full test data cleanup...');

    // Get all repositories
    const examTemplateSectionQuestionRepository = testModule.get<
      Repository<ExamTemplateSectionQuestion>
    >(getRepositoryToken(ExamTemplateSectionQuestion));
    const examTemplateSectionRepository = testModule.get<
      Repository<ExamTemplateSection>
    >(getRepositoryToken(ExamTemplateSection));
    const examTemplateRepository = testModule.get<Repository<ExamTemplate>>(
      getRepositoryToken(ExamTemplate),
    );
    const instructionalCourseRepository = testModule.get<
      Repository<InstructionalCourse>
    >(getRepositoryToken(InstructionalCourse));
    const learningInstitutionRepository = testModule.get<
      Repository<LearningInstitution>
    >(getRepositoryToken(LearningInstitution));
    const userRepository = testModule.get<Repository<User>>(
      getRepositoryToken(User),
    );

    // Delete in reverse order of dependencies
    console.log('Cleaning up exam template section questions...');
    await examTemplateSectionQuestionRepository.delete({});

    console.log('Cleaning up exam template sections...');
    await examTemplateSectionRepository.delete({});

    console.log('Cleaning up exam templates...');
    await examTemplateRepository.delete({});

    console.log('Cleaning up instructional courses...');
    await instructionalCourseRepository.delete({});

    console.log('Cleaning up learning institutions...');
    await learningInstitutionRepository.delete({});

    console.log('Cleaning up users...');
    await userRepository.delete({});

    console.log('Successfully completed full test data cleanup');
  } catch (error) {
    console.error('Error cleaning up test data:', error);
    throw error;
  }
};
