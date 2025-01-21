import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult, FindOneOptions, DeepPartial } from 'typeorm';
import { ExamTemplatesService } from './exam-templates.service';
import {
  ExamTemplate,
  ExamExclusivityType,
} from '../entities/exam-template.entity';
import { ExamTemplateSection } from '../entities/exam-template-section.entity';
import { ExamTemplateSectionQuestion } from '../entities/exam-template-section-question.entity';
import {
  ExamTemplateValidationService,
  ValidationError,
} from './exam-template-validation.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { createMockRepository } from '../../common/test/typeorm.mock';
import {
  createMockExamTemplate,
  createMockExamTemplateSection,
  createMockQueryBuilder,
} from '../../common/test/test-utils';
import { QuestionTemplate } from '../../questions/entities/question-template.entity';

describe('ExamTemplatesService', () => {
  let service: ExamTemplatesService;
  let templateRepository: Repository<ExamTemplate>;
  let sectionRepository: Repository<ExamTemplateSection>;
  let sectionQuestionRepository: Repository<ExamTemplateSectionQuestion>;
  let validationService: ExamTemplateValidationService;

  const mockTemplate: Partial<ExamTemplate> = {
    id: '1',
    name: 'Test Exam',
    description: 'Test Description',
    course_id: '1',
    created_by: 'user1',
    is_published: false,
    version: 1,
    sections: [
      {
        id: '1',
        title: 'Section 1',
        instructions: 'Section Instructions',
        position: 1,
        timeLimitSeconds: 3600,
        exam_template_id: '1',
        questions: [
          {
            id: '1',
            section_id: '1',
            question_template_id: '1',
            position: 1,
            created_at: new Date(),
            updated_at: new Date(),
          } as ExamTemplateSectionQuestion,
        ],
        created_at: new Date(),
        updated_at: new Date(),
      } as ExamTemplateSection,
    ],
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockSectionRepository = {
    metadata: {
      columns: [
        'id',
        'title',
        'instructions',
        'position',
        'timeLimitSeconds',
        'exam_template_id',
        'created_at',
        'updated_at',
      ],
    },
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn().mockImplementation((options) => {
      if (options?.where?.id === '1') {
        return Promise.resolve({
          id: '1',
          title: 'Section 1',
          instructions: 'Section Instructions',
          position: 1,
          timeLimitSeconds: 3600,
          exam_template_id: '1',
          questions: [
            {
              id: '1',
              section_id: '1',
              question_template_id: '1',
              position: 1,
              created_at: new Date(),
              updated_at: new Date(),
            },
          ],
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
      return Promise.resolve(null);
    }),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue({
        id: '1',
        title: 'Section 1',
        instructions: 'Section Instructions',
        position: 1,
        timeLimitSeconds: 3600,
        exam_template_id: '1',
        questions: [
          {
            id: '1',
            section_id: '1',
            question_template_id: '1',
            position: 1,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        created_at: new Date(),
        updated_at: new Date(),
      }),
    }),
  };

  const mockSectionQuestionRepository = {
    metadata: {
      columns: [
        'id',
        'section_id',
        'question_template_id',
        'position',
        'created_at',
        'updated_at',
      ],
    },
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue({
        id: '1',
        section_id: '1',
        question_template_id: '1',
        position: 1,
        created_at: new Date(),
        updated_at: new Date(),
      }),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamTemplatesService,
        {
          provide: getRepositoryToken(ExamTemplate),
          useValue: {
            ...createMockRepository(),
            metadata: {
              columns: [
                { databaseName: 'id' },
                { databaseName: 'name' },
                { databaseName: 'description' },
                { databaseName: 'course_id' },
                { databaseName: 'created_by' },
                { databaseName: 'is_published' },
                { databaseName: 'version' },
                { databaseName: 'created_at' },
                { databaseName: 'updated_at' },
              ],
            },
          },
        },
        {
          provide: getRepositoryToken(ExamTemplateSection),
          useValue: mockSectionRepository,
        },
        {
          provide: getRepositoryToken(ExamTemplateSectionQuestion),
          useValue: mockSectionQuestionRepository,
        },
        {
          provide: ExamTemplateValidationService,
          useValue: {
            validateTemplate: jest
              .fn()
              .mockReturnValue({ isValid: true, errors: [] }),
          },
        },
      ],
    }).compile();

    service = module.get<ExamTemplatesService>(ExamTemplatesService);
    templateRepository = module.get(getRepositoryToken(ExamTemplate));
    sectionRepository = module.get(getRepositoryToken(ExamTemplateSection));
    sectionQuestionRepository = module.get(
      getRepositoryToken(ExamTemplateSectionQuestion),
    );
    validationService = module.get(ExamTemplateValidationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTemplate', () => {
    const createDto = {
      name: 'Test Exam',
      description: 'Test Description',
      course_id: '1',
      availability_start_date: new Date(),
      availability_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      examExclusivityType: ExamExclusivityType.EXAM_PRACTICE_BOTH,
    };

    it('should create an exam template', async () => {
      jest
        .spyOn(templateRepository, 'create')
        .mockReturnValue(mockTemplate as ExamTemplate);
      jest
        .spyOn(templateRepository, 'save')
        .mockResolvedValue(mockTemplate as ExamTemplate);

      const result = await service.createTemplate(createDto, 'user1');

      expect(result).toBeDefined();
      expect(result.id).toBe(mockTemplate.id);
      expect(result.created_by).toBe('user1');
    });

    it('should handle database errors during creation', async () => {
      jest
        .spyOn(templateRepository, 'save')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.createTemplate(createDto, 'user1')).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findAllTemplates', () => {
    it('should return all templates', async () => {
      jest
        .spyOn(templateRepository, 'find')
        .mockResolvedValue([mockTemplate as ExamTemplate]);

      const result = await service.findAllTemplates();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(mockTemplate.id);
    });
  });

  describe('findTemplateById', () => {
    it('should return a template by id', async () => {
      jest
        .spyOn(templateRepository, 'findOne')
        .mockResolvedValue(mockTemplate as ExamTemplate);

      const result = await service.findTemplateById('1');

      expect(result).toBeDefined();
      expect(result.id).toBe(mockTemplate.id);
    });

    it('should throw NotFoundException when template not found', async () => {
      jest.spyOn(templateRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findTemplateById('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateTemplate', () => {
    const updateDto = {
      name: 'Updated Exam',
      description: 'Updated Description',
    };

    it('should update a template', async () => {
      const updateResult: UpdateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      jest.spyOn(templateRepository, 'update').mockResolvedValue(updateResult);
      jest.spyOn(templateRepository, 'findOne').mockResolvedValue({
        ...mockTemplate,
        ...updateDto,
      } as ExamTemplate);
      jest.spyOn(validationService, 'validateTemplate').mockReturnValue({
        isValid: true,
        errors: [],
      });

      const result = await service.updateTemplate('1', updateDto);

      expect(result.name).toBe(updateDto.name);
      expect(result.description).toBe(updateDto.description);
    });

    it('should throw BadRequestException when validation fails', async () => {
      const updateResult: UpdateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      jest.spyOn(templateRepository, 'update').mockResolvedValue(updateResult);
      jest
        .spyOn(templateRepository, 'findOne')
        .mockResolvedValue(mockTemplate as ExamTemplate);
      jest.spyOn(validationService, 'validateTemplate').mockReturnValue({
        isValid: false,
        errors: [
          {
            type: 'template',
            entityId: '1',
            message: 'Validation error',
            field: 'test',
          } as ValidationError,
        ],
      });

      await expect(service.updateTemplate('1', updateDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('validateTemplate', () => {
    it('should validate a template successfully', async () => {
      jest
        .spyOn(templateRepository, 'findOne')
        .mockResolvedValue(mockTemplate as ExamTemplate);
      jest.spyOn(validationService, 'validateTemplate').mockReturnValue({
        isValid: true,
        errors: [],
      });

      await expect(service.validateTemplate('1')).resolves.not.toThrow();
    });

    it('should throw BadRequestException when validation fails', async () => {
      jest
        .spyOn(templateRepository, 'findOne')
        .mockResolvedValue(mockTemplate as ExamTemplate);
      jest.spyOn(validationService, 'validateTemplate').mockReturnValue({
        isValid: false,
        errors: [
          {
            type: 'template',
            entityId: '1',
            message: 'Validation error',
            field: 'test',
          } as ValidationError,
        ],
      });

      await expect(service.validateTemplate('1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('removeTemplate', () => {
    it('should remove a template', async () => {
      jest
        .spyOn(templateRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: [] });

      await expect(service.removeTemplate('1')).resolves.not.toThrow();
    });

    it('should throw NotFoundException when template not found', async () => {
      jest
        .spyOn(templateRepository, 'delete')
        .mockResolvedValue({ affected: 0, raw: [] });

      await expect(service.removeTemplate('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createSection', () => {
    const createSectionDto = {
      title: 'Test Section',
      instructions: 'Test Instructions',
      position: 1,
      timeLimitSeconds: 3600,
      exam_template_id: '1',
    };

    it('should create a section', async () => {
      jest
        .spyOn(sectionRepository, 'create')
        .mockReturnValue(mockTemplate as ExamTemplateSection);
      jest
        .spyOn(sectionRepository, 'save')
        .mockResolvedValue(mockTemplate as ExamTemplateSection);

      const result = await service.createSection(createSectionDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(mockTemplate.id);
    });
  });

  describe('addQuestionToSection', () => {
    const addQuestionDto = {
      question_template_id: '1',
      position: 1,
    };

    it('should add a question to a section', async () => {
      jest
        .spyOn(sectionRepository, 'findOne')
        .mockResolvedValue(mockTemplate as ExamTemplateSection);
      jest.spyOn(sectionQuestionRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(sectionQuestionRepository, 'create')
        .mockReturnValue(mockTemplate as ExamTemplateSectionQuestion);
      jest
        .spyOn(sectionQuestionRepository, 'save')
        .mockResolvedValue(mockTemplate as ExamTemplateSectionQuestion);

      const result = await service.addQuestionToSection('1', addQuestionDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(mockTemplate.id);
    });

    it('should return existing question if already added', async () => {
      jest
        .spyOn(sectionRepository, 'findOne')
        .mockResolvedValue(mockTemplate as ExamTemplateSection);
      jest
        .spyOn(sectionQuestionRepository, 'findOne')
        .mockResolvedValue(mockTemplate as ExamTemplateSectionQuestion);

      const result = await service.addQuestionToSection('1', addQuestionDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(mockTemplate.id);
    });
  });

  describe('bulkAddQuestionsToSection', () => {
    it('should add multiple questions to a section', async () => {
      jest
        .spyOn(sectionRepository, 'findOne')
        .mockResolvedValue(mockTemplate as ExamTemplateSection);
      jest
        .spyOn(sectionQuestionRepository, 'create')
        .mockReturnValue(mockTemplate as ExamTemplateSectionQuestion);
      jest
        .spyOn(sectionQuestionRepository, 'save')
        .mockResolvedValue([
          mockTemplate,
        ] as unknown as ExamTemplateSectionQuestion);

      const result = await service.bulkAddQuestionsToSection('1', ['1', '2']);

      expect(result).toBeDefined();
      expect(result.id).toBe(mockTemplate.id);
    });
  });

  describe('reorderSectionQuestions', () => {
    it('should reorder questions in a section', async () => {
      const positions = [{ questionId: '1', position: 2 }];
      jest
        .spyOn(sectionRepository, 'findOne')
        .mockResolvedValue(mockTemplate.sections[0] as ExamTemplateSection);

      const result = await service.reorderSectionQuestions('1', positions);
      expect(result).toBeDefined();
    });
  });

  describe('createNewVersion', () => {
    it('should create a new version of a template', async () => {
      const template = { ...mockTemplate };
      const newTemplate = {
        ...template,
        id: '2',
        version: template.version + 1,
        parent_template_id: template.id,
        is_published: false,
      };

      // Mock findOne to handle both the initial and final template lookups
      jest
        .spyOn(templateRepository, 'findOne')
        .mockImplementation((options: any) => {
          if (
            options?.where?.id === '1' &&
            options?.relations?.includes('sections') &&
            options?.relations?.includes('sections.questions') &&
            options?.relations?.includes('sections.questions.questionTemplate')
          ) {
            return Promise.resolve({
              ...template,
              sections: [
                {
                  ...template.sections[0],
                  questions: [template.sections[0].questions[0]],
                },
              ],
            } as ExamTemplate);
          }
          if (
            options?.where?.id === '2' &&
            options?.relations?.includes('sections') &&
            options?.relations?.includes('sections.questions') &&
            options?.relations?.includes('sections.questions.questionTemplate')
          ) {
            return Promise.resolve({
              ...newTemplate,
              sections: [
                {
                  ...template.sections[0],
                  id: '2',
                  exam_template_id: '2',
                  questions: [
                    {
                      ...template.sections[0].questions[0],
                      id: '2',
                      section_id: '2',
                    },
                  ],
                },
              ],
            } as ExamTemplate);
          }
          return Promise.resolve(null);
        });

      jest
        .spyOn(templateRepository, 'create')
        .mockReturnValue(newTemplate as ExamTemplate);
      jest
        .spyOn(templateRepository, 'save')
        .mockResolvedValue(newTemplate as ExamTemplate);
      jest
        .spyOn(sectionRepository, 'create')
        .mockReturnValue(mockTemplate.sections[0]);
      jest.spyOn(sectionRepository, 'save').mockResolvedValue({
        ...mockTemplate.sections[0],
        id: '2',
        exam_template_id: '2',
      });
      jest
        .spyOn(sectionQuestionRepository, 'save')
        .mockResolvedValue(
          mockTemplate.sections[0]
            .questions[0] as DeepPartial<ExamTemplateSectionQuestion> &
            ExamTemplateSectionQuestion,
        );

      const result = await service.createNewVersion('1', 'user1');

      expect(result).toBeDefined();
      expect(result.version).toBe(template.version + 1);
      expect(result.parent_template_id).toBe(template.id);
      expect(result.is_published).toBe(false);
    });

    it('should throw NotFoundException when template not found', async () => {
      jest.spyOn(templateRepository, 'findOne').mockResolvedValue(null);

      await expect(service.createNewVersion('999', 'user1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('publishTemplate', () => {
    it('should publish a template', async () => {
      const template = { ...mockTemplate, is_published: false };
      jest
        .spyOn(templateRepository, 'findOne')
        .mockResolvedValue(template as ExamTemplate);
      jest
        .spyOn(templateRepository, 'save')
        .mockResolvedValue({ ...template, is_published: true } as ExamTemplate);

      const result = await service.publishTemplate('1');
      expect(result).toBeDefined();
      expect(result.is_published).toBe(true);
    });

    it('should throw BadRequestException when validation fails', async () => {
      const template = { ...mockTemplate, is_published: false };
      jest
        .spyOn(templateRepository, 'findOne')
        .mockResolvedValue(template as ExamTemplate);
      jest.spyOn(validationService, 'validateTemplate').mockReturnValue({
        isValid: false,
        errors: [
          {
            type: 'template',
            entityId: '1',
            message: 'Validation error',
            field: 'test',
          } as ValidationError,
        ],
      });

      await expect(service.publishTemplate('1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getTemplateHistory', () => {
    it('should return template history', async () => {
      const section = createMockExamTemplateSection();
      const parentTemplate = createMockExamTemplate({
        id: '1',
        version: 1,
        sections: [section],
      });

      const childTemplate = createMockExamTemplate({
        id: '2',
        version: 2,
        parent_template_id: '1',
        sections: [{ ...section, id: '2', exam_template_id: '2' }],
      });

      const history = [parentTemplate, childTemplate];

      // Mock findOne to return the correct template based on id
      const findOneMock = jest.spyOn(templateRepository, 'findOne');
      findOneMock.mockImplementation(async (options: any) => {
        if (options?.where?.id === '2') {
          return childTemplate;
        }
        if (options?.where?.id === '1') {
          return parentTemplate;
        }
        return null;
      });

      // Create and configure mock query builder
      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.getMany.mockResolvedValue(history);

      jest
        .spyOn(templateRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.getTemplateHistory('2');
      expect(result).toEqual(history);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'template.id = :rootId',
        { rootId: '1' },
      );
      expect(mockQueryBuilder.orWhere).toHaveBeenCalledWith(
        'template.parent_template_id = :rootId',
        { rootId: '1' },
      );

      // Verify that findOne was called with the correct options
      expect(findOneMock).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: '2' },
        }),
      );
    });
  });
});
