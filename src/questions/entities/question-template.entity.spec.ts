import { QuestionTemplate } from './question-template.entity';
import { QuestionTemplateMedia } from './question-template-media.entity';
import { QuestionTemplateValidAnswer } from './question-template-valid-answer.entity';
import { QuestionActual } from './question-actual.entity';
import {
  TUserPromptType,
  TUserResponseType,
  TMediaContentType,
} from '../types';

describe('QuestionTemplate', () => {
  let template: QuestionTemplate;
  const testDate = new Date();

  beforeEach(() => {
    template = new QuestionTemplate();
    template.id = 'test-uuid';
    template.userPromptType = 'text';
    template.userResponseType = 'multiple-choice-4';
    template.exclusivityType = 'exam-practice-both';
    template.userPromptText = 'What is the capital of France?';
    template.instructionText = 'Choose the correct answer.';
    template.created_by = 'user-uuid';
    template.created_at = testDate;
    template.media = [];
    template.validAnswers = [];
    template.actuals = [];
  });

  it('should create a question template instance', () => {
    expect(template).toBeDefined();
    expect(template instanceof QuestionTemplate).toBeTruthy();
  });

  it('should have all required properties', () => {
    expect(template).toHaveProperty('id', 'test-uuid');
    expect(template).toHaveProperty('userPromptType', 'text');
    expect(template).toHaveProperty('userResponseType', 'multiple-choice-4');
    expect(template).toHaveProperty('exclusivityType', 'exam-practice-both');
    expect(template).toHaveProperty('created_by', 'user-uuid');
    expect(template).toHaveProperty('created_at', testDate);
  });

  it('should allow null for optional text fields', () => {
    template.userPromptText = null;
    template.instructionText = null;
    expect(template.userPromptText).toBeNull();
    expect(template.instructionText).toBeNull();
  });

  it('should accept valid user prompt types', () => {
    const validTypes: TUserPromptType[] = ['text', 'multimedia'];
    validTypes.forEach((type) => {
      template.userPromptType = type;
      expect(template.userPromptType).toBe(type);
    });
  });

  it('should accept valid user response types', () => {
    const validTypes: TUserResponseType[] = [
      'free-text-255',
      'multiple-choice-4',
      'true-false',
    ];
    validTypes.forEach((type) => {
      template.userResponseType = type;
      expect(template.userResponseType).toBe(type);
    });
  });

  it('should accept valid exclusivity types', () => {
    const validTypes = [
      'exam-only',
      'practice-only',
      'exam-practice-both',
    ] as const;
    validTypes.forEach((type) => {
      template.exclusivityType = type;
      expect(template.exclusivityType).toBe(type);
    });
  });

  it('should have media relationship', () => {
    const media = new QuestionTemplateMedia();
    media.id = 'media-uuid';
    media.template_id = template.id;
    media.mediaContentType = 'image/*';
    media.url = 'https://example.com/image.jpg';
    media.height = 100;
    media.width = 100;
    media.template = template;

    template.media = [media];

    expect(template.media.length).toBe(1);
    expect(template.media[0].template_id).toBe(template.id);
    expect(template.media[0].template).toBe(template);
  });

  it('should have valid answers relationship', () => {
    const answer = new QuestionTemplateValidAnswer();
    answer.id = 'answer-uuid';
    answer.template_id = template.id;
    answer.text = 'Paris';
    answer.template = template;

    template.validAnswers = [answer];

    expect(template.validAnswers.length).toBe(1);
    expect(template.validAnswers[0].template_id).toBe(template.id);
    expect(template.validAnswers[0].template).toBe(template);
  });

  it('should have actuals relationship', () => {
    const actual = new QuestionActual();
    actual.id = 'actual-uuid';
    actual.template_id = template.id;
    actual.examType = 'practice';
    actual.sectionPosition = 1;
    actual.template = template;

    template.actuals = [actual];

    expect(template.actuals.length).toBe(1);
    expect(template.actuals[0].template_id).toBe(template.id);
    expect(template.actuals[0].template).toBe(template);
  });
});
