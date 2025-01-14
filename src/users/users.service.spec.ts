import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { TUserRole } from './types';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        roles: ['user' as TUserRole],
      };

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const expectedUser = {
        ...createUserDto,
        password: hashedPassword,
      };

      mockUserRepository.create.mockReturnValue(expectedUser);
      mockUserRepository.save.mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: expect.any(String),
        roles: ['user'],
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(expectedUser);
    });

    it('should not rehash an already hashed password', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        roles: ['user' as TUserRole],
      };

      mockUserRepository.create.mockReturnValue(createUserDto);
      mockUserRepository.save.mockResolvedValue(createUserDto);

      const result = await service.create(createUserDto);

      expect(result.password).toBe(hashedPassword);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const expectedUsers = [
        {
          username: 'user1',
          firstName: 'User',
          lastName: 'One',
          email: 'user1@example.com',
          roles: ['user' as TUserRole],
        },
        {
          username: 'user2',
          firstName: 'User',
          lastName: 'Two',
          email: 'user2@example.com',
          roles: ['user' as TUserRole],
        },
      ];

      mockUserRepository.find.mockResolvedValue(expectedUsers);

      const result = await service.findAll();

      expect(result).toEqual(expectedUsers);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user when found', async () => {
      const username = 'testuser';
      const expectedUser = {
        username,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        roles: ['user' as TUserRole],
      };

      mockUserRepository.findOne.mockResolvedValue(expectedUser);

      const result = await service.findOne(username);

      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { username },
      });
    });

    it('should return null when user not found', async () => {
      const username = 'nonexistent';

      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(username);

      expect(result).toBeNull();
    });
  });

  describe('updateUserProfile', () => {
    it('should update allowed user profile fields', async () => {
      const username = 'testuser';
      const updates: Partial<User> = {
        firstName: 'Updated',
        lastName: 'Name',
        email: 'updated@example.com',
      };

      const existingUser = {
        username,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        roles: ['user' as TUserRole],
      };

      const expectedUser = {
        ...existingUser,
        ...updates,
      };

      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockUserRepository.save.mockResolvedValue(expectedUser);

      const result = await service.updateUserProfile(username, updates);

      expect(result).toEqual(expectedUser);
      expect(result.roles).toEqual(['user']);
    });

    it('should throw NotFoundException when user not found', async () => {
      const username = 'nonexistent';
      const updates: Partial<User> = { firstName: 'Updated' };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateUserProfile(username, updates),
      ).rejects.toThrow('User not found');
    });
  });
});
