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
};

export const cleanupTestDatabase = async () => {
  if (testDataSource && testDataSource.isInitialized) {
    await testDataSource.destroy();
  }
};

export const createTestingModule = async () => {
  await setupTestDatabase();

  testModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env',
      }),
      AppModule,
    ],
  }).compile();

  testApp = testModule.createNestApplication();
  await testApp.init();

  return { app: testApp, module: testModule };
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

      // Find all related courses first
      let coursesToDelete;
      if (Entity === LearningInstitution) {
        coursesToDelete = await courseRepository
          .createQueryBuilder('course')
          .leftJoinAndSelect('course.institution', 'institution')
          .where('institution.name = :name', { name: identifier.name })
          .getMany();
      } else {
        coursesToDelete = await courseRepository
          .createQueryBuilder('course')
          .where('course.instructor_id = :id', { id: identifier.id })
          .getMany();
      }

      // Delete each course
      for (const course of coursesToDelete) {
        await courseRepository.remove(course);
      }
    }

    // Find all matching records
    const recordsToDelete = await repository
      .createQueryBuilder(Entity.name.toLowerCase())
      .where(identifier)
      .getMany();

    // Delete each record
    for (const record of recordsToDelete) {
      await repository.remove(record);
    }

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

    const hashedPassword = await bcrypt.hash('password123', 10);
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
    return savedUser;
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
