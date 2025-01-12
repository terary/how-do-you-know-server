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
import { InstructionalCourse } from '../src/learning/entities/instructional-course.entity';
import { LearningInstitution } from '../src/learning/entities/learning-institution.entity';
import { User } from '../src/users/entities/user.entity';
import {
  createTestingModule,
  getTestUser,
  cleanupTestData,
} from './test-helper';

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
    savedInstitution = await institutionRepository.save({
      name: 'Test Institution',
      description: 'A test institution',
      website: 'https://test.com',
      email: 'test@test.com',
      phone: '1234567890',
      address: '123 Test St',
    });
  });

  beforeEach(async () => {
    // Clean up only course data before each test
    await courseRepository.delete({});
  });

  afterAll(async () => {
    // Clean up all test data in correct order
    await cleanupTestData();
    await app.close();
  });

  // ... rest of test cases ...
});
