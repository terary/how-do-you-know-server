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

describe('QuestionsService', () => {
  let service: QuestionsService;

  // Mock repositories
  const mockTemplateRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockTemplateMediaRepository = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockTemplateAnswerRepository = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockActualRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockActualChoiceRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockActualAnswerRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
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
});
