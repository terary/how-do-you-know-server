import { QuestionTemplateValidAnswer } from './question-template-valid-answer.entity';
import { QuestionTemplate } from './question-template.entity';
import { FodderPool } from './fodder-pool.entity';
import { getMetadataArgsStorage } from 'typeorm';

describe('QuestionTemplateValidAnswer', () => {
  let validAnswer: QuestionTemplateValidAnswer;

  beforeEach(() => {
    validAnswer = new QuestionTemplateValidAnswer();
  });

  it('should be defined', () => {
    expect(validAnswer).toBeDefined();
  });

  it('should have all required columns defined in metadata', () => {
    const columns = getMetadataArgsStorage().columns.filter(
      (col) => col.target === QuestionTemplateValidAnswer,
    );
    const columnNames = columns.map((col) => col.propertyName);
    expect(columnNames).toContain('id');
    expect(columnNames).toContain('template_id');
    expect(columnNames).toContain('text');
    expect(columnNames).toContain('booleanValue');
    expect(columnNames).toContain('fodderPoolId');
    expect(columnNames).toContain('created_at');
  });

  it('should initialize with undefined properties', () => {
    expect(validAnswer.id).toBeUndefined();
    expect(validAnswer.template_id).toBeUndefined();
    expect(validAnswer.text).toBeUndefined();
    expect(validAnswer.booleanValue).toBeUndefined();
    expect(validAnswer.fodderPoolId).toBeUndefined();
    expect(validAnswer.created_at).toBeUndefined();
    expect(validAnswer.template).toBeUndefined();
    expect(validAnswer.fodderPool).toBeUndefined();
  });

  it('should accept valid values', () => {
    validAnswer.id = '1';
    validAnswer.template_id = '2';
    validAnswer.text = 'Test answer';
    validAnswer.booleanValue = true;
    validAnswer.fodderPoolId = '3';
    validAnswer.created_at = new Date();

    expect(validAnswer.id).toBe('1');
    expect(validAnswer.template_id).toBe('2');
    expect(validAnswer.text).toBe('Test answer');
    expect(validAnswer.booleanValue).toBe(true);
    expect(validAnswer.fodderPoolId).toBe('3');
    expect(validAnswer.created_at).toBeInstanceOf(Date);
  });

  it('should allow null values for nullable fields', () => {
    Object.assign(validAnswer, {
      text: null,
      booleanValue: null,
      fodderPoolId: null,
    });

    expect(validAnswer.text).toBeNull();
    expect(validAnswer.booleanValue).toBeNull();
    expect(validAnswer.fodderPoolId).toBeNull();
  });

  describe('relationships', () => {
    it('should have ManyToOne relationship with QuestionTemplate', () => {
      const relations = getMetadataArgsStorage().relations.filter(
        (rel) => rel.target === QuestionTemplateValidAnswer,
      );
      const templateRelation = relations.find(
        (rel) => rel.propertyName === 'template',
      );

      expect(templateRelation).toBeDefined();
      expect(templateRelation?.relationType).toBe('many-to-one');

      const typeFunction =
        templateRelation?.type as () => typeof QuestionTemplate;
      expect(typeFunction()).toBe(QuestionTemplate);

      expect(typeof templateRelation?.inverseSideProperty).toBe('function');
    });

    it('should have ManyToOne relationship with FodderPool', () => {
      const relations = getMetadataArgsStorage().relations.filter(
        (rel) => rel.target === QuestionTemplateValidAnswer,
      );
      const fodderPoolRelation = relations.find(
        (rel) => rel.propertyName === 'fodderPool',
      );

      expect(fodderPoolRelation).toBeDefined();
      expect(fodderPoolRelation?.relationType).toBe('many-to-one');

      const typeFunction = fodderPoolRelation?.type as () => typeof FodderPool;
      expect(typeFunction()).toBe(FodderPool);
    });

    it('should initialize relationships as undefined', () => {
      const validAnswer = new QuestionTemplateValidAnswer();
      expect(validAnswer.template).toBeUndefined();
      expect(validAnswer.fodderPool).toBeUndefined();
    });
  });
});
