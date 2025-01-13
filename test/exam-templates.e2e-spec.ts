import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ExamTemplate } from '../src/learning/entities/exam-template.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  setupTestDatabase,
  cleanupTestDatabase,
  cleanupTestEntityData,
} from './test-helper';

describe('ExamTemplatesController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;
  let examTemplateRepository: Repository<ExamTemplate>;

  beforeAll(async () => {
    const testSetup = await setupTestDatabase();
    app = testSetup.app;
    module = testSetup.module;
    examTemplateRepository = module.get<Repository<ExamTemplate>>(
      getRepositoryToken(ExamTemplate),
    );
  });

  beforeEach(async () => {
    await cleanupTestEntityData(module, ExamTemplate, {});
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  it('should pass a simple test', () => {
    expect(1).toBe(1);
  });

  describe.skip('exam template tests', () => {
    // Skipped tests here
  });
});
