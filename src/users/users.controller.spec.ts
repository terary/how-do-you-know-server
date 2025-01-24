import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateTagsDto } from '../common/dto/update-tags.dto';
import { TUserRole } from './types';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  // Mock repository
  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  // Mock config service
  const mockConfigService = {
    get: jest.fn((key: string) => {
      // Add any config values your service needs
      if (key === 'JWT_SECRET') return 'test-secret';
      return null;
    }),
  };

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

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    updateTags: jest.fn(),
    findByTags: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        roles: ['user'] as TUserRole[],
      };

      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should handle errors when creating a user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        roles: ['user'] as TUserRole[],
      };

      const error = new Error('Failed to create user');
      mockUsersService.create.mockRejectedValue(error);

      await expect(controller.create(createUserDto)).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUsersService.findAll.mockResolvedValue([mockUser]);

      const result = await controller.findAll();

      expect(result).toEqual([mockUser]);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no users exist', async () => {
      mockUsersService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by username', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith('test@example.com');
    });

    it('should handle not found user', async () => {
      mockUsersService.findOne.mockResolvedValue(null);

      const result = await controller.findOne('nonexistent@example.com');

      expect(result).toBeNull();
      expect(mockUsersService.findOne).toHaveBeenCalledWith(
        'nonexistent@example.com',
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const updatedUser = { ...mockUser, ...updateUserDto };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update('test@example.com', updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(mockUsersService.update).toHaveBeenCalledWith(
        'test@example.com',
        updateUserDto,
      );
    });

    it('should handle not found user during update', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      mockUsersService.update.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(
        controller.update('nonexistent@example.com', updateUserDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      await controller.remove('test@example.com');

      expect(mockUsersService.remove).toHaveBeenCalledWith('test@example.com');
    });

    it('should handle not found user during removal', async () => {
      mockUsersService.remove.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(
        controller.remove('nonexistent@example.com'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTags', () => {
    it('should update user tags', async () => {
      const updateTagsDto: UpdateTagsDto = {
        tags: 'tag1 tag2',
      };

      const updatedUser = {
        ...mockUser,
        user_defined_tags: updateTagsDto.tags,
      };
      mockUsersService.updateTags.mockResolvedValue(updatedUser);

      const result = await controller.updateTags('1', updateTagsDto);

      expect(result).toEqual(updatedUser);
      expect(mockUsersService.updateTags).toHaveBeenCalledWith(
        '1',
        updateTagsDto,
      );
    });

    it('should handle not found user during tag update', async () => {
      const updateTagsDto: UpdateTagsDto = {
        tags: 'tag1 tag2',
      };

      mockUsersService.updateTags.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(controller.updateTags('999', updateTagsDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByTags', () => {
    it('should find users by tags', async () => {
      const tags = 'tag1 tag2';
      mockUsersService.findByTags.mockResolvedValue([mockUser]);

      const result = await controller.findByTags(tags);

      expect(result).toEqual([mockUser]);
      expect(mockUsersService.findByTags).toHaveBeenCalledWith(tags);
    });

    it('should return empty array when no users match tags', async () => {
      const tags = 'nonexistent-tag';
      mockUsersService.findByTags.mockResolvedValue([]);

      const result = await controller.findByTags(tags);

      expect(result).toEqual([]);
      expect(mockUsersService.findByTags).toHaveBeenCalledWith(tags);
    });
  });
});
