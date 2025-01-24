import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamTemplateSectionsService } from './exam-template-sections.service';
import { ExamTemplateSection } from '../entities/exam-template-section.entity';
import {
  ExamTemplate,
  ExamExclusivityType,
} from '../entities/exam-template.entity';
import { NotFoundException } from '@nestjs/common';
import { createMockRepository } from '../../common/test/typeorm.mock';

describe('ExamTemplateSectionsService', () => {
  let service: ExamTemplateSectionsService;
  let sectionRepository: Repository<ExamTemplateSection>;
  let examTemplateRepository: Repository<ExamTemplate>;

  const mockExamTemplate: Partial<ExamTemplate> = {
    id: '1',
    name: 'Test Exam',
    description: 'Test Description',
    course_id: '1',
    created_by: '1',
    availability_start_date: new Date(),
    availability_end_date: new Date(),
    version: 1,
    is_published: false,
    examExclusivityType: ExamExclusivityType.EXAM_PRACTICE_BOTH,
    created_at: new Date(),
    updated_at: new Date(),
    user_defined_tags: '',
  };

  const mockSection: Partial<ExamTemplateSection> = {
    id: '1',
    exam_template_id: '1',
    title: 'Test Section',
    instructions: 'Test Instructions',
    position: 1,
    timeLimitSeconds: 3600,
    difficultyDistribution: [{ difficulty: 'medium', percentage: 100 }],
    topicDistribution: [{ topics: ['math'], percentage: 100 }],
    created_at: new Date(),
    updated_at: new Date(),
    user_defined_tags: '',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamTemplateSectionsService,
        {
          provide: getRepositoryToken(ExamTemplateSection),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(ExamTemplate),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<ExamTemplateSectionsService>(
      ExamTemplateSectionsService,
    );
    sectionRepository = module.get(getRepositoryToken(ExamTemplateSection));
    examTemplateRepository = module.get(getRepositoryToken(ExamTemplate));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a section', async () => {
      const createDto = {
        title: 'Test Section',
        instructions: 'Test Instructions',
        position: 1,
        timeLimitSeconds: 3600,
      };

      jest
        .spyOn(examTemplateRepository, 'findOne')
        .mockResolvedValue(mockExamTemplate as ExamTemplate);
      jest
        .spyOn(sectionRepository, 'create')
        .mockReturnValue(mockSection as ExamTemplateSection);
      jest
        .spyOn(sectionRepository, 'save')
        .mockResolvedValue(mockSection as ExamTemplateSection);

      const result = await service.create('1', createDto);

      expect(result).toBeDefined();
      expect(result.title).toBe(createDto.title);
      expect(sectionRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when exam template not found', async () => {
      jest.spyOn(examTemplateRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.create('999', {
          title: 'Test',
          instructions: 'Test',
          position: 1,
          timeLimitSeconds: 3600,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return array of sections', async () => {
      jest
        .spyOn(examTemplateRepository, 'findOne')
        .mockResolvedValue(mockExamTemplate as ExamTemplate);
      jest
        .spyOn(sectionRepository, 'find')
        .mockResolvedValue([mockSection as ExamTemplateSection]);

      const result = await service.findAll('1');

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe(mockSection.title);
      expect(sectionRepository.find).toHaveBeenCalledWith({
        where: { exam_template_id: '1' },
        order: { position: 'ASC' },
      });
    });

    it('should throw NotFoundException when exam template not found', async () => {
      jest.spyOn(examTemplateRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findAll('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a section', async () => {
      jest
        .spyOn(sectionRepository, 'findOne')
        .mockResolvedValue(mockSection as ExamTemplateSection);

      const result = await service.findOne('1', '1');

      expect(result).toBeDefined();
      expect(result.title).toBe(mockSection.title);
      expect(sectionRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', exam_template_id: '1' },
      });
    });

    it('should throw NotFoundException when section not found', async () => {
      jest.spyOn(sectionRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1', '999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a section', async () => {
      const updateDto = {
        title: 'Updated Section',
        instructions: 'Updated Instructions',
        position: 2,
        timeLimitSeconds: 7200,
      };

      const updatedSection = { ...mockSection, ...updateDto };

      jest
        .spyOn(sectionRepository, 'findOne')
        .mockResolvedValueOnce(mockSection as ExamTemplateSection)
        .mockResolvedValueOnce(updatedSection as ExamTemplateSection);
      jest.spyOn(sectionRepository, 'update').mockResolvedValue(undefined);

      const result = await service.update('1', '1', updateDto);

      expect(result).toBeDefined();
      expect(result.title).toBe(updateDto.title);
      expect(sectionRepository.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a section', async () => {
      jest
        .spyOn(sectionRepository, 'findOne')
        .mockResolvedValue(mockSection as ExamTemplateSection);
      jest.spyOn(sectionRepository, 'delete').mockResolvedValue(undefined);

      await service.remove('1', '1');

      expect(sectionRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when section not found', async () => {
      jest.spyOn(sectionRepository, 'findOne').mockResolvedValue(null);

      await expect(service.remove('1', '999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
