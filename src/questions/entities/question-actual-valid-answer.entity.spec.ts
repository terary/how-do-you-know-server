import { QuestionActualValidAnswer } from './question-actual-valid-answer.entity';
import { QuestionActual } from './question-actual.entity';
import { getMetadataArgsStorage } from 'typeorm';

describe('QuestionActualValidAnswer', () => {
  let validAnswer: QuestionActualValidAnswer;

  beforeEach(() => {
    validAnswer = new QuestionActualValidAnswer();
  });

  it('should be defined', () => {
    expect(validAnswer).toBeDefined();
  });

  it('should have all required columns defined in metadata', () => {
    const columns = getMetadataArgsStorage().columns.filter(
      (col) => col.target === QuestionActualValidAnswer,
    );
    const columnNames = columns.map((col) => col.propertyName);
    expect(columnNames).toContain('id');
    expect(columnNames).toContain('question_actual_id');
    expect(columnNames).toContain('text');
    expect(columnNames).toContain('booleanValue');
    expect(columnNames).toContain('created_at');
  });

  it('should initialize with undefined properties', () => {
    expect(validAnswer.id).toBeUndefined();
    expect(validAnswer.question_actual_id).toBeUndefined();
    expect(validAnswer.text).toBeUndefined();
    expect(validAnswer.booleanValue).toBeUndefined();
    expect(validAnswer.created_at).toBeUndefined();
    expect(validAnswer.questionActual).toBeUndefined();
  });

  it('should accept valid values', () => {
    validAnswer.id = '1';
    validAnswer.question_actual_id = '2';
    validAnswer.text = 'Test answer';
    validAnswer.booleanValue = true;
    validAnswer.created_at = new Date();

    expect(validAnswer.id).toBe('1');
    expect(validAnswer.question_actual_id).toBe('2');
    expect(validAnswer.text).toBe('Test answer');
    expect(validAnswer.booleanValue).toBe(true);
    expect(validAnswer.created_at).toBeInstanceOf(Date);
  });

  describe('relationships', () => {
    it('should have ManyToOne relationship with QuestionActual', () => {
      const relations = getMetadataArgsStorage().relations.filter(
        (rel) => rel.target === QuestionActualValidAnswer,
      );
      const questionActualRelation = relations.find(
        (rel) => rel.propertyName === 'questionActual',
      );

      expect(relations.length).toBe(1);
      expect(questionActualRelation).toBeDefined();
      expect(questionActualRelation?.relationType).toBe('many-to-one');

      const typeFunction =
        questionActualRelation?.type as () => typeof QuestionActual;
      expect(typeFunction()).toBe(QuestionActual);

      expect(typeof questionActualRelation?.inverseSideProperty).toBe(
        'function',
      );
    });

    it('should initialize relationships as undefined', () => {
      const validAnswer = new QuestionActualValidAnswer();
      expect(validAnswer.questionActual).toBeUndefined();
    });
  });
});
