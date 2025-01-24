import { Test, TestingModule } from '@nestjs/testing';
import { ExamTemplateValidationService } from './exam-template-validation.service';
import {
  ExamTemplate,
  ExamExclusivityType,
} from '../entities/exam-template.entity';
import { ExamTemplateSection } from '../entities/exam-template-section.entity';
import { ExamTemplateSectionQuestion } from '../entities/exam-template-section-question.entity';
import { TUserPromptType, TUserResponseType } from '../../questions/types';
import {
  QuestionDifficulty,
  QuestionTemplate,
} from '../../questions/entities/question-template.entity';

describe('ExamTemplateValidationService', () => {
  let service: ExamTemplateValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamTemplateValidationService],
    }).compile();

    service = module.get<ExamTemplateValidationService>(
      ExamTemplateValidationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateTemplate', () => {
    const mockQuestionTemplate = {
      id: '1',
      userPromptType: 'text' as TUserPromptType,
      userResponseType: 'multiple-choice' as TUserResponseType,
      exclusivityType: 'exam-practice-both',
      userPromptText: 'Test prompt',
      instructionText: 'Test instruction',
      difficulty: QuestionDifficulty.MEDIUM,
      topics: ['topic1', 'topic2'],
      created_by: 'user1',
      created_at: new Date(),
      media: [],
      actuals: [],
      user_defined_tags: 'tag1,tag2',
      validAnswers: [],
    };

    const mockTemplate = {
      id: '1',
      name: 'Test Exam',
      description: 'Test Description',
      course_id: '1',
      created_by: 'user1',
      availability_start_date: new Date('2025-01-20'),
      availability_end_date: new Date('2025-01-27'),
      version: 1,
      is_published: false,
      examExclusivityType: ExamExclusivityType.EXAM_PRACTICE_BOTH,
      sections: [
        {
          id: '1',
          title: 'Section 1',
          instructions: 'Test instructions',
          position: 1,
          timeLimitSeconds: 3600,
          questions: [
            {
              id: '1',
              position: 1,
              questionTemplate: mockQuestionTemplate,
            },
          ],
          difficultyDistribution: [
            { difficulty: QuestionDifficulty.MEDIUM, percentage: 100 },
          ],
        },
      ],
      created_at: new Date(),
      updated_at: new Date(),
      user_defined_tags: 'tag1,tag2',
    };

    it('should validate a valid template', () => {
      const result = service.validateTemplate(mockTemplate as ExamTemplate);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate template sections when publishing', () => {
      const templateWithoutSections = { ...mockTemplate, sections: [] };
      const result = service.validateTemplate(
        templateWithoutSections as ExamTemplate,
        true,
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          type: 'template',
          entityId: mockTemplate.id,
          message: 'Template must have at least one section',
        }),
      );
    });

    it('should validate availability dates', () => {
      const invalidTemplate = {
        ...mockTemplate,
        availability_start_date: new Date('2025-01-20'),
        availability_end_date: new Date('2025-01-19'),
      };

      const result = service.validateTemplate(invalidTemplate as ExamTemplate);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          type: 'template',
          entityId: mockTemplate.id,
          message: 'End date must be after start date',
        }),
      );
    });

    it('should validate section time limits', () => {
      const invalidSection = {
        ...mockTemplate.sections[0],
        timeLimitSeconds: 0,
      };
      const templateWithInvalidSection = {
        ...mockTemplate,
        sections: [invalidSection] as ExamTemplateSection[],
      };

      const result = service.validateTemplate(
        templateWithInvalidSection as ExamTemplate,
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          type: 'section',
          entityId: mockTemplate.sections[0].id,
          message: 'Section must have a positive time limit',
        }),
      );
    });

    it('should validate section questions', () => {
      const sectionWithoutQuestions = {
        ...mockTemplate.sections[0],
        questions: [],
      };
      const templateWithInvalidSection = {
        ...mockTemplate,
        sections: [sectionWithoutQuestions] as ExamTemplateSection[],
      };

      const result = service.validateTemplate(
        templateWithInvalidSection as ExamTemplate,
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          type: 'section',
          entityId: mockTemplate.sections[0].id,
          message: 'Section must have at least one question',
        }),
      );
    });

    it('should validate question positions', () => {
      const duplicatePositionQuestion = {
        ...mockTemplate.sections[0].questions[0],
        id: '2',
        position: 1,
      };
      const sectionWithDuplicatePositions = {
        ...mockTemplate.sections[0],
        questions: [
          mockTemplate.sections[0].questions[0],
          duplicatePositionQuestion,
        ] as ExamTemplateSectionQuestion[],
      };
      const templateWithInvalidSection = {
        ...mockTemplate,
        sections: [sectionWithDuplicatePositions] as ExamTemplateSection[],
      };

      const result = service.validateTemplate(
        templateWithInvalidSection as ExamTemplate,
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          type: 'section',
          entityId: mockTemplate.sections[0].id,
          message: 'Questions must have unique positions',
        }),
      );
    });

    it('should validate question templates', () => {
      const questionWithoutTemplate = {
        id: '1',
        position: 1,
        questionTemplate: undefined,
      };
      const sectionWithInvalidQuestion = {
        ...mockTemplate.sections[0],
        questions: [questionWithoutTemplate],
        difficultyDistribution: undefined,
        topicDistribution: undefined,
      };
      const templateWithInvalidSection = {
        ...mockTemplate,
        sections: [sectionWithInvalidQuestion] as ExamTemplateSection[],
      };

      const result = service.validateTemplate(
        templateWithInvalidSection as ExamTemplate,
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          type: 'question',
          entityId: questionWithoutTemplate.id,
          message: 'Question template is missing',
        }),
      );
    });

    it('should validate difficulty distribution', () => {
      const invalidDistribution = {
        ...mockTemplate.sections[0],
        difficultyDistribution: [
          { difficulty: QuestionDifficulty.EASY, percentage: 60 },
          { difficulty: QuestionDifficulty.MEDIUM, percentage: 60 },
        ],
        questions: [
          {
            id: '1',
            position: 1,
            questionTemplate: mockQuestionTemplate,
          },
          {
            id: '2',
            position: 2,
            questionTemplate: mockQuestionTemplate,
          },
        ],
      };
      const templateWithInvalidDistribution = {
        ...mockTemplate,
        sections: [invalidDistribution] as ExamTemplateSection[],
      };

      const result = service.validateTemplate(
        templateWithInvalidDistribution as ExamTemplate,
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          type: 'section',
          entityId: mockTemplate.sections[0].id,
          message: 'Difficulty distribution percentages must sum to 100',
        }),
      );
    });

    it('should validate topic distribution', () => {
      const invalidDistribution = {
        ...mockTemplate.sections[0],
        topicDistribution: [
          { topics: ['math'], percentage: 60 },
          { topics: ['science'], percentage: 60 },
        ],
      };
      const templateWithInvalidDistribution = {
        ...mockTemplate,
        sections: [invalidDistribution] as ExamTemplateSection[],
      };

      const result = service.validateTemplate(
        templateWithInvalidDistribution as ExamTemplate,
      );

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          type: 'section',
          entityId: mockTemplate.sections[0].id,
          message: 'Topic distribution percentages must sum to 100',
        }),
      );
    });
  });
});
