import { ExamTemplateSectionQuestion } from './exam-template-section-question.entity';
import { ExamTemplateSection } from './exam-template-section.entity';
import { QuestionTemplate } from '../../questions/entities/question-template.entity';

describe('ExamTemplateSectionQuestion', () => {
  let sectionQuestion: ExamTemplateSectionQuestion;
  let section: ExamTemplateSection;
  let questionTemplate: QuestionTemplate;

  beforeEach(() => {
    section = new ExamTemplateSection();
    section.id = '123e4567-e89b-12d3-a456-426614174000';
    section.title = 'Test Section';

    questionTemplate = new QuestionTemplate();
    questionTemplate.id = '123e4567-e89b-12d3-a456-426614174002';

    sectionQuestion = new ExamTemplateSectionQuestion();
    sectionQuestion.id = '123e4567-e89b-12d3-a456-426614174001';
    sectionQuestion.section_id = section.id;
    sectionQuestion.question_template_id = questionTemplate.id;
    sectionQuestion.position = 1;
    sectionQuestion.section = section;
    sectionQuestion.questionTemplate = questionTemplate;
    sectionQuestion.created_at = new Date('2024-01-20T12:00:00Z');
    sectionQuestion.updated_at = new Date('2024-01-20T12:00:00Z');
  });

  it('should create an exam template section question instance', () => {
    expect(sectionQuestion).toBeDefined();
    expect(sectionQuestion).toBeInstanceOf(ExamTemplateSectionQuestion);
  });

  it('should have all required properties', () => {
    expect(sectionQuestion.id).toBeDefined();
    expect(sectionQuestion.section_id).toBeDefined();
    expect(sectionQuestion.question_template_id).toBeDefined();
    expect(sectionQuestion.position).toBeDefined();
    expect(sectionQuestion.created_at).toBeDefined();
    expect(sectionQuestion.updated_at).toBeDefined();
  });

  it('should have correct property types', () => {
    expect(typeof sectionQuestion.id).toBe('string');
    expect(typeof sectionQuestion.section_id).toBe('string');
    expect(typeof sectionQuestion.question_template_id).toBe('string');
    expect(typeof sectionQuestion.position).toBe('number');
    expect(sectionQuestion.created_at).toBeInstanceOf(Date);
    expect(sectionQuestion.updated_at).toBeInstanceOf(Date);
  });

  it('should maintain relationship with section', () => {
    expect(sectionQuestion.section).toBeDefined();
    expect(sectionQuestion.section).toBe(section);
    expect(sectionQuestion.section_id).toBe(section.id);
  });

  it('should maintain relationship with question template', () => {
    expect(sectionQuestion.questionTemplate).toBeDefined();
    expect(sectionQuestion.questionTemplate).toBe(questionTemplate);
    expect(sectionQuestion.question_template_id).toBe(questionTemplate.id);
  });

  it('should handle position defaults', () => {
    const newSectionQuestion = new ExamTemplateSectionQuestion();
    expect(newSectionQuestion.position).toBeUndefined(); // Should use default from DB
  });
});
