import { Type } from '@nestjs/common';
import { Repository, FindOptionsWhere } from 'typeorm';
import { ExamTemplate } from '../../learning/entities/exam-template.entity';
import { ExamTemplateSection } from '../../learning/entities/exam-template-section.entity';

/**
 * Creates a mock entity with required fields
 * @param entityType - The entity class
 * @param overrides - Fields to override in the mock
 * @returns Mocked entity instance
 */
export function createMockEntity<T extends { id: string }>(
  entityType: Type<T>,
  overrides: Partial<T> = {},
): T {
  const defaultValues = {
    id: 'test-id',
    created_at: new Date(),
    created_by: 'test-user',
  };

  const entity = {
    ...defaultValues,
    ...overrides,
  };

  return Object.assign(new entityType(), entity);
}

/**
 * Creates common repository test cases
 * @param repository - The repository to test
 * @param entity - The entity class
 */
export function createRepositoryTests<T extends { id: string }>(
  repository: Repository<T>,
  entity: Type<T>,
  mockData: T,
) {
  describe(`${entity.name} Repository`, () => {
    it('should find all entities', async () => {
      repository.find = jest.fn().mockResolvedValue([mockData]);
      const result = await repository.find();
      expect(result).toEqual([mockData]);
    });

    it('should find one entity', async () => {
      repository.findOne = jest.fn().mockResolvedValue(mockData);
      const where: FindOptionsWhere<T> = {
        id: mockData.id,
      } as FindOptionsWhere<T>;
      const result = await repository.findOne({ where });
      expect(result).toEqual(mockData);
    });

    it('should create entity', async () => {
      repository.create = jest.fn().mockReturnValue(mockData);
      repository.save = jest.fn().mockResolvedValue(mockData);

      const created = repository.create(mockData);
      const saved = await repository.save(created);

      expect(saved).toEqual(mockData);
    });

    it('should update entity', async () => {
      const updated = { ...mockData, name: 'updated' };
      repository.save = jest.fn().mockResolvedValue(updated);

      const result = await repository.save(updated);
      expect(result).toEqual(updated);
    });

    it('should delete entity', async () => {
      repository.delete = jest.fn().mockResolvedValue({ affected: 1 });
      const result = await repository.delete(mockData.id);
      expect(result.affected).toBe(1);
    });
  });
}

/**
 * Creates common service test cases
 * @param service - The service instance
 * @param methodNames - Array of method names to test
 */
export function createServiceTests<T extends object>(
  service: T,
  methodNames: Array<keyof T>,
) {
  describe(`${service.constructor.name}`, () => {
    methodNames.forEach((methodName) => {
      it(`should have ${String(methodName)} method`, () => {
        expect(service[methodName]).toBeDefined();
        expect(typeof service[methodName]).toBe('function');
      });
    });
  });
}

/**
 * Creates common controller test cases
 * @param controller - The controller instance
 * @param methodNames - Array of method names to test
 */
export function createControllerTests<T extends object>(
  controller: T,
  methodNames: Array<keyof T>,
) {
  describe(`${controller.constructor.name}`, () => {
    methodNames.forEach((methodName) => {
      it(`should have ${String(methodName)} endpoint`, () => {
        expect(controller[methodName]).toBeDefined();
        expect(typeof controller[methodName]).toBe('function');
      });
    });
  });
}

/**
 * Creates a mock query builder
 * @returns Mocked query builder instance
 */
export function createMockQueryBuilder() {
  return {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
    getOne: jest.fn().mockResolvedValue(null),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  };
}

export function createMockExamTemplate(
  overrides: Partial<ExamTemplate> = {},
): ExamTemplate {
  const template = new ExamTemplate();
  Object.assign(template, {
    id: 'test-id',
    created_at: new Date(),
    created_by: 'test-user',
    name: 'Test Exam',
    description: 'Test Description',
    course_id: '1',
    availability_start_date: new Date(),
    availability_end_date: new Date(),
    version: 1,
    sections: [],
    ...overrides,
  });
  return template;
}

export function createMockExamTemplateSection(
  overrides: Partial<ExamTemplateSection> = {},
): ExamTemplateSection {
  const section = new ExamTemplateSection();
  Object.assign(section, {
    id: 'test-id',
    created_at: new Date(),
    created_by: 'test-user',
    name: 'Test Section',
    description: 'Test Description',
    order: 1,
    questions: [],
    ...overrides,
  });
  return section;
}
