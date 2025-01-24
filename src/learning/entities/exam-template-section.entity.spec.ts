import { ExamTemplateSection } from './exam-template-section.entity';
import { ExamTemplate } from './exam-template.entity';
import { ExamTemplateSectionQuestion } from './exam-template-section-question.entity';

describe('ExamTemplateSection', () => {
  let section: ExamTemplateSection;
  let template: ExamTemplate;
  let question: ExamTemplateSectionQuestion;

  beforeEach(() => {
    template = new ExamTemplate();
    template.id = '123e4567-e89b-12d3-a456-426614174000';
    template.name = 'Test Template';

    question = new ExamTemplateSectionQuestion();
    question.id = '123e4567-e89b-12d3-a456-426614174002';
    question.position = 1;

    section = new ExamTemplateSection();
    section.id = '123e4567-e89b-12d3-a456-426614174001';
    section.title = 'Test Section';
    section.instructions = 'Test instructions for the section';
    section.position = 1;
    section.timeLimitSeconds = 3600;
    section.difficultyDistribution = [
      { difficulty: 'EASY', percentage: 30 },
      { difficulty: 'MEDIUM', percentage: 40 },
      { difficulty: 'HARD', percentage: 30 },
    ];
    section.topicDistribution = [
      { topics: ['math'], percentage: 50 },
      { topics: ['science'], percentage: 50 },
    ];
    section.exam_template_id = template.id;
    section.examTemplate = template;
    section.questions = [question];
    section.created_at = new Date('2024-01-20T12:00:00Z');
    section.updated_at = new Date('2024-01-20T12:00:00Z');
    section.user_defined_tags = 'tag1,tag2';
  });

  it('should create an exam template section instance', () => {
    expect(section).toBeDefined();
    expect(section).toBeInstanceOf(ExamTemplateSection);
  });

  it('should have all required properties', () => {
    expect(section.id).toBeDefined();
    expect(section.title).toBeDefined();
    expect(section.instructions).toBeDefined();
    expect(section.position).toBeDefined();
    expect(section.timeLimitSeconds).toBeDefined();
    expect(section.exam_template_id).toBeDefined();
    expect(section.created_at).toBeDefined();
    expect(section.updated_at).toBeDefined();
  });

  it('should have correct property types', () => {
    expect(typeof section.id).toBe('string');
    expect(typeof section.title).toBe('string');
    expect(typeof section.instructions).toBe('string');
    expect(typeof section.position).toBe('number');
    expect(typeof section.timeLimitSeconds).toBe('number');
    expect(typeof section.exam_template_id).toBe('string');
    expect(section.created_at).toBeInstanceOf(Date);
    expect(section.updated_at).toBeInstanceOf(Date);
  });

  it('should handle difficulty distribution', () => {
    expect(Array.isArray(section.difficultyDistribution)).toBe(true);
    expect(section.difficultyDistribution.length).toBe(3);

    section.difficultyDistribution.forEach((dist) => {
      expect(typeof dist.difficulty).toBe('string');
      expect(typeof dist.percentage).toBe('number');
      expect(dist.percentage).toBeGreaterThanOrEqual(0);
      expect(dist.percentage).toBeLessThanOrEqual(100);
    });

    // Test total percentage equals 100
    const totalPercentage = section.difficultyDistribution.reduce(
      (sum, dist) => sum + dist.percentage,
      0,
    );
    expect(totalPercentage).toBe(100);
  });

  it('should handle topic distribution', () => {
    expect(Array.isArray(section.topicDistribution)).toBe(true);
    expect(section.topicDistribution.length).toBe(2);

    section.topicDistribution.forEach((dist) => {
      expect(Array.isArray(dist.topics)).toBe(true);
      expect(typeof dist.percentage).toBe('number');
      expect(dist.percentage).toBeGreaterThanOrEqual(0);
      expect(dist.percentage).toBeLessThanOrEqual(100);
    });

    // Test total percentage equals 100
    const totalPercentage = section.topicDistribution.reduce(
      (sum, dist) => sum + dist.percentage,
      0,
    );
    expect(totalPercentage).toBe(100);
  });

  it('should maintain relationship with exam template', () => {
    expect(section.examTemplate).toBeDefined();
    expect(section.examTemplate).toBe(template);
    expect(section.exam_template_id).toBe(template.id);
  });

  it('should maintain relationship with questions', () => {
    expect(section.questions).toBeDefined();
    expect(Array.isArray(section.questions)).toBe(true);
    expect(section.questions).toContain(question);
  });

  it('should handle user defined tags', () => {
    expect(section.user_defined_tags).toBe('tag1,tag2');

    // Test empty tags
    const newSection = new ExamTemplateSection();
    expect(newSection.user_defined_tags).toBeUndefined();

    // Test multiple tags
    section.user_defined_tags = 'tag1,tag2,tag3';
    expect(section.user_defined_tags.split(',').length).toBe(3);
  });

  it('should handle empty difficulty distribution', () => {
    const newSection = new ExamTemplateSection();
    expect(newSection.difficultyDistribution).toBeUndefined();
  });

  it('should handle empty topic distribution', () => {
    const newSection = new ExamTemplateSection();
    expect(newSection.topicDistribution).toBeUndefined();
  });

  it('should handle null time limit', () => {
    const newSection = new ExamTemplateSection();
    expect(newSection.timeLimitSeconds).toBeUndefined();
  });

  it('should initialize with empty questions array', () => {
    const newSection = new ExamTemplateSection();
    expect(newSection.questions).toBeUndefined();
  });

  it('should handle null instructions', () => {
    const newSection = new ExamTemplateSection();
    expect(newSection.instructions).toBeUndefined();
  });
});
