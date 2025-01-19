import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionsService } from './questions.service';
import {
  QuestionTemplate,
  QuestionTemplateMedia,
  QuestionTemplateValidAnswer,
  QuestionActual,
  QuestionActualChoice,
  QuestionActualValidAnswer,
} from './entities';
import { QuestionDifficulty } from './entities/question-template.entity';
import { TMediaContentType } from './types';

describe('QuestionsService', () => {
  let service: QuestionsService;
  let mockTemplateRepository: any;
  let mockTemplateMediaRepository: any;
  let mockTemplateAnswerRepository: any;
  let mockActualRepository: any;
  let mockActualChoiceRepository: any;
  let mockActualAnswerRepository: any;

  const mockValidAnswer: QuestionTemplateValidAnswer = {
    id: 'valid-answer-id',
    template_id: 'test-id',
    text: 'Correct answer',
    booleanValue: null,
    fodderPoolId: null,
    created_at: new Date(),
    template: null,
    fodderPool: null,
  };

  const mockTemplate: QuestionTemplate = {
    id: 'test-id',
    userPromptType: 'text',
    userResponseType: 'multiple-choice-4',
    exclusivityType: 'exam-practice-both',
    userPromptText: 'test prompt',
    instructionText: 'test instruction',
    difficulty: QuestionDifficulty.MEDIUM,
    topics: ['topic1', 'topic2'],
    created_by: 'user-id',
    created_at: new Date(),
    user_defined_tags: 'tag1 tag2',
    media: [],
    validAnswers: [mockValidAnswer],
    actuals: [],
  };

  const mockActual: QuestionActual = {
    id: 'actual-id',
    template_id: mockTemplate.id,
    examType: 'practice',
    sectionPosition: 1,
    userPromptText: mockTemplate.userPromptText,
    instructionText: mockTemplate.instructionText,
    choices: [],
    validAnswers: [],
    created_at: new Date(),
    template: mockTemplate,
  };

  beforeEach(async () => {
    const queryBuilder = {
      andWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([mockTemplate]),
    };

    mockTemplateRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      createQueryBuilder: jest.fn(() => queryBuilder),
    };

    mockTemplateMediaRepository = {
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    mockTemplateAnswerRepository = {
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    mockActualRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    mockActualChoiceRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    mockActualAnswerRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: getRepositoryToken(QuestionTemplate),
          useValue: mockTemplateRepository,
        },
        {
          provide: getRepositoryToken(QuestionTemplateMedia),
          useValue: mockTemplateMediaRepository,
        },
        {
          provide: getRepositoryToken(QuestionTemplateValidAnswer),
          useValue: mockTemplateAnswerRepository,
        },
        {
          provide: getRepositoryToken(QuestionActual),
          useValue: mockActualRepository,
        },
        {
          provide: getRepositoryToken(QuestionActualChoice),
          useValue: mockActualChoiceRepository,
        },
        {
          provide: getRepositoryToken(QuestionActualValidAnswer),
          useValue: mockActualAnswerRepository,
        },
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllTemplates', () => {
    it('should return all templates', async () => {
      mockTemplateRepository.find.mockResolvedValue([mockTemplate]);
      const result = await service.findAllTemplates();
      expect(result).toEqual([mockTemplate]);
      expect(mockTemplateRepository.find).toHaveBeenCalledWith({
        relations: ['media', 'validAnswers'],
      });
    });
  });

  describe('findTemplateById', () => {
    it('should return a template by id', async () => {
      mockTemplateRepository.findOne.mockResolvedValue(mockTemplate);
      const result = await service.findTemplateById('test-id');
      expect(result).toEqual(mockTemplate);
      expect(mockTemplateRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        relations: ['media', 'validAnswers'],
      });
    });

    it('should return null if template not found', async () => {
      mockTemplateRepository.findOne.mockResolvedValue(null);
      const result = await service.findTemplateById('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('createTemplate', () => {
    const createTemplateData = {
      userPromptType: 'text' as const,
      userResponseType: 'multiple-choice-4' as const,
      exclusivityType: 'exam-practice-both' as const,
      userPromptText: 'Test prompt',
      instructionText: 'Test instruction',
      validAnswers: [{ text: 'Correct answer' }],
    };

    it('should create a template with basic fields', async () => {
      mockTemplateRepository.create.mockReturnValue(mockTemplate);
      mockTemplateRepository.save.mockResolvedValue(mockTemplate);
      mockTemplateRepository.findOne.mockResolvedValue(mockTemplate);

      const result = await service.createTemplate(
        createTemplateData,
        'user-id',
      );

      expect(mockTemplateRepository.create).toHaveBeenCalledWith({
        userPromptType: createTemplateData.userPromptType,
        userResponseType: createTemplateData.userResponseType,
        exclusivityType: createTemplateData.exclusivityType,
        userPromptText: createTemplateData.userPromptText,
        instructionText: createTemplateData.instructionText,
        created_by: 'user-id',
      });
      expect(result).toEqual(mockTemplate);
    });

    it('should create a template with media', async () => {
      const dataWithMedia = {
        ...createTemplateData,
        media: [
          {
            mediaContentType: 'video/mp4' as TMediaContentType,
            height: 720,
            width: 1280,
            url: 'https://example.com/video.mp4',
          },
        ],
      };

      mockTemplateRepository.create.mockReturnValue(mockTemplate);
      mockTemplateRepository.save.mockResolvedValue(mockTemplate);
      mockTemplateRepository.findOne.mockResolvedValue(mockTemplate);
      mockTemplateMediaRepository.create.mockReturnValue({
        ...dataWithMedia.media[0],
        template_id: 'test-id',
      });

      await service.createTemplate(dataWithMedia, 'user-id');

      expect(mockTemplateMediaRepository.create).toHaveBeenCalled();
      expect(mockTemplateMediaRepository.save).toHaveBeenCalled();
    });
  });

  describe('generateActual', () => {
    it('should generate an actual question for practice exam', async () => {
      mockTemplateRepository.findOne.mockResolvedValue(mockTemplate);
      mockActualRepository.create.mockReturnValue(mockActual);
      mockActualRepository.save.mockResolvedValue(mockActual);
      mockActualRepository.findOne.mockResolvedValue(mockActual);

      const result = await service.generateActual('test-id', 'practice', 1);

      expect(result).toEqual(mockActual);
      expect(mockActualRepository.create).toHaveBeenCalledWith({
        template_id: mockTemplate.id,
        examType: 'practice',
        sectionPosition: 1,
        userPromptText: mockTemplate.userPromptText,
        instructionText: mockTemplate.instructionText,
      });
    });

    it('should generate choices for multiple choice questions', async () => {
      mockTemplateRepository.findOne.mockResolvedValue(mockTemplate);
      mockActualRepository.create.mockReturnValue(mockActual);
      mockActualRepository.save.mockResolvedValue(mockActual);
      mockActualRepository.findOne.mockResolvedValue(mockActual);

      await service.generateActual('test-id', 'practice', 1);

      expect(mockActualChoiceRepository.create).toHaveBeenCalledTimes(4);
      expect(mockActualChoiceRepository.save).toHaveBeenCalled();
    });

    it('should throw error if template not found', async () => {
      mockTemplateRepository.findOne.mockResolvedValue(null);

      await expect(
        service.generateActual('non-existent-id', 'practice', 1),
      ).rejects.toThrow('Template not found');
    });
  });

  describe('updateTemplate', () => {
    const updateData = {
      userPromptText: 'Updated prompt',
      instructionText: 'Updated instruction',
    };

    it('should update template basic fields', async () => {
      mockTemplateRepository.findOne.mockResolvedValue(mockTemplate);
      mockTemplateRepository.save.mockResolvedValue({
        ...mockTemplate,
        ...updateData,
      });

      const result = await service.updateTemplate(
        'test-id',
        updateData,
        'user-id',
      );

      expect(mockTemplateRepository.save).toHaveBeenCalledWith({
        ...mockTemplate,
        ...updateData,
      });
      expect(result.userPromptText).toBe(updateData.userPromptText);
      expect(result.instructionText).toBe(updateData.instructionText);
    });

    it('should throw error if template not found', async () => {
      mockTemplateRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateTemplate('non-existent-id', updateData, 'user-id'),
      ).rejects.toThrow('Template not found');
    });

    it('should update media if provided', async () => {
      const dataWithMedia = {
        ...updateData,
        media: [
          {
            mediaContentType: 'video/mp4' as TMediaContentType,
            height: 720,
            width: 1280,
            url: 'https://example.com/video.mp4',
          },
        ],
      };

      mockTemplateRepository.findOne.mockResolvedValue(mockTemplate);
      mockTemplateRepository.save.mockResolvedValue(mockTemplate);
      mockTemplateMediaRepository.create.mockReturnValue(
        dataWithMedia.media[0],
      );

      await service.updateTemplate('test-id', dataWithMedia, 'user-id');

      expect(mockTemplateMediaRepository.delete).toHaveBeenCalledWith({
        template_id: 'test-id',
      });
      expect(mockTemplateMediaRepository.create).toHaveBeenCalled();
      expect(mockTemplateMediaRepository.save).toHaveBeenCalled();
    });
  });

  describe('searchQuestions', () => {
    it('should search questions with search term', async () => {
      const searchTerm = 'test';
      await service.searchQuestions({ searchTerm });

      const queryBuilder = mockTemplateRepository.createQueryBuilder();
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        '(question.userPromptText ILIKE :searchTerm OR question.instructionText ILIKE :searchTerm)',
        { searchTerm: '%test%' },
      );
      expect(queryBuilder.getMany).toHaveBeenCalled();
    });

    it('should search questions with difficulty', async () => {
      const difficulty = QuestionDifficulty.EASY;
      await service.searchQuestions({ difficulty });

      const queryBuilder = mockTemplateRepository.createQueryBuilder();
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'question.difficulty = :difficulty',
        { difficulty: QuestionDifficulty.EASY },
      );
      expect(queryBuilder.getMany).toHaveBeenCalled();
    });

    it('should search questions with topics', async () => {
      const topics = ['topic1', 'topic2'];
      await service.searchQuestions({ topics });

      const queryBuilder = mockTemplateRepository.createQueryBuilder();
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'question.topics && :topics',
        { topics },
      );
      expect(queryBuilder.getMany).toHaveBeenCalled();
    });
  });
});
