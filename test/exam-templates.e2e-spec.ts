import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExamTemplate } from '../src/learning/entities/exam-template.entity';
import { ExamTemplateSection } from '../src/learning/entities/exam-template-section.entity';
import { ExamTemplateSectionQuestion } from '../src/learning/entities/exam-template-section-question.entity';
import {
  InstructionalCourse,
  DayOfWeek,
} from '../src/learning/entities/instructional-course.entity';
import { LearningInstitution } from '../src/learning/entities/learning-institution.entity';
import { User } from '../src/users/entities/user.entity';
import {
  createTestingModule,
  getTestUser,
  cleanupTestData,
} from './test-helper';

describe('ExamTemplatesController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let examTemplateRepository: Repository<ExamTemplate>;
  let examTemplateSectionRepository: Repository<ExamTemplateSection>;
  let examTemplateSectionQuestionRepository: Repository<ExamTemplateSectionQuestion>;
  let courseRepository: Repository<InstructionalCourse>;
  let institutionRepository: Repository<LearningInstitution>;
  let userRepository: Repository<User>;
  let savedInstitution: LearningInstitution;
  let savedCourse: InstructionalCourse;
  let testUser: User;
  let authToken: string;

  beforeAll(async () => {
    const { app: testApp, module: testModule } = await createTestingModule();
    app = testApp;
    moduleFixture = testModule;

    examTemplateRepository = moduleFixture.get<Repository<ExamTemplate>>(
      getRepositoryToken(ExamTemplate),
    );
    examTemplateSectionRepository = moduleFixture.get<
      Repository<ExamTemplateSection>
    >(getRepositoryToken(ExamTemplateSection));
    examTemplateSectionQuestionRepository = moduleFixture.get<
      Repository<ExamTemplateSectionQuestion>
    >(getRepositoryToken(ExamTemplateSectionQuestion));
    courseRepository = moduleFixture.get<Repository<InstructionalCourse>>(
      getRepositoryToken(InstructionalCourse),
    );
    institutionRepository = moduleFixture.get<Repository<LearningInstitution>>(
      getRepositoryToken(LearningInstitution),
    );
    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );

    testUser = getTestUser();

    // Get auth token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'test@example.com',
        password: 'password123',
      });

    authToken = loginResponse.body.access_token;

    // Create a test institution
    const institution = {
      name: 'Test Institution',
      description: 'A test institution',
      website: 'https://test.com',
      email: 'test@test.com',
      phone: '1234567890',
      address: '123 Test St',
    };
    savedInstitution = await institutionRepository.save(institution);

    // Create a test course
    const course = {
      name: 'Test Course',
      description: 'A test course',
      start_date: new Date('2024-02-01'),
      finish_date: new Date('2024-05-31'),
      start_time_utc: '14:00',
      duration_minutes: 90,
      days_of_week: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY],
      institution_id: savedInstitution.id,
      instructor_id: testUser.id,
      proctor_ids: [],
      created_by: testUser.id,
    };
    savedCourse = await courseRepository.save(course);
  });

  beforeEach(async () => {
    // Clean up only exam template data before each test
    await examTemplateSectionQuestionRepository.delete({});
    await examTemplateSectionRepository.delete({});
    await examTemplateRepository.delete({});
  });

  afterAll(async () => {
    // Clean up all test data in correct order
    await cleanupTestData();
    await app.close();
  });

  // ... rest of test cases ...
});
