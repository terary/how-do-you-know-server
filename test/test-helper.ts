import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { ConfigModule } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExamTemplateSectionQuestion } from '../src/learning/entities/exam-template-section-question.entity';
import { ExamTemplateSection } from '../src/learning/entities/exam-template-section.entity';
import { ExamTemplate } from '../src/learning/entities/exam-template.entity';
import { InstructionalCourse } from '../src/learning/entities/instructional-course.entity';
import { LearningInstitution } from '../src/learning/entities/learning-institution.entity';

let testDataSource: DataSource;
let testModule: TestingModule;
let testApp: INestApplication;
let testUser: User;

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

  // Create test user if it doesn't exist
  const userRepository = testModule.get<Repository<User>>(
    getRepositoryToken(User),
  );
  testUser = await userRepository.findOne({
    where: { username: 'test@example.com' },
  });

  if (!testUser) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    testUser = await userRepository.save({
      username: 'test@example.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      roles: ['admin:exams', 'admin:users', 'user', 'public'],
    });
  }

  return { app: testApp, module: testModule };
};

export const getTestUser = () => testUser;

export const getTestApp = () => testApp;

export const getTestModule = () => testModule;

export const cleanupTestData = async () => {
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
  await examTemplateSectionQuestionRepository.delete({});
  await examTemplateSectionRepository.delete({});
  await examTemplateRepository.delete({});
  await instructionalCourseRepository.delete({});
  await learningInstitutionRepository.delete({});
  await userRepository.delete({});
};
