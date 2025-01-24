import { Test, TestingModule } from '@nestjs/testing';
import { ExamInstancesController } from './exam-instances.controller';
import { ExamInstancesService } from '../services/exam-instances.service';
import { CreateExamInstanceDto } from '../dto/create-exam-instance.dto';
import { ForbiddenException } from '@nestjs/common';
import {
  ExamInstance,
  ExamInstanceStatus,
  ExamInstanceType,
} from '../entities/exam-instance.entity';
import {
  ExamInstanceQuestion,
  QuestionStatus,
} from '../entities/exam-instance-question.entity';
import { ExamInstanceSection } from '../entities/exam-instance-section.entity';

describe('ExamInstancesController', () => {
  let controller: ExamInstancesController;
  let service: jest.Mocked<ExamInstancesService>;

  const mockUser = { id: 'user-123' };

  const mockExamInstanceSection: Partial<ExamInstanceSection> = {
    id: 'section-123',
    completed_at: null,
  };

  const mockExamInstance: Partial<ExamInstance> = {
    id: 'exam-123',
    user_id: mockUser.id,
    status: ExamInstanceStatus.SCHEDULED,
    type: ExamInstanceType.EXAM,
    template_id: 'template-123',
    course_id: 'course-123',
    start_date: new Date(),
    end_date: new Date(),
    user_notes: [],
    user_defined_tags: '',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockExamInstanceQuestion: Partial<ExamInstanceQuestion> = {
    id: 'question-123',
    section_id: mockExamInstanceSection.id,
    template_question_id: 'template-question-123',
    status: QuestionStatus.UNANSWERED,
    position: 1,
    student_answer: null,
    is_correct: false,
    score: null,
    feedback: null,
    answered_at: null,
    user_defined_tags: '',
    user_notes: [],
  };

  beforeEach(async () => {
    const mockExamInstancesService = {
      createInstance: jest.fn(),
      findUserInstances: jest.fn(),
      findInstanceById: jest.fn(),
      startExam: jest.fn(),
      submitAnswer: jest.fn(),
      completeSection: jest.fn(),
      completeExam: jest.fn(),
      addNote: jest.fn(),
      addQuestionNote: jest.fn(),
      getQuestionNotes: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamInstancesController],
      providers: [
        {
          provide: ExamInstancesService,
          useValue: mockExamInstancesService,
        },
      ],
    }).compile();

    controller = module.get<ExamInstancesController>(ExamInstancesController);
    service = module.get(ExamInstancesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createInstance', () => {
    it('should create an exam instance', async () => {
      const dto: CreateExamInstanceDto = {
        template_id: 'template-123',
        type: ExamInstanceType.EXAM,
        course_id: 'course-123',
        start_date: new Date(),
        end_date: new Date(),
      };
      service.createInstance.mockResolvedValue(
        mockExamInstance as ExamInstance,
      );

      const result = await controller.createInstance({ user: mockUser }, dto);

      expect(result).toBe(mockExamInstance);
      expect(service.createInstance).toHaveBeenCalledWith(mockUser.id, dto);
    });
  });

  describe('findUserInstances', () => {
    it('should return user exam instances', async () => {
      service.findUserInstances.mockResolvedValue([
        mockExamInstance as ExamInstance,
      ]);

      const result = await controller.findUserInstances({ user: mockUser });

      expect(result).toEqual([mockExamInstance]);
      expect(service.findUserInstances).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('findInstanceById', () => {
    it('should return exam instance if user owns it', async () => {
      service.findInstanceById.mockResolvedValue(
        mockExamInstance as ExamInstance,
      );

      const result = await controller.findInstanceById(
        { user: mockUser },
        mockExamInstance.id,
      );

      expect(result).toBe(mockExamInstance);
      expect(service.findInstanceById).toHaveBeenCalledWith(
        mockExamInstance.id,
      );
    });

    it('should throw ForbiddenException if user does not own instance', async () => {
      const otherUserInstance = { ...mockExamInstance, user_id: 'other-user' };
      service.findInstanceById.mockResolvedValue(
        otherUserInstance as ExamInstance,
      );

      await expect(
        controller.findInstanceById({ user: mockUser }, otherUserInstance.id),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('startExam', () => {
    it('should start an exam', async () => {
      const startedInstance = {
        ...mockExamInstance,
        status: ExamInstanceStatus.IN_PROGRESS,
        started_at: new Date(),
      };
      service.startExam.mockResolvedValue(startedInstance as ExamInstance);

      const result = await controller.startExam(
        { user: mockUser },
        mockExamInstance.id,
      );

      expect(result.status).toBe(ExamInstanceStatus.IN_PROGRESS);
      expect(service.startExam).toHaveBeenCalledWith(
        mockUser.id,
        mockExamInstance.id,
      );
    });
  });

  describe('submitAnswer', () => {
    it('should submit an answer for a question', async () => {
      const answerData = { text: 'test answer' };
      const answeredQuestion = {
        ...mockExamInstanceQuestion,
        student_answer: answerData,
        status: QuestionStatus.ANSWERED,
        answered_at: new Date(),
      };
      service.submitAnswer.mockResolvedValue(
        answeredQuestion as ExamInstanceQuestion,
      );

      const result = await controller.submitAnswer(
        { user: mockUser },
        mockExamInstance.id,
        mockExamInstanceQuestion.id,
        { answer: answerData },
      );

      expect(result.student_answer).toBe(answerData);
      expect(service.submitAnswer).toHaveBeenCalledWith(
        mockUser.id,
        mockExamInstance.id,
        mockExamInstanceQuestion.id,
        answerData,
      );
    });
  });

  describe('completeSection', () => {
    it('should complete a section', async () => {
      const completedSection = {
        ...mockExamInstanceSection,
        completed_at: new Date(),
      };
      service.completeSection.mockResolvedValue(
        completedSection as ExamInstanceSection,
      );

      const result = await controller.completeSection(
        { user: mockUser },
        mockExamInstance.id,
        mockExamInstanceSection.id,
      );

      expect(result.completed_at).toBeTruthy();
      expect(service.completeSection).toHaveBeenCalledWith(
        mockUser.id,
        mockExamInstance.id,
        mockExamInstanceSection.id,
      );
    });
  });

  describe('completeExam', () => {
    it('should complete an exam', async () => {
      const completedInstance = {
        ...mockExamInstance,
        status: ExamInstanceStatus.COMPLETED,
        completed_at: new Date(),
      };
      service.completeExam.mockResolvedValue(completedInstance as ExamInstance);

      const result = await controller.completeExam(
        { user: mockUser },
        mockExamInstance.id,
      );

      expect(result.status).toBe(ExamInstanceStatus.COMPLETED);
      expect(service.completeExam).toHaveBeenCalledWith(
        mockUser.id,
        mockExamInstance.id,
      );
    });
  });

  describe('addNote', () => {
    it('should add a note to a section', async () => {
      const note = 'test note';
      const instanceWithNote = {
        ...mockExamInstance,
        user_notes: [
          {
            section_id: mockExamInstanceSection.id,
            note,
            created_at: new Date(),
          },
        ],
      };
      service.addNote.mockResolvedValue(instanceWithNote as ExamInstance);

      const result = await controller.addNote(
        { user: mockUser },
        mockExamInstance.id,
        mockExamInstanceSection.id,
        { note },
      );

      expect(result.user_notes[0].note).toBe(note);
      expect(service.addNote).toHaveBeenCalledWith(
        mockUser.id,
        mockExamInstance.id,
        mockExamInstanceSection.id,
        note,
      );
    });
  });

  describe('addQuestionNote', () => {
    it('should add a note to a question', async () => {
      const note = 'test note';
      const questionWithNote = {
        ...mockExamInstanceQuestion,
        user_notes: [{ note, created_at: new Date() }],
      };
      service.addQuestionNote.mockResolvedValue(
        questionWithNote as ExamInstanceQuestion,
      );

      const result = await controller.addQuestionNote(
        { user: mockUser },
        mockExamInstance.id,
        mockExamInstanceQuestion.id,
        { note },
      );

      expect(result.user_notes[0].note).toBe(note);
      expect(service.addQuestionNote).toHaveBeenCalledWith(
        mockUser.id,
        mockExamInstance.id,
        mockExamInstanceQuestion.id,
        note,
      );
    });
  });

  describe('getQuestionNotes', () => {
    it('should get notes for a question', async () => {
      const notes = [{ note: 'test note', created_at: new Date() }];
      service.getQuestionNotes.mockResolvedValue(notes);

      const result = await controller.getQuestionNotes(
        { user: mockUser },
        mockExamInstance.id,
        mockExamInstanceQuestion.id,
      );

      expect(result).toBe(notes);
      expect(service.getQuestionNotes).toHaveBeenCalledWith(
        mockUser.id,
        mockExamInstance.id,
        mockExamInstanceQuestion.id,
      );
    });
  });
});
