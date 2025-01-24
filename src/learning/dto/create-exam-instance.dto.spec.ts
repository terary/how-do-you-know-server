import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateExamInstanceDto } from './create-exam-instance.dto';
import { ExamInstanceType } from '../entities/exam-instance.entity';

describe('CreateExamInstanceDto', () => {
  let dto: CreateExamInstanceDto;

  beforeEach(() => {
    dto = plainToInstance(CreateExamInstanceDto, {
      type: ExamInstanceType.EXAM,
      template_id: '123e4567-e89b-12d3-a456-426614174000',
      course_id: '123e4567-e89b-12d3-a456-426614174001',
      start_date: '2024-01-01',
      end_date: '2024-12-31',
    });
  });

  it('should validate a valid DTO', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('type validation', () => {
    it('should require type', async () => {
      dto.type = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('type');
    });

    it('should validate enum values', async () => {
      (dto as any).type = 'INVALID_TYPE';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('type');
    });

    it('should accept all valid enum values', async () => {
      for (const type of Object.values(ExamInstanceType)) {
        dto = plainToInstance(CreateExamInstanceDto, {
          ...dto,
          type,
        });
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      }
    });
  });

  describe('template_id validation', () => {
    it('should require template_id', async () => {
      dto.template_id = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('template_id');
    });

    it('should validate UUID format', async () => {
      dto.template_id = 'not-a-uuid';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('template_id');
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

  describe('date validation', () => {
    it('should require start_date', async () => {
      dto.start_date = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('start_date');
    });

    it('should require end_date', async () => {
      dto.end_date = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('end_date');
    });

    it('should validate date string format for start_date', async () => {
      dto = plainToInstance(CreateExamInstanceDto, {
        ...dto,
        start_date: 'not-a-date',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('start_date');
    });

    it('should validate date string format for end_date', async () => {
      dto = plainToInstance(CreateExamInstanceDto, {
        ...dto,
        end_date: 'not-a-date',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('end_date');
    });
  });
});
