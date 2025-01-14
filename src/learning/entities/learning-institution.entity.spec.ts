import { LearningInstitution } from './learning-institution.entity';
import { InstructionalCourse } from './instructional-course.entity';

describe('LearningInstitution', () => {
  let institution: LearningInstitution;

  beforeEach(() => {
    institution = new LearningInstitution();
    institution.id = '123e4567-e89b-12d3-a456-426614174000';
    institution.name = 'Test University';
    institution.description = 'A prestigious institution for higher learning';
    institution.website = 'https://test-university.edu';
    institution.email = 'contact@test-university.edu';
    institution.phone = '+1-555-123-4567';
    institution.address = '123 Campus Drive, College Town, ST 12345';
    institution.created_by = '123e4567-e89b-12d3-a456-426614174001';
    institution.created_at = new Date('2024-01-20T12:00:00Z');
    institution.updated_at = new Date('2024-01-20T12:00:00Z');
  });

  it('should create a learning institution instance', () => {
    expect(institution).toBeDefined();
    expect(institution).toBeInstanceOf(LearningInstitution);
  });

  it('should have all required properties', () => {
    expect(institution.id).toBeDefined();
    expect(institution.name).toBeDefined();
    expect(institution.description).toBeDefined();
    expect(institution.website).toBeDefined();
    expect(institution.email).toBeDefined();
    expect(institution.phone).toBeDefined();
    expect(institution.created_by).toBeDefined();
    expect(institution.created_at).toBeDefined();
    expect(institution.updated_at).toBeDefined();
  });

  it('should have correct property types', () => {
    expect(typeof institution.id).toBe('string');
    expect(typeof institution.name).toBe('string');
    expect(typeof institution.description).toBe('string');
    expect(typeof institution.website).toBe('string');
    expect(typeof institution.email).toBe('string');
    expect(typeof institution.phone).toBe('string');
    expect(typeof institution.created_by).toBe('string');
    expect(institution.created_at).toBeInstanceOf(Date);
    expect(institution.updated_at).toBeInstanceOf(Date);
  });

  it('should have optional address property', () => {
    expect(institution.address).toBeDefined();
    expect(typeof institution.address).toBe('string');

    // Test with undefined address
    const institutionWithoutAddress = new LearningInstitution();
    expect(institutionWithoutAddress.address).toBeUndefined();
  });

  it('should have a courses property as an array', () => {
    expect(institution.courses).toBeUndefined(); // Initially undefined

    const course = new InstructionalCourse();
    institution.courses = [course];

    expect(Array.isArray(institution.courses)).toBe(true);
    expect(institution.courses.length).toBe(1);
    expect(institution.courses[0]).toBeInstanceOf(InstructionalCourse);
  });

  it('should maintain bidirectional relationship with courses', () => {
    const course = new InstructionalCourse();
    course.id = '123e4567-e89b-12d3-a456-426614174002';
    course.institution_id = institution.id;
    course.institution = institution;

    institution.courses = [course];

    expect(institution.courses[0].institution).toBe(institution);
    expect(institution.courses[0].institution_id).toBe(institution.id);
  });
});
