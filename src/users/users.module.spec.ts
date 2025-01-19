import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

describe('UsersModule', () => {
  let moduleRef: TestingModule;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      orWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    })),
  };

  const mockDataSource = {
    createEntityManager: jest.fn(),
    createQueryRunner: jest.fn(),
    hasSubscriber: jest.fn(),
    options: {},
  };

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(DataSource)
      .useValue(mockDataSource)
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockRepository)
      .compile();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(moduleRef).toBeDefined();
  });

  it('should import TypeOrmModule.forFeature with User entity', () => {
    const repository = moduleRef.get(getRepositoryToken(User));
    expect(repository).toBeDefined();
    expect(repository).toEqual(mockRepository);
  });

  it('should import ConfigModule', () => {
    const configService = moduleRef.get(ConfigService);
    expect(configService).toBeDefined();
  });

  it('should provide UsersService', () => {
    const usersService = moduleRef.get(UsersService);
    expect(usersService).toBeDefined();
    expect(usersService).toBeInstanceOf(UsersService);
  });

  it('should provide UsersController', () => {
    const usersController = moduleRef.get(UsersController);
    expect(usersController).toBeDefined();
    expect(usersController).toBeInstanceOf(UsersController);
  });

  it('should inject the repository into UsersService', () => {
    const usersService = moduleRef.get(UsersService);
    const repository = moduleRef.get(getRepositoryToken(User));
    expect(repository).toBeDefined();
    expect(repository).toEqual(mockRepository);

    // Test that the repository is working
    repository.find();
    expect(mockRepository.find).toHaveBeenCalled();
  });

  it('should export UsersService', async () => {
    const testModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(DataSource)
      .useValue(mockDataSource)
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockRepository)
      .compile();

    const usersService = testModule.get(UsersService);
    expect(usersService).toBeDefined();
    expect(usersService).toBeInstanceOf(UsersService);
  });

  describe('module configuration', () => {
    it('should have correct imports', () => {
      const metadata = Reflect.getMetadata('imports', UsersModule);
      expect(metadata).toBeDefined();
      expect(metadata).toContain(ConfigModule);
      // TypeOrmModule.forFeature returns a DynamicModule, so we need to check differently
      expect(
        metadata.some(
          (item) =>
            item &&
            typeof item === 'object' &&
            item.module &&
            item.module.name === 'TypeOrmModule',
        ),
      ).toBeTruthy();
    });

    it('should have correct providers', () => {
      const metadata = Reflect.getMetadata('providers', UsersModule);
      expect(metadata).toBeDefined();
      expect(metadata).toContain(UsersService);
    });

    it('should have correct controllers', () => {
      const metadata = Reflect.getMetadata('controllers', UsersModule);
      expect(metadata).toBeDefined();
      expect(metadata).toContain(UsersController);
    });

    it('should have correct exports', () => {
      const metadata = Reflect.getMetadata('exports', UsersModule);
      expect(metadata).toBeDefined();
      expect(metadata).toContain(UsersService);
    });
  });
});
