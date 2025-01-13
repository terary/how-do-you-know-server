import { config } from 'dotenv';
import { resolve } from 'path';

// Load test environment variables
config({ path: resolve(__dirname, '../.env.test') });

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { LearningInstitution } from '../src/learning/entities/learning-institution.entity';
import {
  createTestingModule,
  createTestUser,
  cleanupTestEntityData,
} from './test-helper';

describe('LearningInstitutionsController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let institutionRepository: Repository<LearningInstitution>;
  let savedUser: User;
  let authToken: string;
  const testUsername = 'test-learning-institutions@test.com';
  const testInstitutionName = 'Test University - Learning Institutions';

  beforeAll(async () => {
    // Create the app and module
    const { app: testApp, module: testModule } = await createTestingModule();
    app = testApp;
    moduleFixture = testModule;

    // Get repositories
    institutionRepository = moduleFixture.get<Repository<LearningInstitution>>(
      getRepositoryToken(LearningInstitution),
    );

    try {
      // Clean up any existing test data first
      await cleanupTestEntityData(moduleFixture, LearningInstitution, {
        name: testInstitutionName,
      });
      await cleanupTestEntityData(moduleFixture, User, {
        username: testUsername,
      });

      // Create test user with cleanup
      savedUser = await createTestUser(moduleFixture, testUsername, [
        'admin:exams',
      ]);

      // Login to get auth token
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
      // Clean up only institution data before each test
      await cleanupTestEntityData(moduleFixture, LearningInstitution, {
        name: testInstitutionName,
      });

      // Verify auth token is still valid
      const testResponse = await request(app.getHttpServer())
        .get('/learning-institutions')
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
      // Clean up ALL test data we created
      await cleanupTestEntityData(moduleFixture, LearningInstitution, {
        name: testInstitutionName,
      });
      await cleanupTestEntityData(moduleFixture, User, {
        username: testUsername,
      });
    } catch (error) {
      console.error('Error in test cleanup:', error);
    } finally {
      if (app) {
        await app.close();
      }
    }
  });

  describe('POST /learning-institutions', () => {
    it('should create a new learning institution', () => {
      const createDto = {
        name: testInstitutionName,
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
          expect(res.body.created_by).toBe(savedUser.id);
        });
    });
  });

  describe('GET /learning-institutions', () => {
    it('should return all learning institutions', async () => {
      // Create test data
      const institution = await institutionRepository.save({
        name: testInstitutionName,
        description: 'A test university for e2e testing',
        website: 'https://test.edu',
        email: 'contact@test.edu',
        phone: '123-456-7890',
        address: '123 Test St, Test City, TS 12345',
        created_by: savedUser.id,
      });

      return request(app.getHttpServer())
        .get('/learning-institutions')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          const testInstitution = res.body.find(
            (inst: any) => inst.id === institution.id,
          );
          expect(testInstitution).toBeDefined();
          expect(testInstitution.name).toBe(institution.name);
        });
    });
  });

  describe('GET /learning-institutions/:id', () => {
    it('should return a specific learning institution', async () => {
      const institution = await institutionRepository.save({
        name: testInstitutionName,
        description: 'A test university for e2e testing',
        website: 'https://test.edu',
        email: 'contact@test.edu',
        phone: '123-456-7890',
        address: '123 Test St, Test City, TS 12345',
        created_by: savedUser.id,
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
        name: testInstitutionName,
        description: 'A test university for e2e testing',
        website: 'https://test.edu',
        email: 'contact@test.edu',
        phone: '123-456-7890',
        address: '123 Test St, Test City, TS 12345',
        created_by: savedUser.id,
      });

      const updateDto = {
        name: `${testInstitutionName} Updated`,
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
        name: testInstitutionName,
        description: 'A test university for e2e testing',
        website: 'https://test.edu',
        email: 'contact@test.edu',
        phone: '123-456-7890',
        address: '123 Test St, Test City, TS 12345',
        created_by: savedUser.id,
      });

      return request(app.getHttpServer())
        .delete(`/learning-institutions/${institution.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });
});
