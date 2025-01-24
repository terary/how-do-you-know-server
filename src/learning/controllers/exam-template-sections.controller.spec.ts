import { Test, TestingModule } from '@nestjs/testing';
import { ExamTemplateSectionsController } from './exam-template-sections.controller';
import { ExamTemplateSectionsService } from '../services/exam-template-sections.service';
import { CreateExamTemplateSectionDto } from '../dto/create-exam-template-section.dto';
import { UpdateExamTemplateSectionDto } from '../dto/update-exam-template-section.dto';
import { ExamTemplateSectionDto } from '../dto/exam-template-section.dto';
import { ExamTemplateSection } from '../entities/exam-template-section.entity';

describe('ExamTemplateSectionsController', () => {
  let controller: ExamTemplateSectionsController;
  let service: jest.Mocked<ExamTemplateSectionsService>;

  const mockDate = new Date();
  const mockExamId = 'exam-123';

  const mockExamTemplateSection: Partial<ExamTemplateSection> = {
    id: 'section-123',
    exam_template_id: mockExamId,
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

  beforeEach(async () => {
    const mockExamTemplateSectionsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamTemplateSectionsController],
      providers: [
        {
          provide: ExamTemplateSectionsService,
          useValue: mockExamTemplateSectionsService,
        },
      ],
    }).compile();

    controller = module.get<ExamTemplateSectionsController>(
      ExamTemplateSectionsController,
    );
    service = module.get(ExamTemplateSectionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a section', async () => {
      const dto: CreateExamTemplateSectionDto = {
        title: 'Test Section',
        instructions: 'Test Instructions',
        position: 1,
        timeLimitSeconds: 3600,
      };

      const expectedResponse: ExamTemplateSectionDto =
        mockExamTemplateSection as ExamTemplateSectionDto;
      service.create.mockResolvedValue(expectedResponse);

      const result = await controller.create(mockExamId, dto);

      expect(result).toBe(expectedResponse);
      expect(service.create).toHaveBeenCalledWith(mockExamId, dto);
    });
  });

  describe('findAll', () => {
    it('should return all sections for an exam template', async () => {
      const expectedResponse: ExamTemplateSectionDto[] = [
        mockExamTemplateSection as ExamTemplateSectionDto,
      ];
      service.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(mockExamId);

      expect(result).toBe(expectedResponse);
      expect(service.findAll).toHaveBeenCalledWith(mockExamId);
    });
  });

  describe('findOne', () => {
    it('should return a specific section', async () => {
      const expectedResponse: ExamTemplateSectionDto =
        mockExamTemplateSection as ExamTemplateSectionDto;
      service.findOne.mockResolvedValue(expectedResponse);

      const result = await controller.findOne(
        mockExamId,
        mockExamTemplateSection.id,
      );

      expect(result).toBe(expectedResponse);
      expect(service.findOne).toHaveBeenCalledWith(
        mockExamId,
        mockExamTemplateSection.id,
      );
    });
  });

  describe('update', () => {
    it('should update a section', async () => {
      const dto: UpdateExamTemplateSectionDto = {
        title: 'Updated Section',
        instructions: 'Updated Instructions',
      };

      const updatedSection = {
        ...mockExamTemplateSection,
        ...dto,
      };

      const expectedResponse: ExamTemplateSectionDto =
        updatedSection as ExamTemplateSectionDto;
      service.update.mockResolvedValue(expectedResponse);

      const result = await controller.update(
        mockExamId,
        mockExamTemplateSection.id,
        dto,
      );

      expect(result).toBe(expectedResponse);
      expect(service.update).toHaveBeenCalledWith(
        mockExamId,
        mockExamTemplateSection.id,
        dto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a section', async () => {
      await controller.remove(mockExamId, mockExamTemplateSection.id);

      expect(service.remove).toHaveBeenCalledWith(
        mockExamId,
        mockExamTemplateSection.id,
      );
    });
  });
});
