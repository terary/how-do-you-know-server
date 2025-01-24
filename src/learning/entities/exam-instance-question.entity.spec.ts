import {
  ExamInstanceQuestion,
  QuestionStatus,
} from './exam-instance-question.entity';
import { ExamInstanceSection } from './exam-instance-section.entity';
import { ExamTemplateSectionQuestion } from './exam-template-section-question.entity';

describe('ExamInstanceQuestion', () => {
  let question: ExamInstanceQuestion;
  let section: ExamInstanceSection;
  let templateQuestion: ExamTemplateSectionQuestion;

  beforeEach(() => {
    section = new ExamInstanceSection();
    section.id = '123e4567-e89b-12d3-a456-426614174000';

    templateQuestion = new ExamTemplateSectionQuestion();
    templateQuestion.id = '123e4567-e89b-12d3-a456-426614174001';

    question = new ExamInstanceQuestion();
    question.id = '123e4567-e89b-12d3-a456-426614174002';
    question.section_id = section.id;
    question.template_question_id = templateQuestion.id;
    question.status = QuestionStatus.UNANSWERED;
    question.position = 1;
    question.student_answer = { choice: 'A' };
    question.is_correct = false;
    question.score = null;
    question.feedback = null;
    question.answered_at = null;
    question.user_defined_tags = 'tag1,tag2';
    question.user_notes = [
      {
        note: 'Test note',
        created_at: new Date('2024-02-01T01:00:00Z'),
      },
    ];
    question.section = section;
    question.templateQuestion = templateQuestion;
    question.created_at = new Date('2024-01-20T12:00:00Z');
    question.updated_at = new Date('2024-01-20T12:00:00Z');
  });

  it('should create an exam instance question', () => {
    expect(question).toBeDefined();
    expect(question).toBeInstanceOf(ExamInstanceQuestion);
  });

  it('should have all required properties', () => {
    expect(question.id).toBeDefined();
    expect(question.section_id).toBeDefined();
    expect(question.template_question_id).toBeDefined();
    expect(question.status).toBeDefined();
    expect(question.position).toBeDefined();
    expect(question.is_correct).toBeDefined();
    expect(question.created_at).toBeDefined();
    expect(question.updated_at).toBeDefined();
  });

  it('should have correct property types', () => {
    expect(typeof question.id).toBe('string');
    expect(typeof question.section_id).toBe('string');
    expect(typeof question.template_question_id).toBe('string');
    expect(typeof question.status).toBe('string');
    expect(typeof question.position).toBe('number');
    expect(typeof question.is_correct).toBe('boolean');
    expect(question.created_at).toBeInstanceOf(Date);
    expect(question.updated_at).toBeInstanceOf(Date);
  });

  it('should validate question status enum values', () => {
    expect(Object.values(QuestionStatus)).toContain(question.status);

    // Test all possible enum values
    Object.values(QuestionStatus).forEach((status) => {
      question.status = status;
      expect(question.status).toBe(status);
    });
  });

  it('should maintain relationship with section', () => {
    expect(question.section).toBeDefined();
    expect(question.section).toBe(section);
    expect(question.section_id).toBe(section.id);
  });

  it('should maintain relationship with template question', () => {
    expect(question.templateQuestion).toBeDefined();
    expect(question.templateQuestion).toBe(templateQuestion);
    expect(question.template_question_id).toBe(templateQuestion.id);
  });

  it('should handle student answers', () => {
    expect(question.student_answer).toBeDefined();
    expect(question.student_answer.choice).toBe('A');

    // Test different answer formats
    question.student_answer = { text: 'Sample answer' };
    expect(question.student_answer.text).toBe('Sample answer');

    question.student_answer = { choices: ['A', 'B'] };
    expect(Array.isArray(question.student_answer.choices)).toBe(true);
  });

  it('should handle scoring', () => {
    expect(question.is_correct).toBe(false);
    expect(question.score).toBeNull();

    // Test partial credit
    question.score = 0.5;
    expect(question.score).toBe(0.5);

    // Test full credit
    question.score = 1.0;
    question.is_correct = true;
    expect(question.score).toBe(1.0);
    expect(question.is_correct).toBe(true);
  });

  it('should handle feedback', () => {
    expect(question.feedback).toBeNull();

    // Test setting feedback
    question.feedback = 'Good attempt!';
    expect(question.feedback).toBe('Good attempt!');
  });

  it('should handle user notes', () => {
    expect(Array.isArray(question.user_notes)).toBe(true);
    expect(question.user_notes.length).toBe(1);

    const note = question.user_notes[0];
    expect(typeof note.note).toBe('string');
    expect(note.created_at).toBeInstanceOf(Date);

    // Test empty notes
    const newQuestion = new ExamInstanceQuestion();
    expect(newQuestion.user_notes).toBeUndefined();

    // Test adding notes
    question.user_notes.push({
      note: 'Another note',
      created_at: new Date(),
    });
    expect(question.user_notes.length).toBe(2);
  });

  it('should handle user defined tags', () => {
    expect(question.user_defined_tags).toBe('tag1,tag2');

    // Test empty tags
    const newQuestion = new ExamInstanceQuestion();
    expect(newQuestion.user_defined_tags).toBeUndefined();

    // Test multiple tags
    question.user_defined_tags = 'tag1,tag2,tag3';
    expect(question.user_defined_tags.split(',').length).toBe(3);
  });

  it('should handle answered timestamp', () => {
    expect(question.answered_at).toBeNull();

    // Test setting answered timestamp
    const now = new Date();
    question.answered_at = now;
    expect(question.answered_at).toBe(now);
  });

  it('should handle empty student answer', () => {
    const newQuestion = new ExamInstanceQuestion();
    expect(newQuestion.student_answer).toBeUndefined();
  });

  it('should validate score constraints', () => {
    expect(question.score).toBeNull();

    question.score = 0.75;
    expect(question.score).toBeGreaterThanOrEqual(0);
    expect(question.score).toBeLessThanOrEqual(1);
  });

  it('should handle status transitions', () => {
    expect(question.status).toBe(QuestionStatus.UNANSWERED);
    question.status = QuestionStatus.ANSWERED;
    expect(question.status).toBe(QuestionStatus.ANSWERED);
    question.status = QuestionStatus.SKIPPED;
    expect(question.status).toBe(QuestionStatus.SKIPPED);
  });

  it('should handle position updates', () => {
    const newQuestion = new ExamInstanceQuestion();
    expect(newQuestion.position).toBeUndefined();

    newQuestion.position = 3;
    expect(newQuestion.position).toBe(3);
  });
});
