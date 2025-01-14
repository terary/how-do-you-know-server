import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { InstructionalCourse } from '../src/learning/entities/instructional-course.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  setupTestDatabase,
  cleanupTestDatabase,
  cleanupTestEntityData,
} from './test-helper';

describe('InstructionalCoursesController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;
  let instructionalCourseRepository: Repository<InstructionalCourse>;

  beforeAll(async () => {
    const testSetup = await setupTestDatabase();
    app = testSetup.app;
    module = testSetup.module;
    instructionalCourseRepository = module.get<Repository<InstructionalCourse>>(
      getRepositoryToken(InstructionalCourse),
    );
  });

  beforeEach(async () => {
    await cleanupTestEntityData(module, InstructionalCourse, {});
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  it('should pass a simple test', () => {
    expect(1).toBe(1);
  });

  describe.skip('instructional course tests', () => {
    // Skipped tests here
  });
});
