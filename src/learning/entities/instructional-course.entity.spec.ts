import { InstructionalCourse, DayOfWeek } from './instructional-course.entity';
import { LearningInstitution } from './learning-institution.entity';
import { User } from '../../users/entities/user.entity';

describe('InstructionalCourse', () => {
  let course: InstructionalCourse;
  let institution: LearningInstitution;
  let instructor: User;

  beforeEach(() => {
    institution = new LearningInstitution();
    institution.id = '123e4567-e89b-12d3-a456-426614174000';
    institution.name = 'Test University';

    instructor = new User();
    instructor.id = '123e4567-e89b-12d3-a456-426614174001';
    instructor.username = 'instructor1';

    course = new InstructionalCourse();
    course.id = '123e4567-e89b-12d3-a456-426614174002';
    course.name = 'Test Course';
    course.description = 'A test course for unit testing';
    course.start_date = new Date('2024-02-01T00:00:00Z');
    course.finish_date = new Date('2024-05-31T00:00:00Z');
    course.start_time_utc = '14:00';
    course.duration_minutes = 90;
    course.days_of_week = [
      DayOfWeek.MONDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.FRIDAY,
    ];
    course.institution_id = institution.id;
    course.institution = institution;
    course.instructor_id = instructor.id;
    course.instructor = instructor;
    course.proctor_ids = ['123e4567-e89b-12d3-a456-426614174003'];
    course.created_by = '123e4567-e89b-12d3-a456-426614174004';
    course.created_at = new Date('2024-01-20T12:00:00Z');
    course.updated_at = new Date('2024-01-20T12:00:00Z');
  });

  it('should create an instructional course instance', () => {
    expect(course).toBeDefined();
    expect(course).toBeInstanceOf(InstructionalCourse);
  });

  it('should have all required properties', () => {
    expect(course.id).toBeDefined();
    expect(course.name).toBeDefined();
    expect(course.description).toBeDefined();
    expect(course.start_date).toBeDefined();
    expect(course.finish_date).toBeDefined();
    expect(course.start_time_utc).toBeDefined();
    expect(course.duration_minutes).toBeDefined();
    expect(course.days_of_week).toBeDefined();
    expect(course.institution_id).toBeDefined();
    expect(course.instructor_id).toBeDefined();
    expect(course.created_by).toBeDefined();
    expect(course.created_at).toBeDefined();
    expect(course.updated_at).toBeDefined();
  });

  it('should have correct property types', () => {
    expect(typeof course.id).toBe('string');
    expect(typeof course.name).toBe('string');
    expect(typeof course.description).toBe('string');
    expect(course.start_date).toBeInstanceOf(Date);
    expect(course.finish_date).toBeInstanceOf(Date);
    expect(typeof course.start_time_utc).toBe('string');
    expect(typeof course.duration_minutes).toBe('number');
    expect(Array.isArray(course.days_of_week)).toBe(true);
    expect(typeof course.institution_id).toBe('string');
    expect(typeof course.instructor_id).toBe('string');
    expect(Array.isArray(course.proctor_ids)).toBe(true);
    expect(typeof course.created_by).toBe('string');
    expect(course.created_at).toBeInstanceOf(Date);
    expect(course.updated_at).toBeInstanceOf(Date);
  });

  it('should validate days of week enum values', () => {
    course.days_of_week.forEach((day) => {
      expect(Object.values(DayOfWeek)).toContain(day);
    });

    // Test all possible enum values
    Object.values(DayOfWeek).forEach((day) => {
      course.days_of_week = [day];
      expect(course.days_of_week[0]).toBe(day);
    });
  });

  it('should maintain relationship with institution', () => {
    expect(course.institution).toBeDefined();
    expect(course.institution).toBe(institution);
    expect(course.institution_id).toBe(institution.id);
  });

  it('should maintain relationship with instructor', () => {
    expect(course.instructor).toBeDefined();
    expect(course.instructor).toBe(instructor);
    expect(course.instructor_id).toBe(instructor.id);
  });

  it('should handle proctor IDs array', () => {
    expect(course.proctor_ids.length).toBe(1);

    // Test empty proctor IDs
    const newCourse = new InstructionalCourse();
    expect(newCourse.proctor_ids).toBeUndefined();

    // Test multiple proctor IDs
    course.proctor_ids = [
      '123e4567-e89b-12d3-a456-426614174003',
      '123e4567-e89b-12d3-a456-426614174005',
    ];
    expect(course.proctor_ids.length).toBe(2);
  });
});
