import { config } from 'dotenv';
import { resolve } from 'path';

// Load test environment variables
config({ path: resolve(__dirname, '../.env.test') });

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FodderPool, FodderItem } from '../src/questions/entities';
import { User } from '../src/users/entities/user.entity';
import { TUserRole } from '../src/users/types';
import { QuestionTemplateValidAnswer } from '../src/questions/entities/question-template-valid-answer.entity';
import * as bcrypt from 'bcrypt';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let fodderPoolRepo: Repository<FodderPool>;
  let fodderItemRepo: Repository<FodderItem>;
  let userRepo: Repository<User>;
  let validAnswerRepo: Repository<QuestionTemplateValidAnswer>;

  const testUser = {
    username: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    roles: ['admin:exams', 'admin:users', 'user', 'public'] as TUserRole[],
  };

  const cleanupTestData = async () => {
    try {
      // Delete in correct order to avoid foreign key constraints
      await validAnswerRepo?.query(
        'DELETE FROM question_template_valid_answers',
      );
      await fodderPoolRepo?.query('DELETE FROM fodder_items');
      await fodderPoolRepo?.query('DELETE FROM fodder_pools');
      await userRepo?.query('DELETE FROM exam_template_section_questions');
      await userRepo?.query('DELETE FROM exam_template_sections');
      await userRepo?.query('DELETE FROM exam_templates');
      await userRepo?.query('DELETE FROM instructional_courses');
      await userRepo?.query('DELETE FROM users');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  };

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get repositories
    fodderPoolRepo = moduleFixture.get<Repository<FodderPool>>(
      getRepositoryToken(FodderPool),
    );
    fodderItemRepo = moduleFixture.get<Repository<FodderItem>>(
      getRepositoryToken(FodderItem),
    );
    userRepo = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    validAnswerRepo = moduleFixture.get<
      Repository<QuestionTemplateValidAnswer>
    >(getRepositoryToken(QuestionTemplateValidAnswer));

    // Clean up any existing test data
    await cleanupTestData();

    // Create test user
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    const user = userRepo.create({
      ...testUser,
      password: hashedPassword,
    });
    await userRepo.save(user);
  });

  afterAll(async () => {
    // Clean up the database
    await cleanupTestData();

    // Close the application
    await app.close();

    // Close the module
    await moduleFixture.close();
  });

  describe('Auth', () => {
    it('/auth/login (POST) - should login successfully', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
        });
    });
  });

  describe('Fodder Pools and Pool Items', () => {
    let authToken: string;
    let testPoolId: string;
    let grapeItemId: string;

    beforeAll(async () => {
      // Get auth token for subsequent requests
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password,
        });
      authToken = response.body.access_token;
    });

    it('/fodder-pools (POST) - should create a fodder pool with items', async () => {
      const response = await request(app.getHttpServer())
        .post('/fodder-pools')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Fruits',
          description: 'Test fruit options',
          items: [
            { text: 'Apple' },
            { text: 'Banana' },
            { text: 'Orange' },
            { text: 'Grapes' },
          ],
        })
        .expect(201);

      expect(response.body.name).toBe('Test Fruits');
      expect(response.body.items).toHaveLength(4);

      // Store the pool ID and find the Grapes item ID
      testPoolId = response.body.id;
      const grapesItem = response.body.items.find(
        (item) => item.text === 'Grapes',
      );
      grapeItemId = grapesItem.id;
    });

    it('/fodder-pools (GET) - should get all fodder pools', () => {
      return request(app.getHttpServer())
        .get('/fodder-pools')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          const pool = res.body.find((p) => p.id === testPoolId);
          expect(pool).toBeDefined();
          expect(pool.items).toHaveLength(4);
        });
    });

    it('/fodder-pools/:poolId/items (DELETE) - should remove Grapes item', async () => {
      // Remove the Grapes item
      await request(app.getHttpServer())
        .delete(`/fodder-pools/${testPoolId}/items`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          itemIds: [grapeItemId],
        })
        .expect(200);

      // Verify the item was removed
      const response = await request(app.getHttpServer())
        .get(`/fodder-pools/${testPoolId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.items).toHaveLength(3);
      expect(response.body.items.some((item) => item.text === 'Grapes')).toBe(
        false,
      );
    });

    it('/fodder-pools/:poolId/items (POST) - should add Starfruit item', async () => {
      // Add the Starfruit item
      const addResponse = await request(app.getHttpServer())
        .post(`/fodder-pools/${testPoolId}/items`)
        .set('Authorization', `Bearer ${authToken}`)
        .send([{ text: 'Starfruit' }])
        .expect(201);

      // Verify the item was added
      expect(Array.isArray(addResponse.body)).toBe(true);
      expect(addResponse.body).toHaveLength(1);
      expect(addResponse.body[0].text).toBe('Starfruit');

      // Verify the pool now has the new item
      const poolResponse = await request(app.getHttpServer())
        .get(`/fodder-pools/${testPoolId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(poolResponse.body.items).toHaveLength(4);
      expect(
        poolResponse.body.items.some((item) => item.text === 'Starfruit'),
      ).toBe(true);
    });
  });
});
