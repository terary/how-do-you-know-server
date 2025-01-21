import { Type } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

export const createMockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
    getOne: jest.fn().mockResolvedValue(null),
  })),
});

const mockDataSource = {
  createEntityManager: jest.fn(),
  createQueryRunner: jest.fn(),
  getRepository: jest.fn(),
} as unknown as DataSource;

export const createTypeOrmMock = (entities: Type<any>[]) => ({
  module: class TypeOrmModule {
    static forRoot() {
      return {
        module: TypeOrmModule,
        providers: [
          {
            provide: DataSource,
            useValue: mockDataSource,
          },
        ],
      };
    }

    static forFeature(entities: Type<any>[]) {
      return {
        module: TypeOrmModule,
        providers: entities.map((entity) => ({
          provide: getRepositoryToken(entity),
          useFactory: () => createMockRepository(),
        })),
        exports: entities.map((entity) => getRepositoryToken(entity)),
      };
    }
  },
  providers: [
    {
      provide: DataSource,
      useValue: mockDataSource,
    },
    ...entities.map((entity) => ({
      provide: getRepositoryToken(entity),
      useFactory: () => createMockRepository(),
    })),
  ],
});

export const createModuleMetadata = (imports: any[]) => ({
  imports,
});
