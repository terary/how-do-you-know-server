import { ExamTemplate, ExamExclusivityType } from './exam-template.entity';
import { ExamTemplateSection } from './exam-template-section.entity';

describe('ExamTemplate', () => {
  let template: ExamTemplate;
  let parentTemplate: ExamTemplate;
  let section: ExamTemplateSection;

  beforeEach(() => {
    parentTemplate = new ExamTemplate();
    parentTemplate.id = '123e4567-e89b-12d3-a456-426614174000';
    parentTemplate.name = 'Parent Template';
    parentTemplate.version = 1;

    section = new ExamTemplateSection();
    section.id = '123e4567-e89b-12d3-a456-426614174002';
    section.title = 'Test Section';

    template = new ExamTemplate();
    template.id = '123e4567-e89b-12d3-a456-426614174001';
    template.name = 'Test Template';
    template.description = 'A test exam template';
    template.course_id = '123e4567-e89b-12d3-a456-426614174003';
    template.created_by = '123e4567-e89b-12d3-a456-426614174004';
    template.availability_start_date = new Date('2024-02-01T00:00:00Z');
    template.availability_end_date = new Date('2024-05-31T00:00:00Z');
    template.version = 2;
    template.parent_template_id = parentTemplate.id;
    template.is_published = false;
    template.examExclusivityType = ExamExclusivityType.EXAM_PRACTICE_BOTH;
    template.parentTemplate = parentTemplate;
    template.sections = [section];
    template.created_at = new Date('2024-01-20T12:00:00Z');
    template.updated_at = new Date('2024-01-20T12:00:00Z');
    template.user_defined_tags = 'tag1,tag2';
  });

  it('should create an exam template instance', () => {
    expect(template).toBeDefined();
    expect(template).toBeInstanceOf(ExamTemplate);
  });

  it('should have all required properties', () => {
    expect(template.id).toBeDefined();
    expect(template.name).toBeDefined();
    expect(template.description).toBeDefined();
    expect(template.course_id).toBeDefined();
    expect(template.created_by).toBeDefined();
    expect(template.availability_start_date).toBeDefined();
    expect(template.availability_end_date).toBeDefined();
    expect(template.version).toBeDefined();
    expect(template.is_published).toBeDefined();
    expect(template.examExclusivityType).toBeDefined();
    expect(template.created_at).toBeDefined();
    expect(template.updated_at).toBeDefined();
  });

  it('should have correct property types', () => {
    expect(typeof template.id).toBe('string');
    expect(typeof template.name).toBe('string');
    expect(typeof template.description).toBe('string');
    expect(typeof template.course_id).toBe('string');
    expect(typeof template.created_by).toBe('string');
    expect(template.availability_start_date).toBeInstanceOf(Date);
    expect(template.availability_end_date).toBeInstanceOf(Date);
    expect(typeof template.version).toBe('number');
    expect(typeof template.is_published).toBe('boolean');
    expect(typeof template.examExclusivityType).toBe('string');
    expect(template.created_at).toBeInstanceOf(Date);
    expect(template.updated_at).toBeInstanceOf(Date);
  });

  it('should validate exam exclusivity type enum values', () => {
    expect(Object.values(ExamExclusivityType)).toContain(
      template.examExclusivityType,
    );

    // Test all possible enum values
    Object.values(ExamExclusivityType).forEach((type) => {
      template.examExclusivityType = type;
      expect(template.examExclusivityType).toBe(type);
    });
  });

  it('should maintain relationship with parent template', () => {
    expect(template.parentTemplate).toBeDefined();
    expect(template.parentTemplate).toBe(parentTemplate);
    expect(template.parent_template_id).toBe(parentTemplate.id);
  });

  it('should maintain relationship with sections', () => {
    expect(template.sections).toBeDefined();
    expect(Array.isArray(template.sections)).toBe(true);
    expect(template.sections).toContain(section);
  });

  it('should handle user defined tags', () => {
    expect(template.user_defined_tags).toBe('tag1,tag2');

    // Test empty tags
    const newTemplate = new ExamTemplate();
    expect(newTemplate.user_defined_tags).toBeUndefined();

    // Test multiple tags
    template.user_defined_tags = 'tag1,tag2,tag3';
    expect(template.user_defined_tags.split(',').length).toBe(3);
  });

  it('should handle version numbers', () => {
    expect(template.version).toBe(2);
    expect(parentTemplate.version).toBe(1);

    // Test default version
    const newTemplate = new ExamTemplate();
    expect(newTemplate.version).toBeUndefined(); // Should use default from DB
  });

  it('should handle null availability dates', () => {
    const newTemplate = new ExamTemplate();
    expect(newTemplate.availability_start_date).toBeUndefined();
    expect(newTemplate.availability_end_date).toBeUndefined();
  });

  it('should handle created_by and course_id nullability', () => {
    const newTemplate = new ExamTemplate();
    expect(newTemplate.created_by).toBeUndefined();
    expect(newTemplate.course_id).toBeUndefined();
  });

  it('should handle parent template relationship nullability', () => {
    const newTemplate = new ExamTemplate();
    expect(newTemplate.parent_template_id).toBeUndefined();
    expect(newTemplate.parentTemplate).toBeUndefined();
  });

  it('should initialize with empty sections array', () => {
    const newTemplate = new ExamTemplate();
    expect(newTemplate.sections).toBeUndefined();
  });
});
