import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { TUserRole } from './types';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;
  let configService: ConfigService;

  const mockUser: User = {
    id: '1',
    username: 'test@example.com',
    password: 'hashedPassword123',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    roles: ['user', 'public'] as TUserRole[],
    createdAt: new Date(),
    updatedAt: new Date(),
    user_defined_tags: '',
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      orWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([mockUser]),
    })),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should skip default user creation in test environment', async () => {
      await service.onModuleInit();
      expect(mockRepository.findOne).not.toHaveBeenCalled();
    });

    it('should create default user if not in test environment and user does not exist', async () => {
      mockConfigService.get.mockReturnValueOnce('development');
      mockRepository.findOne.mockResolvedValueOnce(null);
      mockRepository.create.mockReturnValueOnce(mockUser);
      mockRepository.save.mockResolvedValueOnce(mockUser);

      await service.onModuleInit();

      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser@example.com',
        password: 'plainPassword123',
        firstName: 'New',
        lastName: 'User',
        email: 'newuser@example.com',
        roles: ['user' as TUserRole],
      };

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const expectedUser = {
        ...mockUser,
        ...createUserDto,
        password: hashedPassword,
      };

      mockRepository.create.mockReturnValue(expectedUser);
      mockRepository.save.mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should not hash already hashed passwords', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const createUserDto: CreateUserDto = {
        username: 'newuser@example.com',
        password: hashedPassword,
        firstName: 'New',
        lastName: 'User',
        email: 'newuser@example.com',
        roles: ['user' as TUserRole],
      };

      mockRepository.create.mockReturnValue({ ...mockUser, ...createUserDto });
      mockRepository.save.mockResolvedValue({ ...mockUser, ...createUserDto });

      const result = await service.create(createUserDto);

      expect(result.password).toBe(hashedPassword);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockRepository.find.mockResolvedValue([mockUser]);
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user by username', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.findOne('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      const result = await service.findOne('nonexistent@example.com');
      expect(result).toBeNull();
    });
  });

  describe('updateUserProfile', () => {
    it('should update allowed user profile fields', async () => {
      const updates = {
        firstName: 'Updated',
        lastName: 'Name',
        email: 'updated@example.com',
      };
      const updatedUser = { ...mockUser, ...updates };

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateUserProfile(
        'test@example.com',
        updates,
      );

      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateUserProfile('nonexistent@example.com', {
          firstName: 'Test',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update user with provided data', async () => {
      const updateUserDto = {
        firstName: 'Updated',
        lastName: 'User',
      };
      const updatedUser = { ...mockUser, ...updateUserDto };

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update('test@example.com', updateUserDto);

      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('nonexistent@example.com', { firstName: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.remove.mockResolvedValue(mockUser);

      await service.remove('test@example.com');

      expect(mockRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('nonexistent@example.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByUsername', () => {
    it('should return a user by username', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.findByUsername('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      const result = await service.findByUsername('nonexistent@example.com');
      expect(result).toBeNull();
    });
  });

  describe('updateTags', () => {
    it('should update user tags', async () => {
      const updateTagsDto = { tags: 'tag1 tag2' };
      const updatedUser = {
        ...mockUser,
        user_defined_tags: updateTagsDto.tags,
      };

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateTags(
        'test@example.com',
        updateTagsDto,
      );

      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateTags('nonexistent@example.com', { tags: 'tag1' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByTags', () => {
    it('should return users with matching tags', async () => {
      const result = await service.findByTags('tag1 tag2');
      expect(result).toEqual([mockUser]);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should return empty array for empty tags string', async () => {
      const result = await service.findByTags('');
      expect(result).toEqual([]);
    });
  });
});
