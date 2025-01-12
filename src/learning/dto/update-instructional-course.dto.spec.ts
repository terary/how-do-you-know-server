import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateInstructionalCourseDto } from './update-instructional-course.dto';
import { DayOfWeek } from '../entities/instructional-course.entity';

describe('UpdateInstructionalCourseDto', () => {
  let dto: UpdateInstructionalCourseDto;

  beforeEach(() => {
    dto = new UpdateInstructionalCourseDto();
  });

  it('should validate an empty DTO', async () => {
    const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
    const errors = await validate(instance);
    expect(errors.length).toBe(0);
  });

  describe('name validation', () => {
    it('should be optional', async () => {
      dto.name = undefined;
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      expect(errors.length).toBe(0);
    });

    it('should validate when provided', async () => {
      dto.name = 'Test Course';
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      expect(errors.length).toBe(0);
    });

    it('should enforce minimum length when provided', async () => {
      dto.name = 'AB';
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      const nameErrors = errors.filter((e) => e.property === 'name');
      expect(nameErrors.length).toBeGreaterThan(0);
    });

    it('should enforce maximum length when provided', async () => {
      dto.name = 'A'.repeat(101);
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      const nameErrors = errors.filter((e) => e.property === 'name');
      expect(nameErrors.length).toBeGreaterThan(0);
    });
  });

  describe('description validation', () => {
    it('should be optional', async () => {
      dto.description = undefined;
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      expect(errors.length).toBe(0);
    });

    it('should validate when provided', async () => {
      dto.description = 'A comprehensive test course description';
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      expect(errors.length).toBe(0);
    });

    it('should enforce minimum length when provided', async () => {
      dto.description = 'Short';
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      const descErrors = errors.filter((e) => e.property === 'description');
      expect(descErrors.length).toBeGreaterThan(0);
    });
  });

  describe('date validation', () => {
    it('should be optional', async () => {
      dto.start_date = undefined;
      dto.finish_date = undefined;
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      expect(errors.length).toBe(0);
    });

    it('should validate date format when provided', async () => {
      dto.start_date = 'not-a-date' as any;
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      const dateErrors = errors.filter((e) => e.property === 'start_date');
      expect(dateErrors.length).toBeGreaterThan(0);
    });

    it('should accept valid dates', async () => {
      dto.start_date = '2024-02-01T00:00:00Z' as any;
      dto.finish_date = '2024-05-31T00:00:00Z' as any;
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      expect(errors.length).toBe(0);
    });
  });

  describe('start_time_utc validation', () => {
    it('should be optional', async () => {
      dto.start_time_utc = undefined;
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      expect(errors.length).toBe(0);
    });

    it('should validate time format when provided', async () => {
      const invalidTimes = ['25:00', '14:60', 'not-a-time', '1:00'];
      for (const time of invalidTimes) {
        dto.start_time_utc = time;
        const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
        const errors = await validate(instance);
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
        const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
        const errors = await validate(instance);
        expect(errors.length).toBe(0);
      }
    });
  });

  describe('duration_minutes validation', () => {
    it('should be optional', async () => {
      dto.duration_minutes = undefined;
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      expect(errors.length).toBe(0);
    });

    it('should enforce minimum duration when provided', async () => {
      dto.duration_minutes = 14;
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      const durationErrors = errors.filter(
        (e) => e.property === 'duration_minutes',
      );
      expect(durationErrors.length).toBeGreaterThan(0);
    });

    it('should enforce maximum duration when provided', async () => {
      dto.duration_minutes = 481;
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      const durationErrors = errors.filter(
        (e) => e.property === 'duration_minutes',
      );
      expect(durationErrors.length).toBeGreaterThan(0);
    });

    it('should accept valid duration', async () => {
      dto.duration_minutes = 90;
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      expect(errors.length).toBe(0);
    });
  });

  describe('days_of_week validation', () => {
    it('should be optional', async () => {
      dto.days_of_week = undefined;
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      expect(errors.length).toBe(0);
    });

    it('should require at least one day when provided', async () => {
      dto.days_of_week = [];
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      const daysErrors = errors.filter((e) => e.property === 'days_of_week');
      expect(daysErrors.length).toBeGreaterThan(0);
    });

    it('should validate enum values when provided', async () => {
      dto.days_of_week = ['INVALID_DAY'] as any;
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      const daysErrors = errors.filter((e) => e.property === 'days_of_week');
      expect(daysErrors.length).toBeGreaterThan(0);
    });

    it('should accept valid days', async () => {
      dto.days_of_week = [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY];
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      expect(errors.length).toBe(0);
    });
  });

  describe('institution_id validation', () => {
    it('should be optional', async () => {
      dto.institution_id = undefined;
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      expect(errors.length).toBe(0);
    });

    it('should validate UUID format when provided', async () => {
      dto.institution_id = 'not-a-uuid';
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      const idErrors = errors.filter((e) => e.property === 'institution_id');
      expect(idErrors.length).toBeGreaterThan(0);
    });

    it('should accept valid UUID', async () => {
      dto.institution_id = '123e4567-e89b-12d3-a456-426614174000';
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      expect(errors.length).toBe(0);
    });
  });

  describe('instructor_id validation', () => {
    it('should be optional', async () => {
      dto.instructor_id = undefined;
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      expect(errors.length).toBe(0);
    });

    it('should validate UUID format when provided', async () => {
      dto.instructor_id = 'not-a-uuid';
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      const idErrors = errors.filter((e) => e.property === 'instructor_id');
      expect(idErrors.length).toBeGreaterThan(0);
    });

    it('should accept valid UUID', async () => {
      dto.instructor_id = '123e4567-e89b-12d3-a456-426614174000';
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      expect(errors.length).toBe(0);
    });
  });

  describe('proctor_ids validation', () => {
    it('should be optional', async () => {
      dto.proctor_ids = undefined;
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      expect(errors.length).toBe(0);
    });

    it('should validate UUID format when provided', async () => {
      dto.proctor_ids = ['not-a-uuid'];
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      const proctorErrors = errors.filter((e) => e.property === 'proctor_ids');
      expect(proctorErrors.length).toBeGreaterThan(0);
    });

    it('should accept valid UUIDs', async () => {
      dto.proctor_ids = [
        '123e4567-e89b-12d3-a456-426614174002',
        '123e4567-e89b-12d3-a456-426614174003',
      ];
      const instance = plainToInstance(UpdateInstructionalCourseDto, dto);
      const errors = await validate(instance);
      expect(errors.length).toBe(0);
    });
  });
});
