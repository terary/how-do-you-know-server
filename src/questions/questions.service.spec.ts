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
import { createMockRepository } from '../common/test/typeorm.mock';
import { TUserPromptType, TUserResponseType, TMediaContentType } from './types';
import { QuestionDifficulty } from './entities/question-template.entity';

describe('QuestionsService', () => {
  let service: QuestionsService;
  let templateRepository: Repository<QuestionTemplate>;
  let templateMediaRepository: Repository<QuestionTemplateMedia>;
  let templateAnswerRepository: Repository<QuestionTemplateValidAnswer>;
  let actualRepository: Repository<QuestionActual>;
  let actualChoiceRepository: Repository<QuestionActualChoice>;
  let actualAnswerRepository: Repository<QuestionActualValidAnswer>;

  const mockTemplate: QuestionTemplate = {
    id: '1',
    userPromptType: 'text',
    userResponseType: 'multiple-choice-4',
    exclusivityType: 'exam-practice-both',
    userPromptText: 'Test prompt',
    instructionText: 'Test instruction',
    difficulty: QuestionDifficulty.EASY,
    topics: ['math'],
    created_by: 'user-1',
    created_at: new Date(),
    user_defined_tags: '',
    media: [],
    validAnswers: [
      {
        id: '1',
        text: 'Correct answer',
        template_id: '1',
        booleanValue: null,
        fodderPoolId: null,
        created_at: new Date(),
        template: null,
        fodderPool: null,
      },
    ],
    actuals: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: getRepositoryToken(QuestionTemplate),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(QuestionTemplateMedia),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(QuestionTemplateValidAnswer),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(QuestionActual),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(QuestionActualChoice),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(QuestionActualValidAnswer),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
    templateRepository = module.get(getRepositoryToken(QuestionTemplate));
    templateMediaRepository = module.get(
      getRepositoryToken(QuestionTemplateMedia),
    );
    templateAnswerRepository = module.get(
      getRepositoryToken(QuestionTemplateValidAnswer),
    );
    actualRepository = module.get(getRepositoryToken(QuestionActual));
    actualChoiceRepository = module.get(
      getRepositoryToken(QuestionActualChoice),
    );
    actualAnswerRepository = module.get(
      getRepositoryToken(QuestionActualValidAnswer),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllTemplates', () => {
    it('should return an array of templates', async () => {
      const templates = [mockTemplate];
      jest.spyOn(templateRepository, 'find').mockResolvedValue(templates);

      const result = await service.findAllTemplates();
      expect(result).toEqual(templates);
      expect(templateRepository.find).toHaveBeenCalledWith({
        relations: ['media', 'validAnswers'],
      });
    });
  });

  describe('findTemplateById', () => {
    it('should return a template by id', async () => {
      jest.spyOn(templateRepository, 'findOne').mockResolvedValue(mockTemplate);

      const result = await service.findTemplateById('1');
      expect(result).toEqual(mockTemplate);
      expect(templateRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['media', 'validAnswers'],
      });
    });
  });

  describe('createTemplate', () => {
    it('should create a template with media and valid answers', async () => {
      const createData = {
        userPromptType: 'text' as TUserPromptType,
        userResponseType: 'multiple-choice-4' as TUserResponseType,
        exclusivityType: 'exam-practice-both' as const,
        userPromptText: 'Test prompt',
        instructionText: 'Test instruction',
        media: [
          {
            mediaContentType: 'image/*' as TMediaContentType,
            height: 100,
            width: 100,
            url: 'test.jpg',
            specialInstructionText: '',
            duration: null,
            fileSize: null,
            thumbnailUrl: null,
          },
        ],
        validAnswers: [{ text: 'Correct answer' }],
      };

      const savedTemplate = { ...mockTemplate };
      const savedMedia: QuestionTemplateMedia = {
        id: '1',
        template_id: '1',
        mediaContentType: 'image/*',
        height: 100,
        width: 100,
        url: 'test.jpg',
        specialInstructionText: '',
        duration: null,
        fileSize: null,
        thumbnailUrl: null,
        created_at: new Date(),
        template: null,
      };
      const savedAnswer: QuestionTemplateValidAnswer = {
        id: '1',
        template_id: '1',
        text: 'Correct answer',
        booleanValue: null,
        fodderPoolId: null,
        created_at: new Date(),
        template: null,
        fodderPool: null,
      };

      jest.spyOn(templateRepository, 'create').mockReturnValue(savedTemplate);
      jest.spyOn(templateRepository, 'save').mockResolvedValue(savedTemplate);
      jest.spyOn(templateMediaRepository, 'create').mockReturnValue(savedMedia);
      jest
        .spyOn(templateMediaRepository, 'save')
        .mockResolvedValue([savedMedia] as any);
      jest
        .spyOn(templateAnswerRepository, 'create')
        .mockReturnValue(savedAnswer);
      jest
        .spyOn(templateAnswerRepository, 'save')
        .mockResolvedValue([savedAnswer] as any);
      jest.spyOn(service, 'findTemplateById').mockResolvedValue({
        ...savedTemplate,
        media: [savedMedia],
        validAnswers: [savedAnswer],
      });

      const result = await service.createTemplate(createData, 'user-1');

      expect(result).toBeDefined();
      expect(result.id).toBe('1');
      expect(result.media).toHaveLength(1);
      expect(result.validAnswers).toHaveLength(1);
      expect(templateRepository.save).toHaveBeenCalled();
      expect(templateMediaRepository.save).toHaveBeenCalled();
      expect(templateAnswerRepository.save).toHaveBeenCalled();
    });
  });

  describe('generateActual', () => {
    it('should generate an actual question from template', async () => {
      const mockActual: QuestionActual = {
        id: '1',
        template_id: mockTemplate.id,
        examType: 'practice',
        sectionPosition: 1,
        userPromptText: mockTemplate.userPromptText,
        instructionText: mockTemplate.instructionText,
        created_at: new Date(),
        template: mockTemplate,
        choices: [],
        validAnswers: [],
      };

      const mockChoice: QuestionActualChoice = {
        id: '1',
        question_actual_id: mockActual.id,
        text: 'Correct answer',
        isCorrect: true,
        position: 0,
        created_at: new Date(),
        questionActual: mockActual,
      };

      jest.spyOn(service, 'findTemplateById').mockResolvedValue(mockTemplate);
      jest.spyOn(actualRepository, 'create').mockReturnValue(mockActual);
      jest.spyOn(actualRepository, 'save').mockResolvedValue(mockActual);
      jest.spyOn(actualChoiceRepository, 'create').mockReturnValue(mockChoice);
      jest
        .spyOn(actualChoiceRepository, 'save')
        .mockResolvedValue([mockChoice] as any);
      jest.spyOn(service, 'findActualById').mockResolvedValue({
        ...mockActual,
        choices: [mockChoice],
      });

      const result = await service.generateActual('1', 'practice', 1);

      expect(result).toBeDefined();
      expect(result.id).toBe('1');
      expect(actualRepository.save).toHaveBeenCalled();
      expect(actualChoiceRepository.save).toHaveBeenCalled();
    });

    it('should throw error if template not found', async () => {
      jest.spyOn(service, 'findTemplateById').mockResolvedValue(null);

      await expect(service.generateActual('1', 'practice', 1)).rejects.toThrow(
        'Template not found',
      );
    });

    it('should generate an actual question with valid answers for practice exam', async () => {
      const mockActual: QuestionActual = {
        id: '1',
        template_id: mockTemplate.id,
        examType: 'practice',
        sectionPosition: 1,
        userPromptText: mockTemplate.userPromptText,
        instructionText: mockTemplate.instructionText,
        created_at: new Date(),
        template: mockTemplate,
        choices: [],
        validAnswers: [],
      };

      const mockValidAnswer: QuestionActualValidAnswer = {
        id: '1',
        question_actual_id: mockActual.id,
        text: 'Correct answer',
        booleanValue: null,
        created_at: new Date(),
        questionActual: mockActual as QuestionActual,
      };

      jest.spyOn(service, 'findTemplateById').mockResolvedValue(mockTemplate);
      jest.spyOn(actualRepository, 'create').mockReturnValue(mockActual);
      jest.spyOn(actualRepository, 'save').mockResolvedValue(mockActual);
      jest
        .spyOn(actualAnswerRepository, 'create')
        .mockReturnValue(mockValidAnswer);
      jest
        .spyOn(actualAnswerRepository, 'save')
        .mockResolvedValue([mockValidAnswer] as any);
      jest.spyOn(service, 'findActualById').mockResolvedValue({
        ...mockActual,
        validAnswers: [mockValidAnswer],
      });

      const result = await service.generateActual('1', 'practice', 1);

      expect(result).toBeDefined();
      expect(result.validAnswers).toHaveLength(1);
      expect(actualAnswerRepository.save).toHaveBeenCalled();
    });

    it('should generate an actual question with boolean valid answers', async () => {
      const templateWithBooleanAnswer = {
        ...mockTemplate,
        validAnswers: [
          {
            ...mockTemplate.validAnswers[0],
            text: null,
            booleanValue: true,
          },
        ],
      };

      const mockActual: QuestionActual = {
        id: '1',
        template_id: templateWithBooleanAnswer.id,
        examType: 'practice',
        sectionPosition: 1,
        userPromptText: templateWithBooleanAnswer.userPromptText,
        instructionText: templateWithBooleanAnswer.instructionText,
        created_at: new Date(),
        template: templateWithBooleanAnswer,
        choices: [],
        validAnswers: [],
      };

      const mockValidAnswer: QuestionActualValidAnswer = {
        id: '1',
        question_actual_id: mockActual.id,
        text: null,
        booleanValue: true,
        created_at: new Date(),
        questionActual: mockActual as QuestionActual,
      };

      jest
        .spyOn(service, 'findTemplateById')
        .mockResolvedValue(templateWithBooleanAnswer);
      jest.spyOn(actualRepository, 'create').mockReturnValue(mockActual);
      jest.spyOn(actualRepository, 'save').mockResolvedValue(mockActual);
      jest
        .spyOn(actualAnswerRepository, 'create')
        .mockReturnValue(mockValidAnswer);
      jest
        .spyOn(actualAnswerRepository, 'save')
        .mockResolvedValue([mockValidAnswer] as any);
      jest.spyOn(service, 'findActualById').mockResolvedValue({
        ...mockActual,
        validAnswers: [mockValidAnswer],
      });

      const result = await service.generateActual('1', 'practice', 1);

      expect(result).toBeDefined();
      expect(result.validAnswers[0].booleanValue).toBe(true);
    });
  });

  describe('findActualById', () => {
    it('should return an actual question by id', async () => {
      const mockActual: QuestionActual = {
        id: '1',
        template_id: '1',
        examType: 'practice',
        sectionPosition: 1,
        userPromptText: 'Test prompt',
        instructionText: 'Test instruction',
        created_at: new Date(),
        choices: [],
        validAnswers: [],
        template: null,
      };

      jest.spyOn(actualRepository, 'findOne').mockResolvedValue(mockActual);

      const result = await service.findActualById('1');
      expect(result).toEqual(mockActual);
      expect(actualRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['choices', 'validAnswers'],
      });
    });

    it('should return null for non-existent actual question', async () => {
      jest.spyOn(actualRepository, 'findOne').mockResolvedValue(null);

      const result = await service.findActualById('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('updateTemplate', () => {
    it('should update basic fields of a template', async () => {
      const updateData = {
        userPromptText: 'Updated prompt',
        instructionText: 'Updated instruction',
      };

      const updatedTemplate = {
        ...mockTemplate,
        ...updateData,
      };

      jest.spyOn(service, 'findTemplateById').mockResolvedValue(mockTemplate);
      jest.spyOn(templateRepository, 'save').mockResolvedValue(updatedTemplate);

      const result = await service.updateTemplate('1', updateData, 'user-1');

      expect(result).toBeDefined();
      expect(result.userPromptText).toBe(updateData.userPromptText);
      expect(result.instructionText).toBe(updateData.instructionText);
    });

    it('should update media of a template', async () => {
      const mockMedia: QuestionTemplateMedia = {
        id: '1',
        template_id: '1',
        mediaContentType: 'image/*',
        height: 200,
        width: 200,
        url: 'updated.jpg',
        specialInstructionText: '',
        duration: null,
        fileSize: null,
        thumbnailUrl: null,
        created_at: new Date(),
        template: null,
      };

      const updateData = {
        media: [mockMedia],
      };

      const updatedTemplate = {
        ...mockTemplate,
        media: [mockMedia],
      };

      jest.spyOn(service, 'findTemplateById').mockResolvedValue(mockTemplate);
      jest.spyOn(templateRepository, 'save').mockResolvedValue(mockTemplate);
      jest
        .spyOn(templateMediaRepository, 'delete')
        .mockResolvedValue(undefined);
      jest.spyOn(templateMediaRepository, 'create').mockReturnValue(mockMedia);
      jest
        .spyOn(templateMediaRepository, 'save')
        .mockResolvedValue(mockMedia as any);

      const result = await service.updateTemplate('1', updateData, 'user-1');

      expect(result).toBeDefined();
      expect(templateMediaRepository.delete).toHaveBeenCalledWith({
        template_id: '1',
      });
      expect(templateMediaRepository.save).toHaveBeenCalled();
    });

    it('should throw error when template not found', async () => {
      jest.spyOn(service, 'findTemplateById').mockResolvedValue(null);

      await expect(service.updateTemplate('1', {}, 'user-1')).rejects.toThrow(
        'Template not found',
      );
    });
  });

  describe('searchQuestions', () => {
    it('should search questions with search term', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockTemplate]),
      };

      jest
        .spyOn(templateRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.searchQuestions({ searchTerm: 'test' });

      expect(result).toEqual([mockTemplate]);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(question.userPromptText ILIKE :searchTerm OR question.instructionText ILIKE :searchTerm)',
        { searchTerm: '%test%' },
      );
    });

    it('should search questions with difficulty', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockTemplate]),
      };

      jest
        .spyOn(templateRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.searchQuestions({
        difficulty: QuestionDifficulty.EASY,
      });

      expect(result).toEqual([mockTemplate]);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'question.difficulty = :difficulty',
        { difficulty: QuestionDifficulty.EASY },
      );
    });

    it('should search questions with topics', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockTemplate]),
      };

      jest
        .spyOn(templateRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.searchQuestions({ topics: ['math'] });

      expect(result).toEqual([mockTemplate]);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'question.topics && :topics',
        { topics: ['math'] },
      );
    });
  });

  describe('generateActual error cases', () => {
    it('should throw error when template not found', async () => {
      jest.spyOn(service, 'findTemplateById').mockResolvedValue(null);

      await expect(service.generateActual('1', 'practice', 1)).rejects.toThrow(
        'Template not found',
      );
    });

    it('should throw error when valid answer not found for multiple choice', async () => {
      const templateWithoutAnswers = {
        ...mockTemplate,
        validAnswers: [],
      };

      jest
        .spyOn(service, 'findTemplateById')
        .mockResolvedValue(templateWithoutAnswers);
      jest.spyOn(actualRepository, 'create').mockReturnValue({
        id: '1',
        template_id: '1',
        examType: 'practice',
        sectionPosition: 1,
      } as any);
      jest
        .spyOn(actualRepository, 'save')
        .mockResolvedValue({ id: '1' } as any);

      await expect(service.generateActual('1', 'practice', 1)).rejects.toThrow(
        'Valid answer not found for multiple choice question',
      );
    });
  });
});
