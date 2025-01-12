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
import { ExamTemplate } from '../src/learning/entities/exam-template.entity';
import { ExamTemplateSection } from '../src/learning/entities/exam-template-section.entity';
import { ExamTemplateSectionQuestion } from '../src/learning/entities/exam-template-section-question.entity';
import {
  InstructionalCourse,
  DayOfWeek,
} from '../src/learning/entities/instructional-course.entity';
import { LearningInstitution } from '../src/learning/entities/learning-institution.entity';
import { Repository } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { TUserRole } from '../src/users/types';
import { QuestionTemplate } from '../src/questions/entities/question-template.entity';
import { TUserPromptType, TUserResponseType } from '../src/questions/types';
import { createTestingModule, cleanupTestDatabase } from './test-helper';

describe('ExamTemplatesController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let examTemplateRepository: Repository<ExamTemplate>;
  let sectionRepository: Repository<ExamTemplateSection>;
  let sectionQuestionRepository: Repository<ExamTemplateSectionQuestion>;
  let courseRepository: Repository<InstructionalCourse>;
  let institutionRepository: Repository<LearningInstitution>;
  let userRepository: Repository<User>;
  let questionTemplateRepository: Repository<QuestionTemplate>;
  let savedUser: User;
  let authToken: string;
  const mockUser = {
    id: undefined as string | undefined,
    roles: ['admin:exams'],
  };
  let testCourseId: string;
  let testInstitutionId: string;
  let testQuestionId: string;
  let testQuestionTemplateId: string;

  beforeAll(async () => {
    // Create the app and module
    const { app: testApp, moduleFixture: testModuleFixture } =
      await createTestingModule();
    app = testApp;
    moduleFixture = testModuleFixture;

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
    questionTemplateRepository = moduleFixture.get<
      Repository<QuestionTemplate>
    >(getRepositoryToken(QuestionTemplate));
    examTemplateRepository = moduleFixture.get<Repository<ExamTemplate>>(
      getRepositoryToken(ExamTemplate),
    );
    sectionRepository = moduleFixture.get<Repository<ExamTemplateSection>>(
      getRepositoryToken(ExamTemplateSection),
    );
    sectionQuestionRepository = moduleFixture.get<
      Repository<ExamTemplateSectionQuestion>
    >(getRepositoryToken(ExamTemplateSectionQuestion));

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
    mockUser.id = savedUser.id;

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
      name: 'Test Institution',
      description: 'Test Institution Description',
      website: 'https://test.edu',
      email: 'test@test.edu',
      phone: '123-456-7890',
      address: '123 Test St',
      created_by: savedUser.id,
    });
    const savedInstitution = await institutionRepository.save(institution);
    testInstitutionId = savedInstitution.id;

    // Create test course
    const course = courseRepository.create({
      name: 'Test Course',
      description: 'Test Course Description',
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
    const savedCourse = await courseRepository.save(course);
    testCourseId = savedCourse.id;

    // Create test question template
    const questionTemplate = questionTemplateRepository.create({
      userPromptText: 'Test question prompt',
      instructionText: 'Test question instruction',
      userPromptType: 'text' as TUserPromptType,
      userResponseType: 'free-text-255' as TUserResponseType,
      exclusivityType: 'exam-practice-both' as
        | 'exam-practice-both'
        | 'exam-only'
        | 'practice-only',
      created_by: savedUser.id,
    });
    const savedQuestionTemplate =
      await questionTemplateRepository.save(questionTemplate);
    testQuestionTemplateId = savedQuestionTemplate.id;
  });

  beforeEach(async () => {
    // Clean up test-specific data
    await sectionQuestionRepository.delete({});
    await sectionRepository.delete({});
    await examTemplateRepository.delete({});
  });

  afterAll(async () => {
    try {
      await app.close();
    } finally {
      await cleanupTestDatabase();
    }
  });

  describe('POST /exam-templates', () => {
    it('should create a new exam template', () => {
      const createDto = {
        name: 'Test Exam Template',
        description: 'Test Description',
        examExclusivityType: 'exam-practice-both',
        availability_start_date: new Date(),
        availability_end_date: new Date(Date.now() + 86400000),
        course_id: testCourseId,
      };

      return request(app.getHttpServer())
        .post('/exam-templates')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createDto.name);
          expect(res.body.description).toBe(createDto.description);
          expect(res.body.created_by).toBe(mockUser.id);
        });
    });
  });

  describe('GET /exam-templates', () => {
    it('should return all exam templates', async () => {
      // Create test data
      const template = await examTemplateRepository.save({
        name: 'Test Template',
        description: 'Test Description',
        examExclusivityType: 'exam-practice-both',
        availability_start_date: new Date(),
        availability_end_date: new Date(Date.now() + 86400000),
        course_id: testCourseId,
        created_by: mockUser.id,
      });

      return request(app.getHttpServer())
        .get('/exam-templates')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body[0].id).toBe(template.id);
        });
    });
  });

  describe('GET /exam-templates/:id', () => {
    it('should return a specific exam template', async () => {
      const template = await examTemplateRepository.save({
        name: 'Test Template',
        description: 'Test Description',
        examExclusivityType: 'exam-practice-both',
        availability_start_date: new Date(),
        availability_end_date: new Date(Date.now() + 86400000),
        course_id: testCourseId,
        created_by: mockUser.id,
      });

      return request(app.getHttpServer())
        .get(`/exam-templates/${template.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(template.id);
          expect(res.body.name).toBe(template.name);
        });
    });

    it('should return 404 for non-existent template', () => {
      return request(app.getHttpServer())
        .get('/exam-templates/12345678-1234-1234-1234-123456789999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('PUT /exam-templates/:id', () => {
    it('should update an exam template', async () => {
      const template = await examTemplateRepository.save({
        name: 'Test Template',
        description: 'Test Description',
        examExclusivityType: 'exam-practice-both',
        availability_start_date: new Date(),
        availability_end_date: new Date(Date.now() + 86400000),
        course_id: testCourseId,
        created_by: mockUser.id,
      });

      const updateDto = {
        name: 'Updated Template Name',
        description: 'Updated Description',
      };

      return request(app.getHttpServer())
        .put(`/exam-templates/${template.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(updateDto.name);
          expect(res.body.description).toBe(updateDto.description);
        });
    });
  });

  describe('DELETE /exam-templates/:id', () => {
    it('should delete an exam template', async () => {
      const template = await examTemplateRepository.save({
        name: 'Test Template',
        description: 'Test Description',
        examExclusivityType: 'exam-practice-both',
        availability_start_date: new Date(),
        availability_end_date: new Date(Date.now() + 86400000),
        course_id: testCourseId,
        created_by: mockUser.id,
      });

      return request(app.getHttpServer())
        .delete(`/exam-templates/${template.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('POST /exam-templates/sections', () => {
    it('should create a new section', async () => {
      const template = await examTemplateRepository.save({
        name: 'Test Template',
        description: 'Test Description',
        examExclusivityType: 'exam-practice-both',
        availability_start_date: new Date(),
        availability_end_date: new Date(Date.now() + 86400000),
        course_id: testCourseId,
        created_by: mockUser.id,
      });

      const createSectionDto = {
        title: 'Test Section',
        instructions: 'Test Instructions',
        position: 1,
        timeLimitSeconds: 3600,
        exam_template_id: template.id,
      };

      return request(app.getHttpServer())
        .post('/exam-templates/sections')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createSectionDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe(createSectionDto.title);
          expect(res.body.exam_template_id).toBe(template.id);
        });
    });
  });

  describe('GET /exam-templates/sections/:id', () => {
    it('should return a specific section', async () => {
      const template = await examTemplateRepository.save({
        name: 'Test Template',
        description: 'Test Description',
        examExclusivityType: 'exam-practice-both',
        availability_start_date: new Date(),
        availability_end_date: new Date(Date.now() + 86400000),
        course_id: testCourseId,
        created_by: mockUser.id,
      });

      const section = await sectionRepository.save({
        title: 'Test Section',
        instructions: 'Test Instructions',
        position: 1,
        timeLimitSeconds: 3600,
        exam_template_id: template.id,
      });

      return request(app.getHttpServer())
        .get(`/exam-templates/sections/${section.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(section.id);
          expect(res.body.title).toBe(section.title);
        });
    });
  });

  describe('PUT /exam-templates/sections/:id', () => {
    it('should update a section', async () => {
      const template = await examTemplateRepository.save({
        name: 'Test Template',
        description: 'Test Description',
        examExclusivityType: 'exam-practice-both',
        availability_start_date: new Date(),
        availability_end_date: new Date(Date.now() + 86400000),
        course_id: testCourseId,
        created_by: mockUser.id,
      });

      const section = await sectionRepository.save({
        title: 'Test Section',
        instructions: 'Test Instructions',
        position: 1,
        timeLimitSeconds: 3600,
        exam_template_id: template.id,
      });

      const updateDto = {
        title: 'Updated Section Title',
        instructions: 'Updated Instructions',
      };

      return request(app.getHttpServer())
        .put(`/exam-templates/sections/${section.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe(updateDto.title);
          expect(res.body.instructions).toBe(updateDto.instructions);
        });
    });
  });

  describe('DELETE /exam-templates/sections/:id', () => {
    it('should delete a section', async () => {
      const template = await examTemplateRepository.save({
        name: 'Test Template',
        description: 'Test Description',
        examExclusivityType: 'exam-practice-both',
        availability_start_date: new Date(),
        availability_end_date: new Date(Date.now() + 86400000),
        course_id: testCourseId,
        created_by: mockUser.id,
      });

      const section = await sectionRepository.save({
        title: 'Test Section',
        instructions: 'Test Instructions',
        position: 1,
        timeLimitSeconds: 3600,
        exam_template_id: template.id,
      });

      return request(app.getHttpServer())
        .delete(`/exam-templates/sections/${section.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('POST /exam-templates/sections/:id/questions', () => {
    it('should add a question to a section', async () => {
      const template = await examTemplateRepository.save({
        name: 'Test Template',
        description: 'Test Description',
        examExclusivityType: 'exam-practice-both',
        availability_start_date: new Date(),
        availability_end_date: new Date(Date.now() + 86400000),
        course_id: testCourseId,
        created_by: mockUser.id,
      });

      const section = await sectionRepository.save({
        title: 'Test Section',
        instructions: 'Test Instructions',
        position: 1,
        timeLimitSeconds: 3600,
        exam_template_id: template.id,
      });

      const response = await request(app.getHttpServer())
        .post(`/exam-templates/sections/${section.id}/questions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          question_template_id: testQuestionTemplateId,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.section_id).toBe(section.id);
      expect(response.body.question_template_id).toBe(testQuestionTemplateId);
    });
  });

  describe('DELETE /exam-templates/sections/:id/questions', () => {
    it('should remove a question from a section', async () => {
      const template = await examTemplateRepository.save({
        name: 'Test Template',
        description: 'Test Description',
        examExclusivityType: 'exam-practice-both',
        availability_start_date: new Date(),
        availability_end_date: new Date(Date.now() + 86400000),
        course_id: testCourseId,
        created_by: mockUser.id,
      });

      const section = await sectionRepository.save({
        title: 'Test Section',
        instructions: 'Test Instructions',
        position: 1,
        timeLimitSeconds: 3600,
        exam_template_id: template.id,
      });

      const question = await sectionQuestionRepository.save({
        section_id: section.id,
        question_template_id: testQuestionTemplateId,
      });

      const removeQuestionDto = {
        question_template_id: question.question_template_id,
      };

      return request(app.getHttpServer())
        .delete(`/exam-templates/sections/${section.id}/questions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(removeQuestionDto)
        .expect(200);
    });
  });

  describe('GET /exam-templates/sections/:id/questions', () => {
    it('should return all questions in a section', async () => {
      const template = await examTemplateRepository.save({
        name: 'Test Template',
        description: 'Test Description',
        examExclusivityType: 'exam-practice-both',
        availability_start_date: new Date(),
        availability_end_date: new Date(Date.now() + 86400000),
        course_id: testCourseId,
        created_by: mockUser.id,
      });

      const section = await sectionRepository.save({
        title: 'Test Section',
        instructions: 'Test Instructions',
        position: 1,
        timeLimitSeconds: 3600,
        exam_template_id: template.id,
      });

      const question = await sectionQuestionRepository.save({
        section_id: section.id,
        question_template_id: testQuestionTemplateId,
      });

      return request(app.getHttpServer())
        .get(`/exam-templates/sections/${section.id}/questions`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body[0].id).toBe(question.id);
          expect(res.body[0].question_template_id).toBe(
            question.question_template_id,
          );
        });
    });
  });
});
