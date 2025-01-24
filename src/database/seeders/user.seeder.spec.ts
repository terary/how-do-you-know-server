import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSeeder } from './user.seeder';
import { User } from '../../users/entities/user.entity';

describe('UserSeeder', () => {
  let seeder: UserSeeder;
  let repository: Repository<User>;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserSeeder,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    seeder = module.get<UserSeeder>(UserSeeder);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  describe('seed', () => {
    it('should create admin user with correct tags', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      mockRepository.create.mockImplementation((dto) => dto);
      mockRepository.save.mockImplementation((user) => Promise.resolve(user));

      await seeder.seed();

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'admin',
          user_defined_tags: 'users:tag1 users:common',
        }),
      );
    });

    it('should create regular users with correct tags', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockImplementation((dto) => dto);
      mockRepository.save.mockImplementation((user) => Promise.resolve(user));

      await seeder.seed();

      // Check user1's tags
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'user1',
          user_defined_tags: 'users:tag2 users:common',
        }),
      );

      // Check user2's tags
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'user2',
          user_defined_tags: 'users:tag3 users:common',
        }),
      );
    });

    it('should update existing admin user tags', async () => {
      const existingAdmin = {
        username: 'admin',
        roles: ['user'],
        user_defined_tags: 'old:tag',
      };

      mockRepository.findOne
        .mockResolvedValueOnce(existingAdmin) // For admin
        .mockResolvedValue(null); // For other users

      await seeder.seed();

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'admin',
          user_defined_tags: 'users:tag1 users:common',
        }),
      );
    });

    it('should handle imported users with default tags', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockImplementation((dto) => dto);
      mockRepository.save.mockImplementation((user) => Promise.resolve(user));

      await seeder.seed();

      // Verify that imported users get default tags
      const createCalls = mockRepository.create.mock.calls;
      const importedUserCall = createCalls.find(
        ([user]) => !['admin', 'user1', 'user2'].includes(user.username),
      );

      expect(importedUserCall[0]).toHaveProperty(
        'user_defined_tags',
        'users:common',
      );
    });
  });
});
