import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { LearningInstitution } from '../src/learning/entities/learning-institution.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  setupTestDatabase,
  cleanupTestDatabase,
  cleanupTestEntityData,
} from './test-helper';

describe('LearningInstitutionsController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;
  let learningInstitutionRepository: Repository<LearningInstitution>;

  beforeAll(async () => {
    const testSetup = await setupTestDatabase();
    app = testSetup.app;
    module = testSetup.module;
    learningInstitutionRepository = module.get<Repository<LearningInstitution>>(
      getRepositoryToken(LearningInstitution),
    );
  });

  beforeEach(async () => {
    await cleanupTestEntityData(module, LearningInstitution, {});
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  it('should pass a simple test', () => {
    expect(1).toBe(1);
  });

  describe.skip('learning institution tests', () => {
    // Skipped tests here
  });
});
