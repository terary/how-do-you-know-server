import {
  ExamInstance,
  ExamInstanceType,
  ExamInstanceStatus,
} from './exam-instance.entity';
import { ExamTemplate } from './exam-template.entity';

describe('ExamInstance', () => {
  let instance: ExamInstance;
  let template: ExamTemplate;

  beforeEach(() => {
    template = new ExamTemplate();
    template.id = '123e4567-e89b-12d3-a456-426614174000';
    template.name = 'Test Template';

    instance = new ExamInstance();
    instance.id = '123e4567-e89b-12d3-a456-426614174001';
    instance.type = ExamInstanceType.EXAM;
    instance.status = ExamInstanceStatus.SCHEDULED;
    instance.template_id = template.id;
    instance.user_id = '123e4567-e89b-12d3-a456-426614174002';
    instance.course_id = '123e4567-e89b-12d3-a456-426614174003';
    instance.start_date = new Date('2024-02-01T00:00:00Z');
    instance.end_date = new Date('2024-02-02T00:00:00Z');
    instance.started_at = null;
    instance.completed_at = null;
    instance.user_notes = [
      {
        section_id: '123e4567-e89b-12d3-a456-426614174004',
        note: 'Test note',
        created_at: new Date('2024-02-01T01:00:00Z'),
      },
    ];
    instance.user_defined_tags = 'tag1,tag2';
    instance.template = template;
    instance.created_at = new Date('2024-01-20T12:00:00Z');
    instance.updated_at = new Date('2024-01-20T12:00:00Z');
  });

  it('should create an exam instance', () => {
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(ExamInstance);
  });

  it('should have all required properties', () => {
    expect(instance.id).toBeDefined();
    expect(instance.type).toBeDefined();
    expect(instance.status).toBeDefined();
    expect(instance.template_id).toBeDefined();
    expect(instance.user_id).toBeDefined();
    expect(instance.course_id).toBeDefined();
    expect(instance.start_date).toBeDefined();
    expect(instance.end_date).toBeDefined();
    expect(instance.created_at).toBeDefined();
    expect(instance.updated_at).toBeDefined();
  });

  it('should have correct property types', () => {
    expect(typeof instance.id).toBe('string');
    expect(typeof instance.type).toBe('string');
    expect(typeof instance.status).toBe('string');
    expect(typeof instance.template_id).toBe('string');
    expect(typeof instance.user_id).toBe('string');
    expect(typeof instance.course_id).toBe('string');
    expect(instance.start_date).toBeInstanceOf(Date);
    expect(instance.end_date).toBeInstanceOf(Date);
    expect(instance.created_at).toBeInstanceOf(Date);
    expect(instance.updated_at).toBeInstanceOf(Date);
  });

  it('should validate instance type enum values', () => {
    expect(Object.values(ExamInstanceType)).toContain(instance.type);

    // Test all possible enum values
    Object.values(ExamInstanceType).forEach((type) => {
      instance.type = type;
      expect(instance.type).toBe(type);
    });
  });

  it('should validate instance status enum values', () => {
    expect(Object.values(ExamInstanceStatus)).toContain(instance.status);

    // Test all possible enum values
    Object.values(ExamInstanceStatus).forEach((status) => {
      instance.status = status;
      expect(instance.status).toBe(status);
    });
  });

  it('should maintain relationship with template', () => {
    expect(instance.template).toBeDefined();
    expect(instance.template).toBe(template);
    expect(instance.template_id).toBe(template.id);
  });

  it('should handle user notes', () => {
    expect(Array.isArray(instance.user_notes)).toBe(true);
    expect(instance.user_notes.length).toBe(1);

    const note = instance.user_notes[0];
    expect(typeof note.section_id).toBe('string');
    expect(typeof note.note).toBe('string');
    expect(note.created_at).toBeInstanceOf(Date);

    // Test empty notes
    const newInstance = new ExamInstance();
    expect(newInstance.user_notes).toBeUndefined();
  });

  it('should handle user defined tags', () => {
    expect(instance.user_defined_tags).toBe('tag1,tag2');

    // Test empty tags
    const newInstance = new ExamInstance();
    expect(newInstance.user_defined_tags).toBeUndefined();

    // Test multiple tags
    instance.user_defined_tags = 'tag1,tag2,tag3';
    expect(instance.user_defined_tags.split(',').length).toBe(3);
  });

  it('should handle nullable timestamps', () => {
    expect(instance.started_at).toBeNull();
    expect(instance.completed_at).toBeNull();

    // Test setting timestamps
    const now = new Date();
    instance.started_at = now;
    instance.completed_at = now;
    expect(instance.started_at).toBe(now);
    expect(instance.completed_at).toBe(now);
  });

  it('should handle empty user notes array initialization', () => {
    const newInstance = new ExamInstance();
    expect(newInstance.user_notes).toBeUndefined();
  });

  it('should validate start and end date relationships', () => {
    expect(instance.start_date.getTime()).toBeLessThan(
      instance.end_date.getTime(),
    );

    const newInstance = new ExamInstance();
    expect(newInstance.start_date).toBeUndefined();
    expect(newInstance.end_date).toBeUndefined();
  });

  it('should handle status transitions', () => {
    expect(instance.status).toBe(ExamInstanceStatus.SCHEDULED);
    instance.status = ExamInstanceStatus.IN_PROGRESS;
    expect(instance.status).toBe(ExamInstanceStatus.IN_PROGRESS);
    instance.status = ExamInstanceStatus.COMPLETED;
    expect(instance.status).toBe(ExamInstanceStatus.COMPLETED);
  });
});
