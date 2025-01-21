import { validate } from 'class-validator';
import {
  AddQuestionToSectionDto,
  RemoveQuestionFromSectionDto,
} from './exam-template-section-question.dto';

describe('Exam Template Section Question DTOs', () => {
  const validUUID = '123e4567-e89b-12d3-a456-426614174000';

  describe('AddQuestionToSectionDto', () => {
    let dto: AddQuestionToSectionDto;

    beforeEach(() => {
      dto = new AddQuestionToSectionDto();
      dto.question_template_id = validUUID;
    });

    it('should validate a valid DTO', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should require question_template_id', async () => {
      dto.question_template_id = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('question_template_id');
    });

    it('should validate UUID format', async () => {
      dto.question_template_id = 'not-a-uuid';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('question_template_id');
    });

    it('should accept valid UUID format', async () => {
      const validUUIDs = [
        '123e4567-e89b-12d3-a456-426614174000',
        'a1a2a3a4-b1b2-c1c2-d1d2-d3d4d5d6d7d8',
      ];

      for (const uuid of validUUIDs) {
        dto.question_template_id = uuid;
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      }
    });
  });

  describe('RemoveQuestionFromSectionDto', () => {
    let dto: RemoveQuestionFromSectionDto;

    beforeEach(() => {
      dto = new RemoveQuestionFromSectionDto();
      dto.question_template_id = validUUID;
    });

    it('should validate a valid DTO', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should require question_template_id', async () => {
      dto.question_template_id = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('question_template_id');
    });

    it('should validate UUID format', async () => {
      dto.question_template_id = 'not-a-uuid';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('question_template_id');
    });

    it('should accept valid UUID format', async () => {
      const validUUIDs = [
        '123e4567-e89b-12d3-a456-426614174000',
        'a1a2a3a4-b1b2-c1c2-d1d2-d3d4d5d6d7d8',
      ];

      for (const uuid of validUUIDs) {
        dto.question_template_id = uuid;
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      }
    });
  });
});
