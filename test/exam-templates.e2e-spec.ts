import { config } from 'dotenv';
import { resolve } from 'path';
import * as bcrypt from 'bcrypt';

// Load test environment variables
config({ path: resolve(__dirname, '../.env.test') });

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
import { createTestingModule } from './test-helper';

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

    // Clean up any existing test data from this suite
    await examTemplateSectionQuestionRepository.delete({});
    await examTemplateSectionRepository.delete({});
    await examTemplateRepository.delete({});
    await courseRepository.delete({});
    await institutionRepository.delete({
      name: 'Test Institution - Exam Templates',
    });
    await userRepository.delete({
      username: 'test-exam-templates@test.com',
    });

    // Create our own test user with a unique identifier for this test suite
    const testUsername = 'test-exam-templates@test.com';
    testUser = await userRepository.findOne({
      where: { username: testUsername },
    });

    if (!testUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const userToCreate = userRepository.create({
        username: testUsername,
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'Exam Templates',
        email: testUsername,
        roles: ['admin:exams', 'admin:users', 'user', 'public'],
      });
      testUser = await userRepository.save(userToCreate);
    }

    // Get auth token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: testUsername,
        password: 'password123',
      });

    authToken = loginResponse.body.access_token;

    // Create a test institution with a unique identifier for this test suite
    const institutionToCreate = institutionRepository.create({
      name: 'Test Institution - Exam Templates',
      description: 'A test institution for exam templates e2e tests',
      website: 'https://test-exam-templates.com',
      email: 'institution@test-exam-templates.com',
      phone: '1234567890',
      address: '123 Test St',
      created_by: testUser.id,
    });
    savedInstitution = await institutionRepository.save(institutionToCreate);

    // Create a test course
    const courseToCreate = courseRepository.create({
      name: 'Test Course - Exam Templates',
      description: 'A test course for exam templates e2e tests',
      start_date: new Date('2024-02-01'),
      finish_date: new Date('2024-05-31'),
      start_time_utc: '14:00',
      duration_minutes: 90,
      days_of_week: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY],
      institution: savedInstitution,
      instructor_id: testUser.id,
      proctor_ids: [],
      created_by: testUser.id,
    });
    savedCourse = await courseRepository.save(courseToCreate);
  });

  beforeEach(async () => {
    // Clean up only exam template data before each test
    await examTemplateSectionQuestionRepository.delete({});
    await examTemplateSectionRepository.delete({});
    await examTemplateRepository.delete({});
  });

  afterAll(async () => {
    try {
      // Clean up ALL test data we created, in correct order
      if (examTemplateSectionQuestionRepository) {
        await examTemplateSectionQuestionRepository.delete({});
      }
      if (examTemplateSectionRepository) {
        await examTemplateSectionRepository.delete({});
      }
      if (examTemplateRepository) {
        await examTemplateRepository.delete({});
      }
      if (courseRepository && savedCourse) {
        await courseRepository.delete({
          id: savedCourse.id,
        });
      }
      if (institutionRepository && savedInstitution) {
        await institutionRepository.delete({
          id: savedInstitution.id,
        });
      }
      if (userRepository) {
        await userRepository.delete({
          username: 'test-exam-templates@test.com',
        });
      }
    } finally {
      if (app) {
        await app.close();
      }
    }
  });

  it('placeholder test', () => {
    expect(1).toBe(1);
  });
});
