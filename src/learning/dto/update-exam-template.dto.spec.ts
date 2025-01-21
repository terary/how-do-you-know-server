import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateExamTemplateDto } from './update-exam-template.dto';
import { ExamExclusivityType } from '../entities/exam-template.entity';

describe('UpdateExamTemplateDto', () => {
  let dto: UpdateExamTemplateDto;

  beforeEach(() => {
    dto = plainToInstance(UpdateExamTemplateDto, {});
  });

  it('should validate an empty DTO', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate a fully populated DTO', async () => {
    dto = plainToInstance(UpdateExamTemplateDto, {
      name: 'Updated Test Template',
      description: 'Updated test description',
      course_id: '123e4567-e89b-12d3-a456-426614174000',
      availability_start_date: '2024-01-01',
      availability_end_date: '2024-12-31',
      examExclusivityType: ExamExclusivityType.EXAM_PRACTICE_BOTH,
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('name validation', () => {
    it('should validate string type when provided', async () => {
      dto = plainToInstance(UpdateExamTemplateDto, { name: 'Valid Name' });
      let errors = await validate(dto);
      expect(errors.length).toBe(0);

      dto = plainToInstance(UpdateExamTemplateDto, { name: 123 });
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });
  });

  describe('description validation', () => {
    it('should validate string type when provided', async () => {
      dto = plainToInstance(UpdateExamTemplateDto, {
        description: 'Valid Description',
      });
      let errors = await validate(dto);
      expect(errors.length).toBe(0);

      dto = plainToInstance(UpdateExamTemplateDto, { description: 123 });
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('description');
    });
  });

  describe('course_id validation', () => {
    it('should validate UUID format when provided', async () => {
      dto = plainToInstance(UpdateExamTemplateDto, {
        course_id: '123e4567-e89b-12d3-a456-426614174000',
      });
      let errors = await validate(dto);
      expect(errors.length).toBe(0);

      dto = plainToInstance(UpdateExamTemplateDto, { course_id: 'not-a-uuid' });
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('course_id');
    });
  });

  describe('availability dates validation', () => {
    it('should validate date string format for start date when provided', async () => {
      dto = plainToInstance(UpdateExamTemplateDto, {
        availability_start_date: '2024-01-01',
      });
      let errors = await validate(dto);
      expect(errors.length).toBe(0);

      dto = plainToInstance(UpdateExamTemplateDto, {
        availability_start_date: 'not-a-date',
      });
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('availability_start_date');
    });

    it('should validate date string format for end date when provided', async () => {
      dto = plainToInstance(UpdateExamTemplateDto, {
        availability_end_date: '2024-12-31',
      });
      let errors = await validate(dto);
      expect(errors.length).toBe(0);

      dto = plainToInstance(UpdateExamTemplateDto, {
        availability_end_date: 'not-a-date',
      });
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('availability_end_date');
    });
  });

  describe('examExclusivityType validation', () => {
    it('should validate enum values when provided', async () => {
      dto = plainToInstance(UpdateExamTemplateDto, {
        examExclusivityType: ExamExclusivityType.EXAM_PRACTICE_BOTH,
      });
      let errors = await validate(dto);
      expect(errors.length).toBe(0);

      dto = plainToInstance(UpdateExamTemplateDto, {
        examExclusivityType: 'INVALID_TYPE',
      });
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('examExclusivityType');
    });

    it('should accept all valid enum values', async () => {
      for (const type of Object.values(ExamExclusivityType)) {
        dto = plainToInstance(UpdateExamTemplateDto, {
          examExclusivityType: type,
        });
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      }
    });
  });
});
