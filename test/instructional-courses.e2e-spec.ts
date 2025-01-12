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
import {
  InstructionalCourse,
  DayOfWeek,
} from '../src/learning/entities/instructional-course.entity';
import { LearningInstitution } from '../src/learning/entities/learning-institution.entity';
import { User } from '../src/users/entities/user.entity';
import { createTestingModule } from './test-helper';

describe('InstructionalCoursesController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let courseRepository: Repository<InstructionalCourse>;
  let institutionRepository: Repository<LearningInstitution>;
  let userRepository: Repository<User>;
  let savedInstitution: LearningInstitution;
  let testUser: User;
  let authToken: string;

  beforeAll(async () => {
    const { app: testApp, module: testModule } = await createTestingModule();
    app = testApp;
    moduleFixture = testModule;

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
    await courseRepository.delete({});
    await institutionRepository.delete({
      name: 'Test Institution - Instructional Courses',
    });
    await userRepository.delete({
      username: 'test-instructional-courses@test.com',
    });

    // Create our own test user with a unique identifier for this test suite
    const testUsername = 'test-instructional-courses@test.com';
    testUser = await userRepository.findOne({
      where: { username: testUsername },
    });

    if (!testUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const userToCreate = userRepository.create({
        username: testUsername,
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'Instructional Courses',
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
      name: 'Test Institution - Instructional Courses',
      description: 'A test institution for instructional courses e2e tests',
      website: 'https://test-instructional-courses.com',
      email: 'institution@test-instructional-courses.com',
      phone: '1234567890',
      address: '123 Test St',
      created_by: testUser.id,
    });
    savedInstitution = await institutionRepository.save(institutionToCreate);
  });

  beforeEach(async () => {
    // Clean up only course data before each test
    await courseRepository.delete({
      institution: { id: savedInstitution.id },
    });
  });

  afterAll(async () => {
    try {
      // Clean up ALL test data we created, in correct order
      if (courseRepository && savedInstitution) {
        await courseRepository.delete({
          institution: { id: savedInstitution.id },
        });
      }
      if (institutionRepository && savedInstitution) {
        await institutionRepository.delete({
          id: savedInstitution.id,
        });
      }
      if (userRepository) {
        await userRepository.delete({
          username: 'test-instructional-courses@test.com',
        });
      }
    } finally {
      if (app) {
        await app.close();
      }
    }
  });

  describe('POST /instructional-courses', () => {
    it('should create a new instructional course', () => {
      const createDto = {
        name: 'Test Course',
        description: 'A test course for e2e testing',
        institution: savedInstitution,
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
      const courseToCreate = courseRepository.create({
        name: 'Test Course',
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
      const course = await courseRepository.save(courseToCreate);

      return request(app.getHttpServer())
        .get('/instructional-courses')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body[0].id).toBe(course.id);
          expect(res.body[0].name).toBe(course.name);
          expect(res.body[0].institution_id).toBe(savedInstitution.id);
        });
    });
  });

  describe('GET /instructional-courses/:id', () => {
    it('should return a specific instructional course', async () => {
      const courseToCreate = courseRepository.create({
        name: 'Test Course',
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
      const course = await courseRepository.save(courseToCreate);

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
      const courseToCreate = courseRepository.create({
        name: 'Test Course',
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
      const course = await courseRepository.save(courseToCreate);

      const updateDto = {
        name: 'Updated Course Name',
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
      const courseToCreate = courseRepository.create({
        name: 'Test Course',
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
      const course = await courseRepository.save(courseToCreate);

      return request(app.getHttpServer())
        .delete(`/instructional-courses/${course.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });
});
