import { validate } from 'class-validator';
import { CreateInstructionalCourseDto } from './create-instructional-course.dto';
import { DayOfWeek } from '../entities/instructional-course.entity';

describe('CreateInstructionalCourseDto', () => {
  let dto: CreateInstructionalCourseDto;

  beforeEach(() => {
    dto = new CreateInstructionalCourseDto();
    dto.name = 'Test Course';
    dto.description = 'A comprehensive test course';
    dto.start_date = '2024-02-01T00:00:00Z' as any;
    dto.finish_date = '2024-05-31T00:00:00Z' as any;
    dto.start_time_utc = '14:00';
    dto.duration_minutes = 90;
    dto.days_of_week = [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY];
    dto.institution_id = '123e4567-e89b-12d3-a456-426614174000';
    dto.instructor_id = '123e4567-e89b-12d3-a456-426614174001';
    dto.proctor_ids = ['123e4567-e89b-12d3-a456-426614174002'];
  });

  it('should validate a valid DTO', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('name validation', () => {
    it('should require name', async () => {
      dto.name = undefined;
      const errors = await validate(dto);
      const nameErrors = errors.filter((e) => e.property === 'name');
      expect(nameErrors.length).toBeGreaterThan(0);
    });

    it('should enforce minimum length', async () => {
      dto.name = 'AB';
      const errors = await validate(dto);
      const nameErrors = errors.filter((e) => e.property === 'name');
      expect(nameErrors.length).toBeGreaterThan(0);
    });

    it('should enforce maximum length', async () => {
      dto.name = 'A'.repeat(101);
      const errors = await validate(dto);
      const nameErrors = errors.filter((e) => e.property === 'name');
      expect(nameErrors.length).toBeGreaterThan(0);
    });
  });

  describe('description validation', () => {
    it('should require description', async () => {
      dto.description = undefined;
      const errors = await validate(dto);
      const descErrors = errors.filter((e) => e.property === 'description');
      expect(descErrors.length).toBeGreaterThan(0);
    });

    it('should enforce minimum length', async () => {
      dto.description = 'Short';
      const errors = await validate(dto);
      const descErrors = errors.filter((e) => e.property === 'description');
      expect(descErrors.length).toBeGreaterThan(0);
    });
  });

  describe('date validation', () => {
    it('should require start_date', async () => {
      dto.start_date = undefined;
      const errors = await validate(dto);
      const dateErrors = errors.filter((e) => e.property === 'start_date');
      expect(dateErrors.length).toBeGreaterThan(0);
    });

    it('should require finish_date', async () => {
      dto.finish_date = undefined;
      const errors = await validate(dto);
      const dateErrors = errors.filter((e) => e.property === 'finish_date');
      expect(dateErrors.length).toBeGreaterThan(0);
    });

    it('should validate date format', async () => {
      dto.start_date = 'not-a-date' as any;
      const errors = await validate(dto);
      const dateErrors = errors.filter((e) => e.property === 'start_date');
      expect(dateErrors.length).toBeGreaterThan(0);
    });
  });

  describe('start_time_utc validation', () => {
    it('should require start_time_utc', async () => {
      dto.start_time_utc = undefined;
      const errors = await validate(dto);
      const timeErrors = errors.filter((e) => e.property === 'start_time_utc');
      expect(timeErrors.length).toBeGreaterThan(0);
    });

    it('should validate time format', async () => {
      const invalidTimes = ['25:00', '14:60', 'not-a-time', '1:00'];
      for (const time of invalidTimes) {
        dto.start_time_utc = time;
        const errors = await validate(dto);
        const timeErrors = errors.filter(
          (e) => e.property === 'start_time_utc',
        );
        expect(timeErrors.length).toBeGreaterThan(0);
      }
    });

    it('should accept valid time formats', async () => {
      const validTimes = ['00:00', '14:00', '23:59'];
      for (const time of validTimes) {
        dto.start_time_utc = time;
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      }
    });
  });

  describe('duration_minutes validation', () => {
    it('should require duration_minutes', async () => {
      dto.duration_minutes = undefined;
      const errors = await validate(dto);
      const durationErrors = errors.filter(
        (e) => e.property === 'duration_minutes',
      );
      expect(durationErrors.length).toBeGreaterThan(0);
    });

    it('should enforce minimum duration', async () => {
      dto.duration_minutes = 14;
      const errors = await validate(dto);
      const durationErrors = errors.filter(
        (e) => e.property === 'duration_minutes',
      );
      expect(durationErrors.length).toBeGreaterThan(0);
    });

    it('should enforce maximum duration', async () => {
      dto.duration_minutes = 481;
      const errors = await validate(dto);
      const durationErrors = errors.filter(
        (e) => e.property === 'duration_minutes',
      );
      expect(durationErrors.length).toBeGreaterThan(0);
    });
  });

  describe('days_of_week validation', () => {
    it('should require days_of_week', async () => {
      dto.days_of_week = undefined;
      const errors = await validate(dto);
      const daysErrors = errors.filter((e) => e.property === 'days_of_week');
      expect(daysErrors.length).toBeGreaterThan(0);
    });

    it('should require at least one day', async () => {
      dto.days_of_week = [];
      const errors = await validate(dto);
      const daysErrors = errors.filter((e) => e.property === 'days_of_week');
      expect(daysErrors.length).toBeGreaterThan(0);
    });

    it('should validate enum values', async () => {
      dto.days_of_week = ['INVALID_DAY'] as any;
      const errors = await validate(dto);
      const daysErrors = errors.filter((e) => e.property === 'days_of_week');
      expect(daysErrors.length).toBeGreaterThan(0);
    });
  });

  describe('institution_id validation', () => {
    it('should require institution_id', async () => {
      dto.institution_id = undefined;
      const errors = await validate(dto);
      const idErrors = errors.filter((e) => e.property === 'institution_id');
      expect(idErrors.length).toBeGreaterThan(0);
    });

    it('should validate UUID format', async () => {
      dto.institution_id = 'not-a-uuid';
      const errors = await validate(dto);
      const idErrors = errors.filter((e) => e.property === 'institution_id');
      expect(idErrors.length).toBeGreaterThan(0);
    });
  });

  describe('instructor_id validation', () => {
    it('should require instructor_id', async () => {
      dto.instructor_id = undefined;
      const errors = await validate(dto);
      const idErrors = errors.filter((e) => e.property === 'instructor_id');
      expect(idErrors.length).toBeGreaterThan(0);
    });

    it('should validate UUID format', async () => {
      dto.instructor_id = 'not-a-uuid';
      const errors = await validate(dto);
      const idErrors = errors.filter((e) => e.property === 'instructor_id');
      expect(idErrors.length).toBeGreaterThan(0);
    });
  });

  describe('proctor_ids validation', () => {
    beforeEach(() => {
      // Set all required fields to ensure validation passes
      dto.name = 'Test Course';
      dto.description = 'A comprehensive test course';
      dto.start_date = '2024-02-01T00:00:00Z' as any;
      dto.finish_date = '2024-05-31T00:00:00Z' as any;
      dto.start_time_utc = '14:00';
      dto.duration_minutes = 90;
      dto.days_of_week = [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY];
      dto.institution_id = '123e4567-e89b-12d3-a456-426614174000';
      dto.instructor_id = '123e4567-e89b-12d3-a456-426614174001';
    });

    it('should be optional', async () => {
      dto.proctor_ids = undefined;
      const errors = await validate(dto);
      const proctorErrors = errors.filter((e) => e.property === 'proctor_ids');
      expect(proctorErrors.length).toBe(0);
    });

    it('should validate UUID format when provided', async () => {
      dto.proctor_ids = ['not-a-uuid'];
      const errors = await validate(dto);
      const proctorErrors = errors.filter((e) => e.property === 'proctor_ids');
      expect(proctorErrors.length).toBeGreaterThan(0);
    });

    it('should accept valid UUIDs', async () => {
      dto.proctor_ids = [
        '123e4567-e89b-12d3-a456-426614174002',
        '123e4567-e89b-12d3-a456-426614174003',
      ];
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
});
