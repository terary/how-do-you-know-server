import { Test, TestingModule } from '@nestjs/testing';
import { ExamTemplatesController } from './exam-templates.controller';
import { ExamTemplatesService } from '../services/exam-templates.service';
import { CreateExamTemplateDto } from '../dto/create-exam-template.dto';
import { UpdateExamTemplateDto } from '../dto/update-exam-template.dto';
import { CreateExamTemplateSectionDto } from '../dto/create-exam-template-section.dto';
import { UpdateExamTemplateSectionDto } from '../dto/update-exam-template-section.dto';
import {
  AddQuestionToSectionDto,
  RemoveQuestionFromSectionDto,
} from '../dto/exam-template-section-question.dto';
import {
  BulkAddQuestionsDto,
  BulkRemoveQuestionsDto,
  ReorderQuestionsDto,
  QuestionPositionDto,
} from '../dto/bulk-section-operations.dto';
import {
  PreviewTemplateDto,
  PreviewFormat,
  PreviewResponse,
} from '../dto/preview-template.dto';
import {
  ExamTemplate,
  ExamExclusivityType,
} from '../entities/exam-template.entity';
import { ExamTemplateSection } from '../entities/exam-template-section.entity';
import { ExamTemplateSectionQuestion } from '../entities/exam-template-section-question.entity';

describe('ExamTemplatesController', () => {
  let controller: ExamTemplatesController;
  let service: jest.Mocked<ExamTemplatesService>;

  const mockUser = { id: 'user-123' };
  const mockDate = new Date();

  const mockExamTemplate: Partial<ExamTemplate> = {
    id: 'template-123',
    name: 'Test Template',
    description: 'Test Description',
    course_id: 'course-123',
    created_by: mockUser.id,
    availability_start_date: mockDate,
    availability_end_date: mockDate,
    version: 1,
    is_published: false,
    examExclusivityType: ExamExclusivityType.EXAM_PRACTICE_BOTH,
    created_at: mockDate,
    updated_at: mockDate,
    user_defined_tags: '',
  };

  const mockExamTemplateSection: Partial<ExamTemplateSection> = {
    id: 'section-123',
    exam_template_id: mockExamTemplate.id,
    title: 'Test Section',
    instructions: 'Test Instructions',
    position: 1,
    timeLimitSeconds: 3600,
    difficultyDistribution: [],
    topicDistribution: [],
    created_at: mockDate,
    updated_at: mockDate,
    user_defined_tags: '',
  };

  const mockSectionQuestion: Partial<ExamTemplateSectionQuestion> = {
    id: 'question-123',
    section_id: mockExamTemplateSection.id,
    question_template_id: 'question-template-123',
    position: 1,
    created_at: mockDate,
    updated_at: mockDate,
  };

  beforeEach(async () => {
    const mockExamTemplatesService = {
      createTemplate: jest.fn(),
      findAllTemplates: jest.fn(),
      findTemplateById: jest.fn(),
      updateTemplate: jest.fn(),
      removeTemplate: jest.fn(),
      createSection: jest.fn(),
      findSectionById: jest.fn(),
      updateSection: jest.fn(),
      removeSection: jest.fn(),
      addQuestionToSection: jest.fn(),
      removeQuestionFromSection: jest.fn(),
      getQuestionsForSection: jest.fn(),
      bulkAddQuestionsToSection: jest.fn(),
      bulkRemoveQuestionsFromSection: jest.fn(),
      reorderSectionQuestions: jest.fn(),
      validateTemplate: jest.fn(),
      createNewVersion: jest.fn(),
      publishTemplate: jest.fn(),
      getTemplateHistory: jest.fn(),
      previewTemplate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamTemplatesController],
      providers: [
        {
          provide: ExamTemplatesService,
          useValue: mockExamTemplatesService,
        },
      ],
    }).compile();

    controller = module.get<ExamTemplatesController>(ExamTemplatesController);
    service = module.get(ExamTemplatesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Template Operations', () => {
    describe('createTemplate', () => {
      it('should create a template', async () => {
        const dto: CreateExamTemplateDto = {
          name: 'Test Template',
          description: 'Test Description',
          course_id: 'course-123',
          availability_start_date: mockDate,
          availability_end_date: mockDate,
          examExclusivityType: ExamExclusivityType.EXAM_PRACTICE_BOTH,
        };
        service.createTemplate.mockResolvedValue(
          mockExamTemplate as ExamTemplate,
        );

        const result = await controller.createTemplate(dto, { user: mockUser });

        expect(result).toBe(mockExamTemplate);
        expect(service.createTemplate).toHaveBeenCalledWith(dto, mockUser.id);
      });
    });

    describe('findAllTemplates', () => {
      it('should return all templates', async () => {
        service.findAllTemplates.mockResolvedValue([
          mockExamTemplate as ExamTemplate,
        ]);

        const result = await controller.findAllTemplates();

        expect(result).toEqual([mockExamTemplate]);
        expect(service.findAllTemplates).toHaveBeenCalled();
      });
    });

    describe('findTemplateById', () => {
      it('should return a template by id', async () => {
        service.findTemplateById.mockResolvedValue(
          mockExamTemplate as ExamTemplate,
        );

        const result = await controller.findTemplateById(mockExamTemplate.id);

        expect(result).toBe(mockExamTemplate);
        expect(service.findTemplateById).toHaveBeenCalledWith(
          mockExamTemplate.id,
        );
      });
    });

    describe('updateTemplate', () => {
      it('should update a template', async () => {
        const dto: UpdateExamTemplateDto = {
          name: 'Updated Template',
        };
        const updatedTemplate = { ...mockExamTemplate, ...dto };
        service.updateTemplate.mockResolvedValue(
          updatedTemplate as ExamTemplate,
        );

        const result = await controller.updateTemplate(
          mockExamTemplate.id,
          dto,
        );

        expect(result).toBe(updatedTemplate);
        expect(service.updateTemplate).toHaveBeenCalledWith(
          mockExamTemplate.id,
          dto,
        );
      });
    });

    describe('removeTemplate', () => {
      it('should remove a template', async () => {
        await controller.removeTemplate(mockExamTemplate.id);

        expect(service.removeTemplate).toHaveBeenCalledWith(
          mockExamTemplate.id,
        );
      });
    });
  });

  describe('Section Operations', () => {
    describe('createSection', () => {
      it('should create a section', async () => {
        const dto: CreateExamTemplateSectionDto = {
          title: 'Test Section',
          instructions: 'Test Instructions',
          position: 1,
          timeLimitSeconds: 3600,
        };
        service.createSection.mockResolvedValue(
          mockExamTemplateSection as ExamTemplateSection,
        );

        const result = await controller.createSection(dto);

        expect(result).toBe(mockExamTemplateSection);
        expect(service.createSection).toHaveBeenCalledWith(dto);
      });
    });

    describe('findSectionById', () => {
      it('should return a section by id', async () => {
        service.findSectionById.mockResolvedValue(
          mockExamTemplateSection as ExamTemplateSection,
        );

        const result = await controller.findSectionById(
          mockExamTemplateSection.id,
        );

        expect(result).toBe(mockExamTemplateSection);
        expect(service.findSectionById).toHaveBeenCalledWith(
          mockExamTemplateSection.id,
        );
      });
    });

    describe('updateSection', () => {
      it('should update a section', async () => {
        const dto: UpdateExamTemplateSectionDto = {
          title: 'Updated Section',
        };
        const updatedSection = { ...mockExamTemplateSection, ...dto };
        service.updateSection.mockResolvedValue(
          updatedSection as ExamTemplateSection,
        );

        const result = await controller.updateSection(
          mockExamTemplateSection.id,
          dto,
        );

        expect(result).toBe(updatedSection);
        expect(service.updateSection).toHaveBeenCalledWith(
          mockExamTemplateSection.id,
          dto,
        );
      });
    });

    describe('removeSection', () => {
      it('should remove a section', async () => {
        await controller.removeSection(mockExamTemplateSection.id);

        expect(service.removeSection).toHaveBeenCalledWith(
          mockExamTemplateSection.id,
        );
      });
    });
  });

  describe('Question Operations', () => {
    describe('addQuestionToSection', () => {
      it('should add a question to a section', async () => {
        const dto: AddQuestionToSectionDto = {
          question_template_id: mockSectionQuestion.question_template_id,
        };
        service.addQuestionToSection.mockResolvedValue(
          mockSectionQuestion as ExamTemplateSectionQuestion,
        );

        const result = await controller.addQuestionToSection(
          mockExamTemplateSection.id,
          dto,
        );

        expect(result).toBe(mockSectionQuestion);
        expect(service.addQuestionToSection).toHaveBeenCalledWith(
          mockExamTemplateSection.id,
          dto,
        );
      });
    });

    describe('removeQuestionFromSection', () => {
      it('should remove a question from a section', async () => {
        const dto: RemoveQuestionFromSectionDto = {
          question_template_id: mockSectionQuestion.question_template_id,
        };

        await controller.removeQuestionFromSection(
          mockExamTemplateSection.id,
          dto,
        );

        expect(service.removeQuestionFromSection).toHaveBeenCalledWith(
          mockExamTemplateSection.id,
          dto.question_template_id,
        );
      });
    });

    describe('getQuestionsForSection', () => {
      it('should get all questions for a section', async () => {
        service.getQuestionsForSection.mockResolvedValue([
          mockSectionQuestion as ExamTemplateSectionQuestion,
        ]);

        const result = await controller.getQuestionsForSection(
          mockExamTemplateSection.id,
        );

        expect(result).toEqual([mockSectionQuestion]);
        expect(service.getQuestionsForSection).toHaveBeenCalledWith(
          mockExamTemplateSection.id,
        );
      });
    });

    describe('bulkAddQuestionsToSection', () => {
      it('should add multiple questions to a section', async () => {
        const dto: BulkAddQuestionsDto = {
          sectionId: mockExamTemplateSection.id,
          questionIds: ['question-1', 'question-2'],
        };
        service.bulkAddQuestionsToSection.mockResolvedValue(
          mockExamTemplateSection as ExamTemplateSection,
        );

        const result = await controller.bulkAddQuestionsToSection(
          mockExamTemplateSection.id,
          dto,
        );

        expect(result).toBe(mockExamTemplateSection);
        expect(service.bulkAddQuestionsToSection).toHaveBeenCalledWith(
          mockExamTemplateSection.id,
          dto.questionIds,
        );
      });
    });

    describe('bulkRemoveQuestionsFromSection', () => {
      it('should remove multiple questions from a section', async () => {
        const dto: BulkRemoveQuestionsDto = {
          sectionId: mockExamTemplateSection.id,
          questionIds: ['question-1', 'question-2'],
        };

        await controller.bulkRemoveQuestionsFromSection(
          mockExamTemplateSection.id,
          dto,
        );

        expect(service.bulkRemoveQuestionsFromSection).toHaveBeenCalledWith(
          mockExamTemplateSection.id,
          dto.questionIds,
        );
      });
    });

    describe('reorderSectionQuestions', () => {
      it('should reorder questions in a section', async () => {
        const dto: ReorderQuestionsDto = {
          sectionId: mockExamTemplateSection.id,
          questionPositions: [
            { questionId: 'question-1', position: 1 },
            { questionId: 'question-2', position: 2 },
          ],
        };
        service.reorderSectionQuestions.mockResolvedValue(
          mockExamTemplateSection as ExamTemplateSection,
        );

        const result = await controller.reorderSectionQuestions(
          mockExamTemplateSection.id,
          dto,
        );

        expect(result).toBe(mockExamTemplateSection);
        expect(service.reorderSectionQuestions).toHaveBeenCalledWith(
          mockExamTemplateSection.id,
          dto.questionPositions,
        );
      });
    });

    describe('previewTemplate', () => {
      it.skip('should preview a template', async () => {
        const dto: PreviewTemplateDto = {
          format: PreviewFormat.PDF,
        };
        const previewResponse: PreviewResponse = {
          format: PreviewFormat.PDF,
          content: 'base64-encoded-content',
          metadata: {
            totalQuestions: 10,
            totalSections: 2,
            totalTime: 7200,
            difficultyBreakdown: { easy: 40, medium: 40, hard: 20 },
            topicBreakdown: { math: 50, science: 50 },
          },
        };
        service.previewTemplate.mockResolvedValue(previewResponse);

        const result = await controller.previewTemplate(
          mockExamTemplate.id,
          dto,
        );

        expect(result).toBe(previewResponse);
        expect(service.previewTemplate).toHaveBeenCalledWith(
          mockExamTemplate.id,
          dto,
        );
      });
    });
  });

  describe('Template Management', () => {
    describe('validateTemplate', () => {
      it('should validate a template', async () => {
        await controller.validateTemplate(mockExamTemplate.id);

        expect(service.validateTemplate).toHaveBeenCalledWith(
          mockExamTemplate.id,
        );
      });
    });

    describe('createNewVersion', () => {
      it('should create a new version of a template', async () => {
        const newVersion = {
          ...mockExamTemplate,
          id: 'template-124',
          version: 2,
        };
        service.createNewVersion.mockResolvedValue(newVersion as ExamTemplate);

        const result = await controller.createNewVersion(mockExamTemplate.id, {
          user: mockUser,
        });

        expect(result).toBe(newVersion);
        expect(service.createNewVersion).toHaveBeenCalledWith(
          mockExamTemplate.id,
          mockUser.id,
        );
      });
    });

    describe('publishTemplate', () => {
      it('should publish a template', async () => {
        const publishedTemplate = { ...mockExamTemplate, is_published: true };
        service.publishTemplate.mockResolvedValue(
          publishedTemplate as ExamTemplate,
        );

        const result = await controller.publishTemplate(mockExamTemplate.id);

        expect(result).toBe(publishedTemplate);
        expect(service.publishTemplate).toHaveBeenCalledWith(
          mockExamTemplate.id,
        );
      });
    });

    describe('getTemplateHistory', () => {
      it('should get template history', async () => {
        const history = [mockExamTemplate as ExamTemplate];
        service.getTemplateHistory.mockResolvedValue(history);

        const result = await controller.getTemplateHistory(mockExamTemplate.id);

        expect(result).toBe(history);
        expect(service.getTemplateHistory).toHaveBeenCalledWith(
          mockExamTemplate.id,
        );
      });
    });
  });
});
