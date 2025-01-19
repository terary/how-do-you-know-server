import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionTemplateSeeder } from './question-template.seeder';
import { QuestionTemplate } from '../../questions/entities/question-template.entity';
import { FodderPool } from '../../questions/entities/fodder-pool.entity';
import { User } from '../../users/entities/user.entity';
import { QuestionTemplateMedia } from '../../questions/entities/question-template-media.entity';
import { QuestionTemplateValidAnswer } from '../../questions/entities/question-template-valid-answer.entity';

describe('QuestionTemplateSeeder', () => {
  let seeder: QuestionTemplateSeeder;
  let questionTemplateRepository: Repository<QuestionTemplate>;
  let userRepository: Repository<User>;

  const mockQuestionTemplateRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockFodderPoolRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUserRepository = {
    createQueryBuilder: jest.fn(),
  };

  const mockMediaRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockValidAnswerRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionTemplateSeeder,
        {
          provide: getRepositoryToken(QuestionTemplate),
          useValue: mockQuestionTemplateRepository,
        },
        {
          provide: getRepositoryToken(FodderPool),
          useValue: mockFodderPoolRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(QuestionTemplateMedia),
          useValue: mockMediaRepository,
        },
        {
          provide: getRepositoryToken(QuestionTemplateValidAnswer),
          useValue: mockValidAnswerRepository,
        },
      ],
    }).compile();

    seeder = module.get<QuestionTemplateSeeder>(QuestionTemplateSeeder);
    questionTemplateRepository = module.get<Repository<QuestionTemplate>>(
      getRepositoryToken(QuestionTemplate),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  describe('seed', () => {
    const mockAdminUser = {
      id: 'admin-id',
      username: 'admin',
      roles: ['admin:exams', 'admin:users', 'user', 'public'],
    };

    beforeEach(() => {
      // Set up the query builder chain
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockAdminUser),
      };
      mockUserRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      mockQuestionTemplateRepository.findOne.mockResolvedValue(null);
      mockQuestionTemplateRepository.create.mockImplementation((dto) => dto);
      mockQuestionTemplateRepository.save.mockImplementation((template) =>
        Promise.resolve({ id: 'template-id', ...template }),
      );

      mockFodderPoolRepository.create.mockImplementation((dto) => dto);
      mockFodderPoolRepository.save.mockImplementation((pool) =>
        Promise.resolve({ id: 'pool-id', ...pool }),
      );
    });

    it('should create templates with correct tags', async () => {
      await seeder.seed();

      // Verify first template tags
      expect(mockQuestionTemplateRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          user_defined_tags: 'questions:tag1 questions:common',
        }),
      );

      // Verify second template tags
      expect(mockQuestionTemplateRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          user_defined_tags: 'questions:tag2 questions:common',
        }),
      );
    });

    it('should not create duplicate templates', async () => {
      mockQuestionTemplateRepository.findOne.mockResolvedValue({
        id: 'existing-id',
      });

      await seeder.seed();

      expect(mockQuestionTemplateRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error if admin user not found', async () => {
      // Mock admin user query to return null
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      mockUserRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      await expect(seeder.seed()).rejects.toThrow('Admin user not found');
    });
  });
});
