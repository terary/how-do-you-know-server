import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import {
  QuestionTemplate,
  QuestionTemplateMedia,
  QuestionTemplateValidAnswer,
  QuestionActual,
  QuestionActualChoice,
  QuestionActualValidAnswer,
} from './entities';

describe('QuestionsController', () => {
  let controller: QuestionsController;
  let service: QuestionsService;

  // Mock repositories
  const mockQuestionTemplateRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockTemplateMediaRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockTemplateValidAnswerRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockQuestionActualRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockActualChoiceRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockActualValidAnswerRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [
        QuestionsService,
        {
          provide: getRepositoryToken(QuestionTemplate),
          useValue: mockQuestionTemplateRepository,
        },
        {
          provide: getRepositoryToken(QuestionTemplateMedia),
          useValue: mockTemplateMediaRepository,
        },
        {
          provide: getRepositoryToken(QuestionTemplateValidAnswer),
          useValue: mockTemplateValidAnswerRepository,
        },
        {
          provide: getRepositoryToken(QuestionActual),
          useValue: mockQuestionActualRepository,
        },
        {
          provide: getRepositoryToken(QuestionActualChoice),
          useValue: mockActualChoiceRepository,
        },
        {
          provide: getRepositoryToken(QuestionActualValidAnswer),
          useValue: mockActualValidAnswerRepository,
        },
      ],
    }).compile();

    controller = module.get<QuestionsController>(QuestionsController);
    service = module.get<QuestionsService>(QuestionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
