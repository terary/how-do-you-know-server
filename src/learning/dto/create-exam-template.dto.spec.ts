import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateExamTemplateDto } from './create-exam-template.dto';
import { ExamExclusivityType } from '../entities/exam-template.entity';

describe('CreateExamTemplateDto', () => {
  let dto: CreateExamTemplateDto;

  beforeEach(() => {
    dto = plainToInstance(CreateExamTemplateDto, {
      name: 'Test Exam Template',
      description: 'A comprehensive test exam template',
      course_id: '123e4567-e89b-12d3-a456-426614174000',
      availability_start_date: '2024-01-01',
      availability_end_date: '2024-12-31',
      examExclusivityType: ExamExclusivityType.EXAM_PRACTICE_BOTH,
    });
  });

  it('should validate a valid DTO', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('name validation', () => {
    it('should require name', async () => {
      dto.name = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });

    it('should validate string type', async () => {
      (dto as any).name = 123;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });
  });

  describe('description validation', () => {
    it('should require description', async () => {
      dto.description = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('description');
    });

    it('should validate string type', async () => {
      (dto as any).description = 123;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('description');
    });
  });

  describe('course_id validation', () => {
    it('should require course_id', async () => {
      dto.course_id = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('course_id');
    });

    it('should validate UUID format', async () => {
      dto.course_id = 'not-a-uuid';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('course_id');
    });
  });

  describe('availability dates validation', () => {
    it('should require availability_start_date', async () => {
      dto.availability_start_date = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('availability_start_date');
    });

    it('should require availability_end_date', async () => {
      dto.availability_end_date = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('availability_end_date');
    });

    it('should validate date string format for start date', async () => {
      dto = plainToInstance(CreateExamTemplateDto, {
        ...dto,
        availability_start_date: 'not-a-date',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('availability_start_date');
    });

    it('should validate date string format for end date', async () => {
      dto = plainToInstance(CreateExamTemplateDto, {
        ...dto,
        availability_end_date: 'not-a-date',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('availability_end_date');
    });
  });

  describe('examExclusivityType validation', () => {
    it('should require examExclusivityType', async () => {
      dto.examExclusivityType = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('examExclusivityType');
    });

    it('should validate enum values', async () => {
      (dto as any).examExclusivityType = 'INVALID_TYPE';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('examExclusivityType');
    });

    it('should accept all valid enum values', async () => {
      for (const type of Object.values(ExamExclusivityType)) {
        dto = plainToInstance(CreateExamTemplateDto, {
          ...dto,
          examExclusivityType: type,
        });
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      }
    });
  });
});
