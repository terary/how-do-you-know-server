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
  createTestingModule,
  cleanupTestDatabase,
  cleanupTestData,
} from './test-helper';

describe('LearningInstitutionsController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let institutionRepository: Repository<LearningInstitution>;
  let userRepository: Repository<User>;
  let savedUser: User;
  let authToken: string;
  const mockUser = {
    id: undefined as string | undefined,
    roles: ['admin:exams'],
  };

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

    // Create test user
    const testUser = userRepository.create({
      username: 'test.admin',
      firstName: 'Test',
      lastName: 'Admin',
      email: 'test.admin@test.edu',
      password: await bcrypt.hash('password123', 10),
      roles: ['admin:exams'] as TUserRole[],
    });
    savedUser = await userRepository.save(testUser);
    mockUser.id = savedUser.id;

    // Login to get auth token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'test.admin',
        password: 'password123',
      });
    authToken = loginResponse.body.access_token;
  });

  beforeEach(async () => {
    // Clean up test-specific data
    await cleanupTestData();
  });

  afterAll(async () => {
    try {
      await app.close();
    } finally {
      await cleanupTestDatabase();
    }
  });

  describe('POST /learning-institutions', () => {
    it('should create a new learning institution', () => {
      const createDto = {
        name: 'Test University',
        description: 'A test university for e2e testing',
        website: 'https://test.edu',
        email: 'contact@test.edu',
        phone: '123-456-7890',
        address: '123 Test St, Test City, TS 12345',
      };

      return request(app.getHttpServer())
        .post('/learning-institutions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createDto.name);
          expect(res.body.description).toBe(createDto.description);
          expect(res.body.website).toBe(createDto.website);
          expect(res.body.email).toBe(createDto.email);
          expect(res.body.phone).toBe(createDto.phone);
          expect(res.body.address).toBe(createDto.address);
          expect(res.body.created_by).toBe(mockUser.id);
        });
    });
  });

  describe('GET /learning-institutions', () => {
    it('should return all learning institutions', async () => {
      // Create test data
      const institution = await institutionRepository.save({
        name: 'Test University',
        description: 'A test university for e2e testing',
        website: 'https://test.edu',
        email: 'contact@test.edu',
        phone: '123-456-7890',
        address: '123 Test St, Test City, TS 12345',
        created_by: mockUser.id,
      });

      return request(app.getHttpServer())
        .get('/learning-institutions')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body[0].id).toBe(institution.id);
          expect(res.body[0].name).toBe(institution.name);
        });
    });
  });

  describe('GET /learning-institutions/:id', () => {
    it('should return a specific learning institution', async () => {
      const institution = await institutionRepository.save({
        name: 'Test University',
        description: 'A test university for e2e testing',
        website: 'https://test.edu',
        email: 'contact@test.edu',
        phone: '123-456-7890',
        address: '123 Test St, Test City, TS 12345',
        created_by: mockUser.id,
      });

      return request(app.getHttpServer())
        .get(`/learning-institutions/${institution.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(institution.id);
          expect(res.body.name).toBe(institution.name);
        });
    });

    it('should return 404 for non-existent institution', () => {
      return request(app.getHttpServer())
        .get('/learning-institutions/12345678-1234-1234-1234-123456789999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('PATCH /learning-institutions/:id', () => {
    it('should update a learning institution', async () => {
      const institution = await institutionRepository.save({
        name: 'Test University',
        description: 'A test university for e2e testing',
        website: 'https://test.edu',
        email: 'contact@test.edu',
        phone: '123-456-7890',
        address: '123 Test St, Test City, TS 12345',
        created_by: mockUser.id,
      });

      const updateDto = {
        name: 'Updated University Name',
        description: 'Updated university description',
        website: 'https://updated.edu',
      };

      return request(app.getHttpServer())
        .patch(`/learning-institutions/${institution.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(updateDto.name);
          expect(res.body.description).toBe(updateDto.description);
          expect(res.body.website).toBe(updateDto.website);
          expect(res.body.email).toBe(institution.email);
          expect(res.body.phone).toBe(institution.phone);
        });
    });
  });

  describe('DELETE /learning-institutions/:id', () => {
    it('should delete a learning institution', async () => {
      const institution = await institutionRepository.save({
        name: 'Test University',
        description: 'A test university for e2e testing',
        website: 'https://test.edu',
        email: 'contact@test.edu',
        phone: '123-456-7890',
        address: '123 Test St, Test City, TS 12345',
        created_by: mockUser.id,
      });

      return request(app.getHttpServer())
        .delete(`/learning-institutions/${institution.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });
});
