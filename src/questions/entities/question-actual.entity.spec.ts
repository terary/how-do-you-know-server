import { QuestionActual } from './question-actual.entity';
import { QuestionTemplate } from './question-template.entity';
import { QuestionActualChoice } from './question-actual-choice.entity';
import { QuestionActualValidAnswer } from './question-actual-valid-answer.entity';
import { getMetadataArgsStorage } from 'typeorm';

describe('QuestionActual', () => {
  let questionActual: QuestionActual;

  beforeEach(() => {
    questionActual = new QuestionActual();
  });

  it('should be defined', () => {
    expect(questionActual).toBeDefined();
  });

  it('should have all required columns defined in metadata', () => {
    const metadata = getMetadataArgsStorage();
    const columns = metadata.columns.filter(
      (column) => column.target === QuestionActual,
    );
    const columnNames = columns.map((column) => column.propertyName);

    expect(columnNames).toContain('id');
    expect(columnNames).toContain('template_id');
    expect(columnNames).toContain('examType');
    expect(columnNames).toContain('sectionPosition');
    expect(columnNames).toContain('userPromptText');
    expect(columnNames).toContain('instructionText');
    expect(columnNames).toContain('created_at');
  });

  it('should have correct property types', () => {
    expect(questionActual.id).toBeUndefined();
    expect(questionActual.template_id).toBeUndefined();
    expect(questionActual.examType).toBeUndefined();
    expect(questionActual.sectionPosition).toBeUndefined();
    expect(questionActual.userPromptText).toBeUndefined();
    expect(questionActual.instructionText).toBeUndefined();
    expect(questionActual.created_at).toBeUndefined();
  });

  it('should accept valid values', () => {
    const now = new Date();
    Object.assign(questionActual, {
      id: 'test-id',
      template_id: 'template-id',
      examType: 'practice',
      sectionPosition: 1,
      userPromptText: 'test prompt',
      instructionText: 'test instruction',
      created_at: now,
    });

    expect(questionActual.id).toBe('test-id');
    expect(questionActual.template_id).toBe('template-id');
    expect(questionActual.examType).toBe('practice');
    expect(questionActual.sectionPosition).toBe(1);
    expect(questionActual.userPromptText).toBe('test prompt');
    expect(questionActual.instructionText).toBe('test instruction');
    expect(questionActual.created_at).toBe(now);
  });

  it('should allow null values for nullable fields', () => {
    Object.assign(questionActual, {
      userPromptText: null,
      instructionText: null,
    });

    expect(questionActual.userPromptText).toBeNull();
    expect(questionActual.instructionText).toBeNull();
  });

  it('should only accept valid exam types', () => {
    const validTypes: Array<'practice' | 'live'> = ['practice', 'live'];

    validTypes.forEach((type) => {
      questionActual.examType = type;
      expect(questionActual.examType).toBe(type);
    });
  });

  describe('relationships', () => {
    let template: QuestionTemplate;
    let choice: QuestionActualChoice;
    let validAnswer: QuestionActualValidAnswer;

    beforeEach(() => {
      template = new QuestionTemplate();
      choice = new QuestionActualChoice();
      validAnswer = new QuestionActualValidAnswer();
    });

    it('should have ManyToOne relationship with QuestionTemplate', () => {
      const metadata = getMetadataArgsStorage();
      const relations = metadata.relations.filter(
        (relation) => relation.target === QuestionActual,
      );
      const templateRelation = relations.find(
        (relation) => relation.propertyName === 'template',
      );
      const joinColumns = metadata.joinColumns.filter(
        (joinColumn) => joinColumn.target === QuestionActual,
      );
      const templateJoinColumn = joinColumns.find(
        (joinColumn) => joinColumn.propertyName === 'template',
      );

      expect(templateRelation).toBeDefined();
      expect(templateRelation?.relationType).toBe('many-to-one');
      expect(templateJoinColumn).toBeDefined();
      expect(templateJoinColumn?.name).toBe('template_id');

      // Test bidirectional relationship
      template.actuals = [questionActual];
      questionActual.template = template;
      expect(questionActual.template).toBeDefined();
      expect(questionActual.template).toBeInstanceOf(QuestionTemplate);
      expect(template.actuals).toContain(questionActual);

      // Test relationship type
      const typeFunction =
        templateRelation?.type as () => typeof QuestionTemplate;
      expect(typeFunction()).toBe(QuestionTemplate);
    });

    it('should have OneToMany relationship with QuestionActualChoice', () => {
      const metadata = getMetadataArgsStorage();
      const relations = metadata.relations.filter(
        (relation) => relation.target === QuestionActual,
      );
      const choicesRelation = relations.find(
        (relation) => relation.propertyName === 'choices',
      );

      expect(choicesRelation).toBeDefined();
      expect(choicesRelation?.relationType).toBe('one-to-many');
      expect(typeof choicesRelation?.inverseSideProperty).toBe('function');

      // Test bidirectional relationship
      choice.questionActual = questionActual;
      questionActual.choices = [choice];
      expect(questionActual.choices).toBeDefined();
      expect(questionActual.choices[0]).toBeInstanceOf(QuestionActualChoice);
      expect(choice.questionActual).toBe(questionActual);

      // Test relationship type
      const typeFunction =
        choicesRelation?.type as () => typeof QuestionActualChoice;
      expect(typeFunction()).toBe(QuestionActualChoice);
    });

    it('should have OneToMany relationship with QuestionActualValidAnswer', () => {
      const metadata = getMetadataArgsStorage();
      const relations = metadata.relations.filter(
        (relation) => relation.target === QuestionActual,
      );
      const validAnswersRelation = relations.find(
        (relation) => relation.propertyName === 'validAnswers',
      );

      expect(validAnswersRelation).toBeDefined();
      expect(validAnswersRelation?.relationType).toBe('one-to-many');
      expect(typeof validAnswersRelation?.inverseSideProperty).toBe('function');

      // Test bidirectional relationship
      validAnswer.questionActual = questionActual;
      questionActual.validAnswers = [validAnswer];
      expect(questionActual.validAnswers).toBeDefined();
      expect(questionActual.validAnswers[0]).toBeInstanceOf(
        QuestionActualValidAnswer,
      );
      expect(validAnswer.questionActual).toBe(questionActual);

      // Test relationship type
      const typeFunction =
        validAnswersRelation?.type as () => typeof QuestionActualValidAnswer;
      expect(typeFunction()).toBe(QuestionActualValidAnswer);
    });

    it('should initialize relationships as undefined', () => {
      const freshQuestion = new QuestionActual();
      expect(freshQuestion.template).toBeUndefined();
      expect(freshQuestion.choices).toBeUndefined();
      expect(freshQuestion.validAnswers).toBeUndefined();
    });
  });
});
