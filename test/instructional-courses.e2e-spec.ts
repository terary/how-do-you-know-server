import { config } from 'dotenv';
import { resolve } from 'path';

// Load test environment variables
config({ path: resolve(__dirname, '../.env.test') });

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  InstructionalCourse,
  DayOfWeek,
} from '../src/learning/entities/instructional-course.entity';
import { LearningInstitution } from '../src/learning/entities/learning-institution.entity';
import { User } from '../src/users/entities/user.entity';
import {
  createTestingModule,
  createTestUser,
  createTestInstitution,
  cleanupTestEntityData,
} from './test-helper';

describe('InstructionalCoursesController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let courseRepository: Repository<InstructionalCourse>;
  let savedInstitution: LearningInstitution;
  let testUser: User;
  let authToken: string;

  const testUsername = 'test-instructional-courses@test.com';
  const testInstitutionName = 'Test Institution - Instructional Courses';
  const testCourseName = 'Test Course - Instructional Courses';

  beforeAll(async () => {
    const { app: testApp, module: testModule } = await createTestingModule();
    app = testApp;
    moduleFixture = testModule;

    courseRepository = moduleFixture.get<Repository<InstructionalCourse>>(
      getRepositoryToken(InstructionalCourse),
    );

    try {
      // Clean up any existing test data first, in correct order
      await cleanupTestEntityData(moduleFixture, InstructionalCourse, {
        name: testCourseName,
      });
      await cleanupTestEntityData(moduleFixture, LearningInstitution, {
        name: testInstitutionName,
      });
      await cleanupTestEntityData(moduleFixture, User, {
        username: testUsername,
      });

      // Create test user with cleanup
      testUser = await createTestUser(moduleFixture, testUsername, [
        'admin:exams',
        'admin:users',
        'user',
        'public',
      ]);

      // Create test institution
      savedInstitution = await createTestInstitution(
        moduleFixture,
        testInstitutionName,
        testUser.id,
      );

      // Get auth token
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: testUsername,
          password: 'password123',
        });

      if (!loginResponse.body.access_token) {
        throw new Error('Failed to get auth token');
      }

      authToken = loginResponse.body.access_token;
      console.log('Successfully obtained auth token');
    } catch (error) {
      console.error('Error in test setup:', error);
      throw error;
    }
  });

  beforeEach(async () => {
    try {
      // Clean up only course data before each test
      await cleanupTestEntityData(moduleFixture, InstructionalCourse, {
        name: testCourseName,
      });

      // Verify auth token is still valid
      const testResponse = await request(app.getHttpServer())
        .get('/instructional-courses')
        .set('Authorization', `Bearer ${authToken}`);

      if (testResponse.status === 401) {
        // Re-login if token expired
        const loginResponse = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            username: testUsername,
            password: 'password123',
          });

        if (!loginResponse.body.access_token) {
          throw new Error('Failed to refresh auth token');
        }

        authToken = loginResponse.body.access_token;
        console.log('Successfully refreshed auth token');
      }
    } catch (error) {
      console.error('Error in beforeEach cleanup:', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      // Clean up ALL test data we created, in correct order
      await cleanupTestEntityData(moduleFixture, InstructionalCourse, {
        name: testCourseName,
      });
      await cleanupTestEntityData(moduleFixture, LearningInstitution, {
        name: testInstitutionName,
      });
      await cleanupTestEntityData(moduleFixture, User, {
        username: testUsername,
      });
    } catch (error) {
      console.error('Error in test cleanup:', error);
      throw error;
    } finally {
      if (app) {
        await app.close();
      }
    }
  });

  describe('POST /instructional-courses', () => {
    it('should create a new instructional course', () => {
      const createDto = {
        name: testCourseName,
        description: 'A test course for e2e testing',
        institution_id: savedInstitution.id,
        start_date: new Date('2024-01-01'),
        finish_date: new Date('2024-12-31'),
        start_time_utc: '14:00',
        duration_minutes: 90,
        days_of_week: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY],
        instructor_id: testUser.id,
        proctor_ids: [],
      };

      return request(app.getHttpServer())
        .post('/instructional-courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createDto.name);
          expect(res.body.description).toBe(createDto.description);
          expect(res.body.institution_id).toBe(savedInstitution.id);
          expect(new Date(res.body.start_date)).toEqual(createDto.start_date);
          expect(new Date(res.body.finish_date)).toEqual(createDto.finish_date);
          expect(res.body.created_by).toBe(testUser.id);
        });
    });
  });

  describe('GET /instructional-courses', () => {
    it('should return all instructional courses', async () => {
      // Create test course
      const course = await courseRepository.save({
        name: testCourseName,
        description: 'A test course for e2e testing',
        institution: savedInstitution,
        start_date: new Date('2024-01-01'),
        finish_date: new Date('2024-12-31'),
        start_time_utc: '14:00',
        duration_minutes: 90,
        days_of_week: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY],
        instructor_id: testUser.id,
        proctor_ids: [],
        created_by: testUser.id,
      });

      return request(app.getHttpServer())
        .get('/instructional-courses')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          const testCourse = res.body.find((c: any) => c.id === course.id);
          expect(testCourse).toBeDefined();
          expect(testCourse.name).toBe(course.name);
          expect(testCourse.institution_id).toBe(savedInstitution.id);
        });
    });
  });

  describe('GET /instructional-courses/:id', () => {
    it('should return a specific instructional course', async () => {
      const course = await courseRepository.save({
        name: testCourseName,
        description: 'A test course for e2e testing',
        institution: savedInstitution,
        start_date: new Date('2024-01-01'),
        finish_date: new Date('2024-12-31'),
        start_time_utc: '14:00',
        duration_minutes: 90,
        days_of_week: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY],
        instructor_id: testUser.id,
        proctor_ids: [],
        created_by: testUser.id,
      });

      return request(app.getHttpServer())
        .get(`/instructional-courses/${course.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(course.id);
          expect(res.body.name).toBe(course.name);
          expect(res.body.institution_id).toBe(savedInstitution.id);
        });
    });

    it('should return 404 for non-existent course', () => {
      return request(app.getHttpServer())
        .get('/instructional-courses/12345678-1234-1234-1234-123456789999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('PATCH /instructional-courses/:id', () => {
    it('should update an instructional course', async () => {
      const course = await courseRepository.save({
        name: testCourseName,
        description: 'A test course for e2e testing',
        institution: savedInstitution,
        start_date: new Date('2024-01-01'),
        finish_date: new Date('2024-12-31'),
        start_time_utc: '14:00',
        duration_minutes: 90,
        days_of_week: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY],
        instructor_id: testUser.id,
        proctor_ids: [],
        created_by: testUser.id,
      });

      const updateDto = {
        name: `${testCourseName} Updated`,
        description: 'Updated course description',
        start_date: new Date('2024-02-01'),
      };

      return request(app.getHttpServer())
        .patch(`/instructional-courses/${course.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(updateDto.name);
          expect(res.body.description).toBe(updateDto.description);
          expect(new Date(res.body.start_date)).toEqual(updateDto.start_date);
          expect(res.body.institution_id).toBe(savedInstitution.id);
        });
    });
  });

  describe('DELETE /instructional-courses/:id', () => {
    it('should delete an instructional course', async () => {
      const course = await courseRepository.save({
        name: testCourseName,
        description: 'A test course for e2e testing',
        institution: savedInstitution,
        start_date: new Date('2024-01-01'),
        finish_date: new Date('2024-12-31'),
        start_time_utc: '14:00',
        duration_minutes: 90,
        days_of_week: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY],
        instructor_id: testUser.id,
        proctor_ids: [],
        created_by: testUser.id,
      });

      return request(app.getHttpServer())
        .delete(`/instructional-courses/${course.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });
});
