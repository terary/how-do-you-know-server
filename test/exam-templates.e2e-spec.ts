import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ExamTemplate,
  ExamExclusivityType,
} from '../src/learning/entities/exam-template.entity';
import { User } from '../src/users/entities/user.entity';
import {
  InstructionalCourse,
  DayOfWeek,
} from '../src/learning/entities/instructional-course.entity';
import { AppModule } from '../src/app.module';
import {
  setupTestDatabase,
  cleanupTestDatabase,
  cleanupTestEntityData,
  createTestUser,
  getAuthToken,
} from './test-helper';
import * as request from 'supertest';

describe('ExamTemplatesController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;
  let examTemplateRepository: Repository<ExamTemplate>;
  let userRepository: Repository<User>;
  let courseRepository: Repository<InstructionalCourse>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
    examTemplateRepository = module.get<Repository<ExamTemplate>>(
      getRepositoryToken(ExamTemplate),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    courseRepository = module.get<Repository<InstructionalCourse>>(
      getRepositoryToken(InstructionalCourse),
    );
  });

  beforeEach(async () => {
    await cleanupTestEntityData(module, ExamTemplate, {});
    await cleanupTestEntityData(module, InstructionalCourse, {});
    await cleanupTestEntityData(module, User, {
      username: 'test-exam-templates',
    });
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe('POST /exam-templates', () => {
    it('should create a new exam template', async () => {
      // Create test user
      const testUser = await createTestUser(module, 'test-exam-templates');

      // Login to get auth token
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test-exam-templates@test.com',
          password: 'password123',
        });
      expect(loginResponse.status).toBe(201);
      const authToken = loginResponse.body.access_token;

      // Create test institution
      const institutionResponse = await request(app.getHttpServer())
        .post('/learning-institutions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Institution - Exam Templates',
          description: 'Test Institution for Exam Templates',
          website: 'https://test-institution.com',
          email: 'test-institution@test.com',
          phone: '+1234567890',
        });
      expect(institutionResponse.status).toBe(201);

      // Create test course
      const courseResponse = await request(app.getHttpServer())
        .post('/instructional-courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Course',
          description: 'Test Course Description',
          learning_institution_id: institutionResponse.body.id,
          start_date: '2024-01-01',
          finish_date: '2024-12-31',
          start_time_utc: '09:00',
          duration_minutes: 60,
          days_of_week: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY],
          instructor_id: testUser.id,
          created_by: testUser.id,
          proctor_ids: [testUser.id],
          institution_id: institutionResponse.body.id,
        });
      expect(courseResponse.status).toBe(201);

      // Create exam template
      const examTemplateResponse = await request(app.getHttpServer())
        .post('/exam-templates')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Exam Template',
          description: 'Test Exam Template Description',
          examExclusivityType: ExamExclusivityType.EXAM_ONLY,
          availability_start_date: '2024-01-01',
          availability_end_date: '2024-12-31',
          course_id: courseResponse.body.id,
        });

      expect(examTemplateResponse.status).toBe(201);
      expect(examTemplateResponse.body).toHaveProperty('id');
      expect(examTemplateResponse.body.name).toBe('Test Exam Template');
      expect(examTemplateResponse.body.description).toBe(
        'Test Exam Template Description',
      );
      expect(examTemplateResponse.body.course_id).toBe(courseResponse.body.id);
    });
  });

  describe('PUT /exam-templates/:id', () => {
    it('should update an exam template', async () => {
      // Create test user and get auth token
      const testUser = await createTestUser(module, 'test-exam-templates');
      const authToken = await getAuthToken(
        module,
        'test-exam-templates@test.com',
      );

      // Create test institution
      const institutionResponse = await request(app.getHttpServer())
        .post('/learning-institutions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Institution - Exam Templates',
          description: 'Test Institution for Exam Templates',
          website: 'https://test-institution.com',
          email: 'test-institution@test.com',
          phone: '+1234567890',
        });
      expect(institutionResponse.status).toBe(201);

      // Create test course
      const courseResponse = await request(app.getHttpServer())
        .post('/instructional-courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Course',
          description: 'Test Course Description',
          start_date: '2024-01-01',
          finish_date: '2024-12-31',
          start_time_utc: '09:00',
          duration_minutes: 60,
          days_of_week: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY],
          instructor_id: testUser.id,
          created_by: testUser.id,
          proctor_ids: [testUser.id],
          institution_id: institutionResponse.body.id,
          learning_institution_id: institutionResponse.body.id,
        });
      expect(courseResponse.status).toBe(201);

      // Create exam template
      const createResponse = await request(app.getHttpServer())
        .post('/exam-templates')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Exam Template',
          description: 'Test Description',
          examExclusivityType: ExamExclusivityType.EXAM_ONLY,
          availability_start_date: '2024-01-01',
          availability_end_date: '2024-12-31',
          course_id: courseResponse.body.id,
          created_by: testUser.id,
        });
      expect(createResponse.status).toBe(201);
      console.log('Exam template creation response:', createResponse.body);
      console.log('Using exam template ID:', createResponse.body.id);

      // Update exam template
      const updateResponse = await request(app.getHttpServer())
        .put(`/exam-templates/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Exam Template',
          description: 'Updated Description',
        });
      console.log('Update response:', updateResponse.body);
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.name).toBe('Updated Exam Template');
      expect(updateResponse.body.description).toBe('Updated Description');
    });
  });

  describe('GET /exam-templates/:id', () => {
    it('should get an exam template by id', async () => {
      // Create test user and get auth token
      const testUser = await createTestUser(module, 'test-exam-templates');
      const authToken = await getAuthToken(
        module,
        'test-exam-templates@test.com',
      );

      // Create test institution
      const institutionResponse = await request(app.getHttpServer())
        .post('/learning-institutions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Institution - Exam Templates',
          description: 'Test Institution for Exam Templates',
          website: 'https://test-institution.com',
          email: 'test-institution@test.com',
          phone: '+1234567890',
        });
      expect(institutionResponse.status).toBe(201);

      // Create test course
      const courseResponse = await request(app.getHttpServer())
        .post('/instructional-courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Course',
          description: 'Test Course Description',
          start_date: '2024-01-01',
          finish_date: '2024-12-31',
          start_time_utc: '09:00',
          duration_minutes: 60,
          days_of_week: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY],
          instructor_id: testUser.id,
          created_by: testUser.id,
          proctor_ids: [testUser.id],
          institution_id: institutionResponse.body.id,
          learning_institution_id: institutionResponse.body.id,
        });
      expect(courseResponse.status).toBe(201);

      // Create exam template
      const createResponse = await request(app.getHttpServer())
        .post('/exam-templates')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Exam Template',
          description: 'Test Description',
          examExclusivityType: ExamExclusivityType.EXAM_ONLY,
          availability_start_date: '2024-01-01',
          availability_end_date: '2024-12-31',
          course_id: courseResponse.body.id,
          created_by: testUser.id,
        });
      expect(createResponse.status).toBe(201);

      // Get exam template by id
      const getResponse = await request(app.getHttpServer())
        .get(`/exam-templates/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.id).toBe(createResponse.body.id);
      expect(getResponse.body.name).toBe('Test Exam Template');
      expect(getResponse.body.description).toBe('Test Description');
    });
  });

  describe('DELETE /exam-templates/:id', () => {
    it('should delete an exam template', async () => {
      // Create test user and get auth token
      const testUser = await createTestUser(module, 'test-exam-templates');
      const authToken = await getAuthToken(
        module,
        'test-exam-templates@test.com',
      );

      // Create test institution
      const institutionResponse = await request(app.getHttpServer())
        .post('/learning-institutions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Institution - Exam Templates',
          description: 'Test Institution for Exam Templates',
          website: 'https://test-institution.com',
          email: 'test-institution@test.com',
          phone: '+1234567890',
        });
      expect(institutionResponse.status).toBe(201);

      // Create test course
      const courseResponse = await request(app.getHttpServer())
        .post('/instructional-courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Course',
          description: 'Test Course Description',
          start_date: '2024-01-01',
          finish_date: '2024-12-31',
          start_time_utc: '09:00',
          duration_minutes: 60,
          days_of_week: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY],
          instructor_id: testUser.id,
          created_by: testUser.id,
          proctor_ids: [testUser.id],
          institution_id: institutionResponse.body.id,
          learning_institution_id: institutionResponse.body.id,
        });
      expect(courseResponse.status).toBe(201);

      // Create exam template
      const createResponse = await request(app.getHttpServer())
        .post('/exam-templates')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Exam Template',
          description: 'Test Description',
          examExclusivityType: ExamExclusivityType.EXAM_ONLY,
          availability_start_date: '2024-01-01',
          availability_end_date: '2024-12-31',
          course_id: courseResponse.body.id,
          created_by: testUser.id,
        });
      expect(createResponse.status).toBe(201);

      // Delete exam template
      const deleteResponse = await request(app.getHttpServer())
        .delete(`/exam-templates/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(deleteResponse.status).toBe(200);

      // Verify exam template is deleted by trying to get it
      const getResponse = await request(app.getHttpServer())
        .get(`/exam-templates/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(getResponse.status).toBe(404);
    });
  });
});
