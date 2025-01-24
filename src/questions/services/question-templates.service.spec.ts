import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionTemplatesService } from './question-templates.service';
import {
  QuestionTemplate,
  QuestionDifficulty,
} from '../entities/question-template.entity';
import { UpdateTagsDto } from '../../common/dto/update-tags.dto';
import { NotFoundException } from '@nestjs/common';

describe('QuestionTemplatesService', () => {
  let service: QuestionTemplatesService;
  let repository: Repository<QuestionTemplate>;

  const mockQuestionTemplate: QuestionTemplate = {
    id: '1',
    userPromptType: 'text',
    userResponseType: 'multiple-choice-4',
    exclusivityType: 'exam-practice-both',
    userPromptText: 'Test Question',
    instructionText: 'Test Instructions',
    difficulty: QuestionDifficulty.MEDIUM,
    topics: ['math', 'algebra'],
    created_by: 'user-123',
    created_at: new Date(),
    media: [],
    validAnswers: [],
    actuals: [],
    user_defined_tags: 'tag1 tag2',
  };

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionTemplatesService,
        {
          provide: getRepositoryToken(QuestionTemplate),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<QuestionTemplatesService>(QuestionTemplatesService);
    repository = module.get<Repository<QuestionTemplate>>(
      getRepositoryToken(QuestionTemplate),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateTags', () => {
    it('should update tags for a question template', async () => {
      const id = '1';
      const updateTagsDto: UpdateTagsDto = {
        tags: 'newtag1 newtag2',
      };

      const updatedTemplate = {
        ...mockQuestionTemplate,
        user_defined_tags: updateTagsDto.tags,
      };
      mockRepository.findOne.mockResolvedValue(mockQuestionTemplate);
      mockRepository.save.mockResolvedValue(updatedTemplate);

      const result = await service.updateTags(id, updateTagsDto);

      expect(result).toEqual(updatedTemplate);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...mockQuestionTemplate,
        user_defined_tags: updateTagsDto.tags,
      });
    });

    it('should throw NotFoundException when template is not found', async () => {
      const id = 'nonexistent';
      const updateTagsDto: UpdateTagsDto = {
        tags: 'newtag1 newtag2',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.updateTags(id, updateTagsDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findByTags', () => {
    it('should find question templates by tags', async () => {
      const tags = 'tag1 tag2';
      const expectedTemplates = [mockQuestionTemplate];

      mockQueryBuilder.getMany.mockResolvedValue(expectedTemplates);

      const result = await service.findByTags(tags);

      expect(result).toEqual(expectedTemplates);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockQueryBuilder.orWhere).toHaveBeenCalledTimes(2);
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    });

    it('should return empty array when no templates match tags', async () => {
      const tags = 'nonexistenttag';

      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.findByTags(tags);

      expect(result).toEqual([]);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockQueryBuilder.orWhere).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    });

    it('should return empty array when tags string is empty', async () => {
      const tags = '';

      const result = await service.findByTags(tags);

      expect(result).toEqual([]);
      expect(mockRepository.createQueryBuilder).not.toHaveBeenCalled();
      expect(mockQueryBuilder.orWhere).not.toHaveBeenCalled();
      expect(mockQueryBuilder.getMany).not.toHaveBeenCalled();
    });
  });
});
