import { Test, TestingModule } from '@nestjs/testing';
import { QuestionTemplatesController } from './question-templates.controller';
import { QuestionTemplatesService } from '../services/question-templates.service';
import { QuestionTemplate } from '../entities/question-template.entity';
import { UpdateTagsDto } from '../../common/dto/update-tags.dto';
import { QuestionDifficulty } from '../entities/question-template.entity';

describe('QuestionTemplatesController', () => {
  let controller: QuestionTemplatesController;
  let service: QuestionTemplatesService;

  const mockTemplate: QuestionTemplate = {
    id: 'test-id',
    userPromptType: 'text',
    userResponseType: 'multiple-choice-4',
    exclusivityType: 'exam-practice-both',
    userPromptText: 'Test prompt',
    instructionText: 'Test instruction',
    difficulty: QuestionDifficulty.MEDIUM,
    topics: ['topic1', 'topic2'],
    created_by: 'user-id',
    created_at: new Date(),
    user_defined_tags: 'tag1 tag2',
    media: [],
    validAnswers: [],
    actuals: [],
  };

  const mockService = {
    updateTags: jest.fn(),
    findByTags: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionTemplatesController],
      providers: [
        {
          provide: QuestionTemplatesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<QuestionTemplatesController>(
      QuestionTemplatesController,
    );
    service = module.get<QuestionTemplatesService>(QuestionTemplatesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateTags', () => {
    it('should update tags for a question template', async () => {
      const id = 'test-id';
      const updateTagsDto: UpdateTagsDto = {
        tags: 'new-tag1 new-tag2',
      };

      mockService.updateTags.mockResolvedValue({
        ...mockTemplate,
        user_defined_tags: updateTagsDto.tags,
      });

      const result = await controller.updateTags(id, updateTagsDto);

      expect(service.updateTags).toHaveBeenCalledWith(id, updateTagsDto);
      expect(result.user_defined_tags).toBe(updateTagsDto.tags);
    });

    it('should handle errors when updating tags', async () => {
      const id = 'non-existent-id';
      const updateTagsDto: UpdateTagsDto = {
        tags: 'new-tag1 new-tag2',
      };

      mockService.updateTags.mockRejectedValue(new Error('Template not found'));

      await expect(controller.updateTags(id, updateTagsDto)).rejects.toThrow(
        'Template not found',
      );
      expect(service.updateTags).toHaveBeenCalledWith(id, updateTagsDto);
    });
  });

  describe('findByTags', () => {
    it('should find question templates by tags', async () => {
      const tags = 'tag1 tag2';
      const expectedTemplates = [mockTemplate];

      mockService.findByTags.mockResolvedValue(expectedTemplates);

      const result = await controller.findByTags(tags);

      expect(service.findByTags).toHaveBeenCalledWith(tags);
      expect(result).toEqual(expectedTemplates);
    });

    it('should return empty array when no templates match tags', async () => {
      const tags = 'non-existent-tag';

      mockService.findByTags.mockResolvedValue([]);

      const result = await controller.findByTags(tags);

      expect(service.findByTags).toHaveBeenCalledWith(tags);
      expect(result).toEqual([]);
    });

    it('should handle errors when searching by tags', async () => {
      const tags = 'tag1 tag2';

      mockService.findByTags.mockRejectedValue(new Error('Database error'));

      await expect(controller.findByTags(tags)).rejects.toThrow(
        'Database error',
      );
      expect(service.findByTags).toHaveBeenCalledWith(tags);
    });
  });
});
