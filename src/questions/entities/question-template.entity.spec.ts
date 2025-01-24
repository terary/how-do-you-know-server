import { getMetadataArgsStorage } from 'typeorm';
import {
  QuestionTemplate,
  QuestionDifficulty,
} from './question-template.entity';
import { QuestionTemplateMedia } from './question-template-media.entity';
import { QuestionTemplateValidAnswer } from './question-template-valid-answer.entity';
import { QuestionActual } from './question-actual.entity';
import {
  TUserPromptType,
  TUserResponseType,
  TMediaContentType,
} from '../types';

describe('QuestionTemplate', () => {
  let questionTemplate: QuestionTemplate;

  beforeEach(() => {
    questionTemplate = new QuestionTemplate();
  });

  it('should be defined', () => {
    expect(questionTemplate).toBeDefined();
  });

  it('should have all required columns defined in metadata', () => {
    const metadata = getMetadataArgsStorage();
    const columns = metadata.columns.filter(
      (col) => col.target === QuestionTemplate,
    );
    const columnNames = columns.map((col) => col.propertyName);

    expect(columnNames).toContain('id');
    expect(columnNames).toContain('userPromptType');
    expect(columnNames).toContain('userResponseType');
    expect(columnNames).toContain('exclusivityType');
    expect(columnNames).toContain('userPromptText');
    expect(columnNames).toContain('instructionText');
    expect(columnNames).toContain('difficulty');
    expect(columnNames).toContain('topics');
    expect(columnNames).toContain('created_by');
    expect(columnNames).toContain('created_at');
    expect(columnNames).toContain('user_defined_tags');
  });

  it('should initialize with undefined properties', () => {
    expect(questionTemplate.id).toBeUndefined();
    expect(questionTemplate.userPromptType).toBeUndefined();
    expect(questionTemplate.userResponseType).toBeUndefined();
    expect(questionTemplate.exclusivityType).toBeUndefined();
    expect(questionTemplate.userPromptText).toBeUndefined();
    expect(questionTemplate.instructionText).toBeUndefined();
    expect(questionTemplate.difficulty).toBeUndefined();
    expect(questionTemplate.topics).toBeUndefined();
    expect(questionTemplate.created_by).toBeUndefined();
    expect(questionTemplate.created_at).toBeUndefined();
    expect(questionTemplate.user_defined_tags).toBeUndefined();
    expect(questionTemplate.media).toBeUndefined();
    expect(questionTemplate.validAnswers).toBeUndefined();
    expect(questionTemplate.actuals).toBeUndefined();
  });

  it('should accept valid values', () => {
    questionTemplate.id = 'test-id';
    questionTemplate.userPromptType = 'text';
    questionTemplate.userResponseType = 'multiple-choice-4';
    questionTemplate.exclusivityType = 'exam-practice-both';
    questionTemplate.userPromptText = 'test prompt';
    questionTemplate.instructionText = 'test instruction';
    questionTemplate.difficulty = QuestionDifficulty.MEDIUM;
    questionTemplate.topics = ['topic1', 'topic2'];
    questionTemplate.created_by = 'user-id';
    questionTemplate.created_at = new Date();
    questionTemplate.user_defined_tags = 'tag1 tag2';

    expect(questionTemplate.id).toBe('test-id');
    expect(questionTemplate.userPromptType).toBe('text');
    expect(questionTemplate.userResponseType).toBe('multiple-choice-4');
    expect(questionTemplate.exclusivityType).toBe('exam-practice-both');
    expect(questionTemplate.userPromptText).toBe('test prompt');
    expect(questionTemplate.instructionText).toBe('test instruction');
    expect(questionTemplate.difficulty).toBe(QuestionDifficulty.MEDIUM);
    expect(questionTemplate.topics).toEqual(['topic1', 'topic2']);
    expect(questionTemplate.created_by).toBe('user-id');
    expect(questionTemplate.created_at).toBeInstanceOf(Date);
    expect(questionTemplate.user_defined_tags).toBe('tag1 tag2');
  });

  it('should allow null for optional text fields', () => {
    questionTemplate.userPromptText = null;
    questionTemplate.instructionText = null;
    expect(questionTemplate.userPromptText).toBeNull();
    expect(questionTemplate.instructionText).toBeNull();
  });

  it('should accept valid user prompt types', () => {
    const validTypes: TUserPromptType[] = ['text', 'multimedia'];
    validTypes.forEach((type) => {
      questionTemplate.userPromptType = type;
      expect(questionTemplate.userPromptType).toBe(type);
    });
  });

  it('should accept valid user response types', () => {
    const validTypes: TUserResponseType[] = [
      'free-text-255',
      'multiple-choice-4',
      'true-false',
    ];
    validTypes.forEach((type) => {
      questionTemplate.userResponseType = type;
      expect(questionTemplate.userResponseType).toBe(type);
    });
  });

  it('should accept valid exclusivity types', () => {
    const validTypes = [
      'exam-only',
      'practice-only',
      'exam-practice-both',
    ] as const;
    validTypes.forEach((type) => {
      questionTemplate.exclusivityType = type;
      expect(questionTemplate.exclusivityType).toBe(type);
    });
  });

  describe('relationships', () => {
    it('should have OneToMany relationship with QuestionTemplateMedia', () => {
      const metadata = getMetadataArgsStorage();
      const mediaRelation = metadata.relations.find(
        (rel) =>
          rel.target === QuestionTemplate && rel.propertyName === 'media',
      );

      expect(mediaRelation).toBeDefined();
      const typeFunction =
        mediaRelation?.type as () => typeof QuestionTemplateMedia;
      expect(typeFunction()).toBe(QuestionTemplateMedia);
      expect(mediaRelation?.relationType).toBe('one-to-many');
      expect(typeof mediaRelation?.inverseSideProperty).toBe('function');
    });

    it('should have OneToMany relationship with QuestionTemplateValidAnswer', () => {
      const metadata = getMetadataArgsStorage();
      const validAnswersRelation = metadata.relations.find(
        (rel) =>
          rel.target === QuestionTemplate &&
          rel.propertyName === 'validAnswers',
      );

      expect(validAnswersRelation).toBeDefined();
      const typeFunction =
        validAnswersRelation?.type as () => typeof QuestionTemplateValidAnswer;
      expect(typeFunction()).toBe(QuestionTemplateValidAnswer);
      expect(validAnswersRelation?.relationType).toBe('one-to-many');
      expect(typeof validAnswersRelation?.inverseSideProperty).toBe('function');
    });

    it('should have OneToMany relationship with QuestionActual', () => {
      const metadata = getMetadataArgsStorage();
      const actualsRelation = metadata.relations.find(
        (rel) =>
          rel.target === QuestionTemplate && rel.propertyName === 'actuals',
      );

      expect(actualsRelation).toBeDefined();
      const typeFunction = actualsRelation?.type as () => typeof QuestionActual;
      expect(typeFunction()).toBe(QuestionActual);
      expect(actualsRelation?.relationType).toBe('one-to-many');
      expect(typeof actualsRelation?.inverseSideProperty).toBe('function');
    });

    it('should handle relationship assignments', () => {
      const media = new QuestionTemplateMedia();
      media.template_id = 'test-id';
      media.mediaContentType = 'image/*';
      media.url = 'https://example.com/image.jpg';
      media.height = 100;
      media.width = 100;

      const validAnswer = new QuestionTemplateValidAnswer();
      validAnswer.template_id = 'test-id';
      validAnswer.text = 'Paris';

      const actual = new QuestionActual();
      actual.template_id = 'test-id';
      actual.examType = 'practice';
      actual.sectionPosition = 1;

      questionTemplate.id = 'test-id';
      questionTemplate.media = [media];
      questionTemplate.validAnswers = [validAnswer];
      questionTemplate.actuals = [actual];

      expect(questionTemplate.media).toHaveLength(1);
      expect(questionTemplate.media[0]).toBe(media);
      expect(questionTemplate.validAnswers).toHaveLength(1);
      expect(questionTemplate.validAnswers[0]).toBe(validAnswer);
      expect(questionTemplate.actuals).toHaveLength(1);
      expect(questionTemplate.actuals[0]).toBe(actual);
    });
  });
});
