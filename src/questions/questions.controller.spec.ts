import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { NotFoundException } from '@nestjs/common';
import {
  QuestionTemplate,
  QuestionDifficulty,
} from './entities/question-template.entity';
import { QuestionActual } from './entities/question-actual.entity';
import { QuestionTemplateValidAnswer } from './entities/question-template-valid-answer.entity';
import { TUserPromptType, TUserResponseType } from './types';

describe('QuestionsController', () => {
  let controller: QuestionsController;
  let service: QuestionsService;

  const mockValidAnswer: QuestionTemplateValidAnswer = {
    id: '1',
    template_id: '1',
    text: 'Sample answer',
    booleanValue: null,
    fodderPoolId: null,
    created_at: new Date(),
    template: null,
    fodderPool: null,
  };

  const mockTemplate: QuestionTemplate = {
    id: '1',
    userPromptType: 'text' as TUserPromptType,
    userResponseType: 'multiple-choice-4' as TUserResponseType,
    exclusivityType: 'exam-practice-both',
    userPromptText: 'Sample prompt',
    instructionText: 'Sample instruction',
    difficulty: QuestionDifficulty.MEDIUM,
    topics: ['topic1', 'topic2'],
    created_by: '1',
    created_at: new Date(),
    media: [],
    validAnswers: [mockValidAnswer],
    actuals: [],
    user_defined_tags: '',
  };

  const mockActual: QuestionActual = {
    id: '1',
    template_id: '1',
    examType: 'practice',
    sectionPosition: 1,
    userPromptText: 'Sample prompt',
    instructionText: 'Sample instruction',
    created_at: new Date(),
    template: mockTemplate,
    choices: [],
    validAnswers: [],
  };

  const mockRequest = {
    user: { id: '1' },
  };

  const mockService = {
    findAllTemplates: jest.fn().mockResolvedValue([mockTemplate]),
    findTemplateById: jest.fn().mockResolvedValue(mockTemplate),
    createTemplate: jest.fn().mockResolvedValue(mockTemplate),
    generateActual: jest.fn().mockResolvedValue(mockActual),
    findActualById: jest.fn().mockResolvedValue(mockActual),
    updateTemplate: jest.fn().mockResolvedValue(mockTemplate),
    searchQuestions: jest.fn().mockResolvedValue([mockTemplate]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [
        {
          provide: QuestionsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<QuestionsController>(QuestionsController);
    service = module.get<QuestionsService>(QuestionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllTemplates', () => {
    it('should return an array of templates', async () => {
      const result = await controller.findAllTemplates();
      expect(result).toEqual([mockTemplate]);
      expect(service.findAllTemplates).toHaveBeenCalled();
    });
  });

  describe('findTemplateById', () => {
    it('should return a template by id', async () => {
      const result = await controller.findTemplateById('1');
      expect(result).toEqual(mockTemplate);
      expect(service.findTemplateById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when template not found', async () => {
      jest
        .spyOn(service, 'findTemplateById')
        .mockRejectedValueOnce(new NotFoundException());
      await expect(controller.findTemplateById('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTemplate', () => {
    it('should create a template', async () => {
      const createDto = {
        userPromptType: 'text' as TUserPromptType,
        userResponseType: 'multiple-choice-4' as TUserResponseType,
        exclusivityType: 'exam-practice-both' as const,
        userPromptText: 'Sample prompt',
        instructionText: 'Sample instruction',
        difficulty: QuestionDifficulty.MEDIUM,
        topics: ['topic1', 'topic2'],
        validAnswers: [{ text: 'Sample answer' }],
      };
      const result = await controller.createTemplate(createDto, mockRequest);
      expect(result).toEqual(mockTemplate);
      expect(service.createTemplate).toHaveBeenCalledWith(
        createDto,
        mockRequest.user.id,
      );
    });
  });

  describe('generateActual', () => {
    it('should generate an actual question', async () => {
      const data = {
        examType: 'practice' as const,
        sectionPosition: 1,
      };
      const result = await controller.generateActual('1', data);
      expect(result).toEqual(mockActual);
      expect(service.generateActual).toHaveBeenCalledWith(
        '1',
        data.examType,
        data.sectionPosition,
      );
    });
  });

  describe('findActualById', () => {
    it('should return an actual question by id', async () => {
      const result = await controller.findActualById('1');
      expect(result).toEqual(mockActual);
      expect(service.findActualById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when actual not found', async () => {
      jest
        .spyOn(service, 'findActualById')
        .mockRejectedValueOnce(new NotFoundException());
      await expect(controller.findActualById('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateTemplate', () => {
    it('should update a template', async () => {
      const updateDto = {
        userPromptText: 'Updated prompt',
        instructionText: 'Updated instruction',
      };
      const result = await controller.updateTemplate(
        '1',
        updateDto,
        mockRequest,
      );
      expect(result).toEqual(mockTemplate);
      expect(service.updateTemplate).toHaveBeenCalledWith(
        '1',
        updateDto,
        mockRequest.user.id,
      );
    });
  });

  describe('searchQuestions', () => {
    it('should search questions', async () => {
      const searchParams = { query: 'sample' };
      const result = await controller.searchQuestions(searchParams);
      expect(result).toEqual([mockTemplate]);
      expect(service.searchQuestions).toHaveBeenCalledWith(searchParams);
    });
  });
});
