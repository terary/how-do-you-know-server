import {
  ExamInstanceSection,
  SectionStatus,
} from './exam-instance-section.entity';
import { ExamInstance } from './exam-instance.entity';
import { ExamTemplateSection } from './exam-template-section.entity';

describe('ExamInstanceSection', () => {
  let section: ExamInstanceSection;
  let examInstance: ExamInstance;
  let templateSection: ExamTemplateSection;

  beforeEach(() => {
    examInstance = new ExamInstance();
    examInstance.id = '123e4567-e89b-12d3-a456-426614174000';

    templateSection = new ExamTemplateSection();
    templateSection.id = '123e4567-e89b-12d3-a456-426614174001';
    templateSection.title = 'Template Section';

    section = new ExamInstanceSection();
    section.id = '123e4567-e89b-12d3-a456-426614174002';
    section.exam_instance_id = examInstance.id;
    section.template_section_id = templateSection.id;
    section.status = SectionStatus.NOT_STARTED;
    section.position = 1;
    section.started_at = null;
    section.completed_at = null;
    section.time_limit_seconds = 3600;
    section.time_spent_seconds = 0;
    section.user_defined_tags = 'tag1,tag2';
    section.examInstance = examInstance;
    section.templateSection = templateSection;
    section.created_at = new Date('2024-01-20T12:00:00Z');
    section.updated_at = new Date('2024-01-20T12:00:00Z');
  });

  it('should create an exam instance section', () => {
    expect(section).toBeDefined();
    expect(section).toBeInstanceOf(ExamInstanceSection);
  });

  it('should have all required properties', () => {
    expect(section.id).toBeDefined();
    expect(section.exam_instance_id).toBeDefined();
    expect(section.template_section_id).toBeDefined();
    expect(section.status).toBeDefined();
    expect(section.position).toBeDefined();
    expect(section.time_limit_seconds).toBeDefined();
    expect(section.time_spent_seconds).toBeDefined();
    expect(section.created_at).toBeDefined();
    expect(section.updated_at).toBeDefined();
  });

  it('should have correct property types', () => {
    expect(typeof section.id).toBe('string');
    expect(typeof section.exam_instance_id).toBe('string');
    expect(typeof section.template_section_id).toBe('string');
    expect(typeof section.status).toBe('string');
    expect(typeof section.position).toBe('number');
    expect(typeof section.time_limit_seconds).toBe('number');
    expect(typeof section.time_spent_seconds).toBe('number');
    expect(section.created_at).toBeInstanceOf(Date);
    expect(section.updated_at).toBeInstanceOf(Date);
  });

  it('should validate section status enum values', () => {
    expect(Object.values(SectionStatus)).toContain(section.status);

    // Test all possible enum values
    Object.values(SectionStatus).forEach((status) => {
      section.status = status;
      expect(section.status).toBe(status);
    });
  });

  it('should maintain relationship with exam instance', () => {
    expect(section.examInstance).toBeDefined();
    expect(section.examInstance).toBe(examInstance);
    expect(section.exam_instance_id).toBe(examInstance.id);
  });

  it('should maintain relationship with template section', () => {
    expect(section.templateSection).toBeDefined();
    expect(section.templateSection).toBe(templateSection);
    expect(section.template_section_id).toBe(templateSection.id);
  });

  it('should handle nullable timestamps', () => {
    expect(section.started_at).toBeNull();
    expect(section.completed_at).toBeNull();

    // Test setting timestamps
    const now = new Date();
    section.started_at = now;
    section.completed_at = now;
    expect(section.started_at).toBe(now);
    expect(section.completed_at).toBe(now);
  });

  it('should handle time tracking', () => {
    expect(section.time_limit_seconds).toBe(3600);
    expect(section.time_spent_seconds).toBe(0);

    // Test updating time spent
    section.time_spent_seconds = 1800;
    expect(section.time_spent_seconds).toBe(1800);
  });

  it('should handle user defined tags', () => {
    expect(section.user_defined_tags).toBe('tag1,tag2');

    // Test empty tags
    const newSection = new ExamInstanceSection();
    expect(newSection.user_defined_tags).toBeUndefined();

    // Test multiple tags
    section.user_defined_tags = 'tag1,tag2,tag3';
    expect(section.user_defined_tags.split(',').length).toBe(3);
  });

  it('should handle position defaults and updates', () => {
    const newSection = new ExamInstanceSection();
    expect(newSection.position).toBeUndefined();

    newSection.position = 5;
    expect(newSection.position).toBe(5);
  });

  it('should validate time tracking constraints', () => {
    expect(section.time_spent_seconds).toBeLessThanOrEqual(
      section.time_limit_seconds,
    );

    section.time_spent_seconds = 7200;
    expect(section.time_spent_seconds).toBe(7200);
  });

  it('should handle status transitions', () => {
    expect(section.status).toBe(SectionStatus.NOT_STARTED);
    section.status = SectionStatus.IN_PROGRESS;
    expect(section.status).toBe(SectionStatus.IN_PROGRESS);
    section.status = SectionStatus.COMPLETED;
    expect(section.status).toBe(SectionStatus.COMPLETED);
  });
});
