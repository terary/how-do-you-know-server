import { QuestionActualChoice } from './question-actual-choice.entity';
import { QuestionActual } from './question-actual.entity';
import { getMetadataArgsStorage } from 'typeorm';

describe('QuestionActualChoice', () => {
  let questionActualChoice: QuestionActualChoice;

  beforeEach(() => {
    questionActualChoice = new QuestionActualChoice();
  });

  it('should be defined', () => {
    expect(questionActualChoice).toBeDefined();
  });

  it('should have all required columns defined in metadata', () => {
    const metadata = getMetadataArgsStorage();
    const columns = metadata.columns.filter(
      (column) => column.target === QuestionActualChoice,
    );
    const columnNames = columns.map((column) => column.propertyName);

    expect(columnNames).toContain('id');
    expect(columnNames).toContain('question_actual_id');
    expect(columnNames).toContain('text');
    expect(columnNames).toContain('isCorrect');
    expect(columnNames).toContain('position');
    expect(columnNames).toContain('created_at');
  });

  it('should initialize with undefined properties', () => {
    expect(questionActualChoice.id).toBeUndefined();
    expect(questionActualChoice.question_actual_id).toBeUndefined();
    expect(questionActualChoice.text).toBeUndefined();
    expect(questionActualChoice.isCorrect).toBeUndefined();
    expect(questionActualChoice.position).toBeUndefined();
    expect(questionActualChoice.created_at).toBeUndefined();
    expect(questionActualChoice.questionActual).toBeUndefined();
  });

  it('should accept valid values', () => {
    const now = new Date();
    Object.assign(questionActualChoice, {
      id: 'test-id',
      question_actual_id: 'question-actual-id',
      text: 'Choice text',
      isCorrect: true,
      position: 1,
      created_at: now,
    });

    expect(questionActualChoice.id).toBe('test-id');
    expect(questionActualChoice.question_actual_id).toBe('question-actual-id');
    expect(questionActualChoice.text).toBe('Choice text');
    expect(questionActualChoice.isCorrect).toBe(true);
    expect(questionActualChoice.position).toBe(1);
    expect(questionActualChoice.created_at).toBe(now);
  });

  describe('relationships', () => {
    it('should have ManyToOne relationship with QuestionActual', () => {
      const metadata = getMetadataArgsStorage();
      const relations = metadata.relations.filter(
        (relation) => relation.target === QuestionActualChoice,
      );
      const questionActualRelation = relations.find(
        (relation) => relation.propertyName === 'questionActual',
      );
      const joinColumns = metadata.joinColumns.filter(
        (joinColumn) => joinColumn.target === QuestionActualChoice,
      );
      const questionActualJoinColumn = joinColumns.find(
        (joinColumn) => joinColumn.propertyName === 'questionActual',
      );

      expect(questionActualRelation).toBeDefined();
      expect(questionActualRelation?.relationType).toBe('many-to-one');
      expect(questionActualJoinColumn).toBeDefined();
      expect(questionActualJoinColumn?.name).toBe('question_actual_id');

      // Test bidirectional relationship
      const questionActual = new QuestionActual();
      questionActual.choices = [questionActualChoice];
      questionActualChoice.questionActual = questionActual;
      expect(questionActualChoice.questionActual).toBeDefined();
      expect(questionActualChoice.questionActual).toBeInstanceOf(
        QuestionActual,
      );
      expect(questionActual.choices).toContain(questionActualChoice);

      // Test relationship type
      const typeFunction =
        questionActualRelation?.type as () => typeof QuestionActual;
      expect(typeFunction()).toBe(QuestionActual);
    });

    it('should initialize relationships as undefined', () => {
      const freshChoice = new QuestionActualChoice();
      expect(freshChoice.questionActual).toBeUndefined();
    });
  });
});
