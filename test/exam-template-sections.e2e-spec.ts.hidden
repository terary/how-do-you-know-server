import { config } from 'dotenv';
import { resolve } from 'path';
import * as bcrypt from 'bcrypt';

// Load test environment variables
config({ path: resolve(__dirname, '../.env.test') });

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { TUserRole } from '../src/users/types';
import { LearningInstitution } from '../src/learning/entities/learning-institution.entity';
import {
  InstructionalCourse,
  DayOfWeek,
} from '../src/learning/entities/instructional-course.entity';
import { ExamTemplate } from '../src/learning/entities/exam-template.entity';
import { ExamTemplateSection } from '../src/learning/entities/exam-template-section.entity';
import { createTestingModule, cleanupTestDatabase } from './test-helper';

describe('ExamTemplateSectionsController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let userRepository: Repository<User>;
  let institutionRepository: Repository<LearningInstitution>;
  let courseRepository: Repository<InstructionalCourse>;
  let examTemplateRepository: Repository<ExamTemplate>;
  let sectionRepository: Repository<ExamTemplateSection>;

  let savedUser: User;
  let savedInstitution: LearningInstitution;
  let savedCourse: InstructionalCourse;
  let savedExamTemplate: ExamTemplate;
  let authToken: string;

  beforeAll(async () => {
    // Create the app and module
    const { app: testApp, module: testModule } = await createTestingModule();
    app = testApp;
    moduleFixture = testModule;

    // Get repositories
    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    institutionRepository = moduleFixture.get<Repository<LearningInstitution>>(
      getRepositoryToken(LearningInstitution),
    );
    courseRepository = moduleFixture.get<Repository<InstructionalCourse>>(
      getRepositoryToken(InstructionalCourse),
    );
    examTemplateRepository = moduleFixture.get<Repository<ExamTemplate>>(
      getRepositoryToken(ExamTemplate),
    );
    sectionRepository = moduleFixture.get<Repository<ExamTemplateSection>>(
      getRepositoryToken(ExamTemplateSection),
    );

    // Create test user
    const testUser = userRepository.create({
      username: 'test.instructor',
      firstName: 'Test',
      lastName: 'Instructor',
      email: 'test.instructor@test.edu',
      password: await bcrypt.hash('password123', 10),
      roles: ['admin:exams'] as TUserRole[],
    });
    savedUser = await userRepository.save(testUser);

    // Login to get auth token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'test.instructor',
        password: 'password123',
      });
    authToken = loginResponse.body.access_token;

    // Create test institution
    const institution = institutionRepository.create({
      name: 'Test University',
      description: 'A test university for e2e testing',
      website: 'https://test.edu',
      email: 'contact@test.edu',
      phone: '123-456-7890',
      address: '123 Test St, Test City, TS 12345',
      created_by: savedUser.id,
    });
    savedInstitution = await institutionRepository.save(institution);

    // Create test course
    const course = courseRepository.create({
      name: 'Test Course',
      description: 'A test course for e2e testing',
      start_date: new Date('2024-02-01'),
      finish_date: new Date('2024-05-31'),
      start_time_utc: '14:00',
      duration_minutes: 90,
      days_of_week: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY],
      institution_id: savedInstitution.id,
      instructor_id: savedUser.id,
      proctor_ids: [],
      created_by: savedUser.id,
    });
    savedCourse = await courseRepository.save(course);

    // Create test exam template
    const examTemplate = examTemplateRepository.create({
      name: 'Test Exam Template',
      description: 'A test exam template for e2e testing',
      examExclusivityType: 'exam-only',
      availability_start_date: new Date('2024-03-01'),
      availability_end_date: new Date('2024-03-31'),
      course_id: savedCourse.id,
      created_by: savedUser.id,
    });
    savedExamTemplate = await examTemplateRepository.save(examTemplate);
  });

  beforeEach(async () => {
    // Clean up test-specific data (sections and exam template)
    await sectionRepository.delete({});
    await examTemplateRepository.delete({});

    // Recreate test exam template
    const examTemplate = examTemplateRepository.create({
      name: 'Test Exam Template',
      description: 'A test exam template for e2e testing',
      examExclusivityType: 'exam-only',
      availability_start_date: new Date('2024-03-01'),
      availability_end_date: new Date('2024-03-31'),
      course_id: savedCourse.id,
      created_by: savedUser.id,
    });
    savedExamTemplate = await examTemplateRepository.save(examTemplate);
  });

  afterAll(async () => {
    try {
      // Clean up all test data in reverse order
      await sectionRepository.delete({});
      await examTemplateRepository.delete({});
      await courseRepository.delete({});
      await institutionRepository.delete({});
      await userRepository.delete({});
      await app.close();
    } finally {
      await cleanupTestDatabase();
    }
  });

  describe('POST /exam-templates/:examId/sections', () => {
    it('should create a new exam template section', () => {
      const createDto = {
        title: 'Multiple Choice Section',
        instructions: 'Answer all questions in this section',
        position: 1,
        timeLimitSeconds: 1800,
      };

      return request(app.getHttpServer())
        .post(`/exam-templates/${savedExamTemplate.id}/sections`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe(createDto.title);
          expect(res.body.instructions).toBe(createDto.instructions);
          expect(res.body.position).toBe(createDto.position);
          expect(res.body.timeLimitSeconds).toBe(createDto.timeLimitSeconds);
          expect(res.body.exam_template_id).toBe(savedExamTemplate.id);
        });
    });
  });

  describe('GET /exam-templates/:examId/sections', () => {
    it('should return all sections for an exam template', async () => {
      const section = await sectionRepository.save({
        title: 'Multiple Choice Section',
        instructions: 'Answer all questions in this section',
        position: 1,
        timeLimitSeconds: 1800,
        exam_template_id: savedExamTemplate.id,
      });

      return request(app.getHttpServer())
        .get(`/exam-templates/${savedExamTemplate.id}/sections`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body[0].id).toBe(section.id);
          expect(res.body[0].title).toBe(section.title);
        });
    });
  });

  describe('GET /exam-templates/:examId/sections/:id', () => {
    it('should return a specific exam template section', async () => {
      const section = await sectionRepository.save({
        title: 'Multiple Choice Section',
        instructions: 'Answer all questions in this section',
        position: 1,
        timeLimitSeconds: 1800,
        exam_template_id: savedExamTemplate.id,
      });

      return request(app.getHttpServer())
        .get(`/exam-templates/${savedExamTemplate.id}/sections/${section.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(section.id);
          expect(res.body.title).toBe(section.title);
          expect(res.body.exam_template_id).toBe(savedExamTemplate.id);
        });
    });

    it('should return 404 for non-existent section', () => {
      return request(app.getHttpServer())
        .get(
          `/exam-templates/${savedExamTemplate.id}/sections/12345678-1234-1234-1234-123456789999`,
        )
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('PATCH /exam-templates/:examId/sections/:id', () => {
    it('should update an exam template section', async () => {
      const section = await sectionRepository.save({
        title: 'Multiple Choice Section',
        instructions: 'Answer all questions in this section',
        position: 1,
        timeLimitSeconds: 1800,
        exam_template_id: savedExamTemplate.id,
      });

      const updateDto = {
        title: 'Updated Section Title',
        instructions: 'Updated instructions for this section',
        timeLimitSeconds: 2400,
      };

      return request(app.getHttpServer())
        .patch(`/exam-templates/${savedExamTemplate.id}/sections/${section.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe(updateDto.title);
          expect(res.body.instructions).toBe(updateDto.instructions);
          expect(res.body.timeLimitSeconds).toBe(updateDto.timeLimitSeconds);
          expect(res.body.exam_template_id).toBe(savedExamTemplate.id);
        });
    });
  });

  describe('DELETE /exam-templates/:examId/sections/:id', () => {
    it('should delete an exam template section', async () => {
      const section = await sectionRepository.save({
        title: 'Multiple Choice Section',
        instructions: 'Answer all questions in this section',
        position: 1,
        timeLimitSeconds: 1800,
        exam_template_id: savedExamTemplate.id,
      });

      return request(app.getHttpServer())
        .delete(
          `/exam-templates/${savedExamTemplate.id}/sections/${section.id}`,
        )
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });
});
