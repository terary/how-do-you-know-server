import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ExamInstancesService } from './exam-instances.service';
import {
  ExamInstance,
  ExamInstanceStatus,
  ExamInstanceType,
} from '../entities/exam-instance.entity';
import {
  ExamInstanceSection,
  SectionStatus,
} from '../entities/exam-instance-section.entity';
import {
  ExamInstanceQuestion,
  QuestionStatus,
} from '../entities/exam-instance-question.entity';
import { ExamTemplate } from '../entities/exam-template.entity';
import { ExamTemplateSectionQuestion } from '../entities/exam-template-section-question.entity';
import { ExamTemplateSection } from '../entities/exam-template-section.entity';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { createMockRepository } from '../../common/test/typeorm.mock';

describe('ExamInstancesService', () => {
  let service: ExamInstancesService;
  let instanceRepository: Repository<ExamInstance>;
  let sectionRepository: Repository<ExamInstanceSection>;
  let questionRepository: Repository<ExamInstanceQuestion>;
  let templateRepository: Repository<ExamTemplate>;
  let dataSource: DataSource;

  const mockTemplate: Partial<ExamTemplate> = {
    id: '1',
    is_published: true,
    sections: [
      {
        id: '1',
        title: 'Test Section',
        instructions: 'Test Instructions',
        position: 1,
        timeLimitSeconds: 3600,
        difficultyDistribution: [{ difficulty: 'medium', percentage: 100 }],
        topicDistribution: [{ topics: ['math'], percentage: 100 }],
        exam_template_id: '1',
        examTemplate: {} as ExamTemplate,
        created_at: new Date(),
        updated_at: new Date(),
        user_defined_tags: '',
        questions: [
          {
            id: '1',
            section_id: '1',
            question_template_id: '1',
            position: 1,
            section: {} as any,
            questionTemplate: {} as any,
            created_at: new Date(),
            updated_at: new Date(),
          } as ExamTemplateSectionQuestion,
          {
            id: '2',
            section_id: '1',
            question_template_id: '2',
            position: 2,
            section: {} as any,
            questionTemplate: {} as any,
            created_at: new Date(),
            updated_at: new Date(),
          } as ExamTemplateSectionQuestion,
        ],
      } as ExamTemplateSection,
    ],
  };

  const mockInstance: Partial<ExamInstance> = {
    id: '1',
    user_id: 'user1',
    template_id: '1',
    course_id: '1',
    type: ExamInstanceType.EXAM,
    status: ExamInstanceStatus.SCHEDULED,
    start_date: new Date(),
    end_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    user_notes: [],
  };

  const mockSection: Partial<ExamInstanceSection> = {
    id: '1',
    exam_instance_id: '1',
    template_section_id: '1',
    position: 1,
    time_limit_seconds: 3600,
    status: SectionStatus.IN_PROGRESS,
  };

  const mockQuestion: Partial<ExamInstanceQuestion> = {
    id: '1',
    section_id: '1',
    template_question_id: '1',
    position: 1,
    status: QuestionStatus.UNANSWERED,
    section: mockSection as ExamInstanceSection,
    user_notes: [],
  };

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamInstancesService,
        {
          provide: getRepositoryToken(ExamInstance),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(ExamInstanceSection),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(ExamInstanceQuestion),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(ExamTemplate),
          useValue: createMockRepository(),
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
          },
        },
      ],
    }).compile();

    service = module.get<ExamInstancesService>(ExamInstancesService);
    instanceRepository = module.get(getRepositoryToken(ExamInstance));
    sectionRepository = module.get(getRepositoryToken(ExamInstanceSection));
    questionRepository = module.get(getRepositoryToken(ExamInstanceQuestion));
    templateRepository = module.get(getRepositoryToken(ExamTemplate));
    dataSource = module.get(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createInstance', () => {
    const createDto = {
      template_id: '1',
      course_id: '1',
      type: ExamInstanceType.EXAM,
      start_date: new Date(),
      end_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    it('should create an exam instance with sections and questions', async () => {
      jest
        .spyOn(templateRepository, 'findOne')
        .mockResolvedValue(mockTemplate as ExamTemplate);
      mockQueryRunner.manager.save
        .mockResolvedValueOnce(mockInstance)
        .mockResolvedValueOnce(mockSection)
        .mockResolvedValueOnce([mockQuestion]);
      jest
        .spyOn(instanceRepository, 'findOne')
        .mockResolvedValue(mockInstance as ExamInstance);

      const result = await service.createInstance('user1', createDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(mockInstance.id);
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should throw NotFoundException when template not found', async () => {
      jest.spyOn(templateRepository, 'findOne').mockResolvedValue(null);

      await expect(service.createInstance('user1', createDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when template is not published', async () => {
      jest.spyOn(templateRepository, 'findOne').mockResolvedValue({
        ...mockTemplate,
        is_published: false,
      } as ExamTemplate);

      await expect(service.createInstance('user1', createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should rollback transaction on error', async () => {
      jest
        .spyOn(templateRepository, 'findOne')
        .mockResolvedValue(mockTemplate as ExamTemplate);
      mockQueryRunner.manager.save.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.createInstance('user1', createDto)).rejects.toThrow(
        'Database error',
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });

  describe('findInstanceById', () => {
    it('should return an exam instance', async () => {
      jest
        .spyOn(instanceRepository, 'findOne')
        .mockResolvedValue(mockInstance as ExamInstance);

      const result = await service.findInstanceById('1');

      expect(result).toBeDefined();
      expect(result.id).toBe(mockInstance.id);
    });

    it('should throw NotFoundException when instance not found', async () => {
      jest.spyOn(instanceRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findInstanceById('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('startExam', () => {
    it('should start an exam', async () => {
      const instance = {
        ...mockInstance,
        status: ExamInstanceStatus.SCHEDULED,
      };
      jest
        .spyOn(instanceRepository, 'findOne')
        .mockResolvedValue(instance as ExamInstance);
      jest.spyOn(instanceRepository, 'save').mockResolvedValue({
        ...instance,
        status: ExamInstanceStatus.IN_PROGRESS,
        started_at: expect.any(Date),
      } as ExamInstance);

      const result = await service.startExam('user1', '1');

      expect(result.status).toBe(ExamInstanceStatus.IN_PROGRESS);
      expect(result.started_at).toBeDefined();
    });

    it('should throw ForbiddenException when user is not authorized', async () => {
      jest
        .spyOn(instanceRepository, 'findOne')
        .mockResolvedValue(mockInstance as ExamInstance);

      await expect(service.startExam('user2', '1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw BadRequestException when exam is not in scheduled state', async () => {
      const instance = {
        ...mockInstance,
        status: ExamInstanceStatus.IN_PROGRESS,
      };
      jest
        .spyOn(instanceRepository, 'findOne')
        .mockResolvedValue(instance as ExamInstance);

      await expect(service.startExam('user1', '1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('submitAnswer', () => {
    it('should submit an answer', async () => {
      const instance = {
        ...mockInstance,
        status: ExamInstanceStatus.IN_PROGRESS,
      };
      jest
        .spyOn(instanceRepository, 'findOne')
        .mockResolvedValue(instance as ExamInstance);
      jest
        .spyOn(questionRepository, 'findOne')
        .mockResolvedValue(mockQuestion as ExamInstanceQuestion);
      jest.spyOn(questionRepository, 'save').mockResolvedValue({
        ...mockQuestion,
        student_answer: 'test answer',
        status: QuestionStatus.ANSWERED,
        answered_at: expect.any(Date),
      } as ExamInstanceQuestion);

      const result = await service.submitAnswer(
        'user1',
        '1',
        '1',
        'test answer',
      );

      expect(result.student_answer).toBe('test answer');
      expect(result.status).toBe(QuestionStatus.ANSWERED);
      expect(result.answered_at).toBeDefined();
    });

    it('should throw ForbiddenException when user is not authorized', async () => {
      jest
        .spyOn(instanceRepository, 'findOne')
        .mockResolvedValue(mockInstance as ExamInstance);

      await expect(
        service.submitAnswer('user2', '1', '1', 'test'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException when exam is not in progress', async () => {
      const instance = {
        ...mockInstance,
        status: ExamInstanceStatus.COMPLETED,
      };
      jest
        .spyOn(instanceRepository, 'findOne')
        .mockResolvedValue(instance as ExamInstance);

      await expect(
        service.submitAnswer('user1', '1', '1', 'test'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('completeSection', () => {
    it('should complete a section', async () => {
      const instance = {
        ...mockInstance,
        status: ExamInstanceStatus.IN_PROGRESS,
      };
      jest
        .spyOn(instanceRepository, 'findOne')
        .mockResolvedValue(instance as ExamInstance);
      jest
        .spyOn(sectionRepository, 'findOne')
        .mockResolvedValue(mockSection as ExamInstanceSection);
      jest.spyOn(sectionRepository, 'save').mockResolvedValue({
        ...mockSection,
        status: SectionStatus.COMPLETED,
        completed_at: expect.any(Date),
      } as ExamInstanceSection);

      const result = await service.completeSection('user1', '1', '1');

      expect(result.status).toBe(SectionStatus.COMPLETED);
      expect(result.completed_at).toBeDefined();
    });

    it('should throw BadRequestException when section is already completed', async () => {
      const instance = {
        ...mockInstance,
        status: ExamInstanceStatus.IN_PROGRESS,
      };
      const section = { ...mockSection, status: SectionStatus.COMPLETED };
      jest
        .spyOn(instanceRepository, 'findOne')
        .mockResolvedValue(instance as ExamInstance);
      jest
        .spyOn(sectionRepository, 'findOne')
        .mockResolvedValue(section as ExamInstanceSection);

      await expect(service.completeSection('user1', '1', '1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('completeExam', () => {
    it('should complete an exam', async () => {
      const instance = {
        ...mockInstance,
        status: ExamInstanceStatus.IN_PROGRESS,
      };
      jest
        .spyOn(instanceRepository, 'findOne')
        .mockResolvedValue(instance as ExamInstance);
      jest.spyOn(instanceRepository, 'save').mockResolvedValue({
        ...instance,
        status: ExamInstanceStatus.COMPLETED,
        completed_at: expect.any(Date),
      } as ExamInstance);

      const result = await service.completeExam('user1', '1');

      expect(result.status).toBe(ExamInstanceStatus.COMPLETED);
      expect(result.completed_at).toBeDefined();
    });

    it('should throw BadRequestException when exam is not in progress', async () => {
      const instance = {
        ...mockInstance,
        status: ExamInstanceStatus.COMPLETED,
      };
      jest
        .spyOn(instanceRepository, 'findOne')
        .mockResolvedValue(instance as ExamInstance);

      await expect(service.completeExam('user1', '1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('addNote', () => {
    it('should add a note to the exam instance', async () => {
      const instance = { ...mockInstance, user_notes: [] };
      jest
        .spyOn(instanceRepository, 'findOne')
        .mockResolvedValue(instance as ExamInstance);
      jest
        .spyOn(instanceRepository, 'save')
        .mockImplementation(async (instance) => instance as ExamInstance);

      const result = await service.addNote('user1', '1', '1', 'Test note');

      expect(result.user_notes).toContainEqual(
        expect.objectContaining({
          section_id: '1',
          note: 'Test note',
        }),
      );
    });
  });

  describe('addQuestionNote', () => {
    it('should add a note to a question', async () => {
      const instance = {
        ...mockInstance,
        status: ExamInstanceStatus.IN_PROGRESS,
      };
      jest
        .spyOn(instanceRepository, 'findOne')
        .mockResolvedValue(instance as ExamInstance);
      jest
        .spyOn(questionRepository, 'findOne')
        .mockResolvedValue(mockQuestion as ExamInstanceQuestion);
      jest.spyOn(questionRepository, 'save').mockImplementation(
        async (question) =>
          ({
            ...question,
            user_notes: [
              {
                note: 'Test note',
                created_at: expect.any(Date),
              },
            ],
          }) as ExamInstanceQuestion,
      );

      const result = await service.addQuestionNote(
        'user1',
        '1',
        '1',
        'Test note',
      );

      expect(result.user_notes).toContainEqual(
        expect.objectContaining({
          note: 'Test note',
        }),
      );
    });
  });
});
