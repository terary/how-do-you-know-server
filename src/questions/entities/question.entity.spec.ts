import { Question } from './question.entity';
import { getMetadataArgsStorage } from 'typeorm';

describe('Question', () => {
  let question: Question;

  beforeEach(() => {
    question = new Question();
  });

  it('should be defined', () => {
    expect(question).toBeDefined();
  });

  it('should have all required columns defined in metadata', () => {
    const metadata = getMetadataArgsStorage();
    const columns = metadata.columns.filter((col) => col.target === Question);
    const columnNames = columns.map((col) => col.propertyName);

    expect(columnNames).toContain('title');
    expect(columnNames).toContain('content');
    expect(columnNames).toContain('tags');
    expect(columnNames).toContain('correctAnswer');
    expect(columnNames).toContain('options');
    expect(columnNames).toContain('type');
    expect(columnNames).toContain('isActive');
    expect(columnNames).toContain('createdAt');
    expect(columnNames).toContain('updatedAt');
  });

  it('should have correct property types', () => {
    expect(typeof question.id).toBe('undefined');
    expect(typeof question.title).toBe('undefined');
    expect(typeof question.content).toBe('undefined');
    expect(Array.isArray(question.tags)).toBe(true);
    expect(typeof question.correctAnswer).toBe('undefined');
    expect(Array.isArray(question.options)).toBe(true);
    expect(typeof question.type).toBe('undefined');
    expect(typeof question.isActive).toBe('undefined');
    expect(question.createdAt).toBeUndefined();
    expect(question.updatedAt).toBeUndefined();
  });

  it('should accept valid values', () => {
    const now = new Date();
    const validQuestion = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Test Question',
      content: 'What is the answer?',
      tags: ['math', 'algebra'],
      correctAnswer: '42',
      options: ['41', '42', '43'],
      type: 'multiple-choice' as const,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    Object.assign(question, validQuestion);

    expect(question.id).toBe(validQuestion.id);
    expect(question.title).toBe(validQuestion.title);
    expect(question.content).toBe(validQuestion.content);
    expect(question.tags).toEqual(validQuestion.tags);
    expect(question.correctAnswer).toBe(validQuestion.correctAnswer);
    expect(question.options).toEqual(validQuestion.options);
    expect(question.type).toBe(validQuestion.type);
    expect(question.isActive).toBe(validQuestion.isActive);
    expect(question.createdAt).toBe(validQuestion.createdAt);
    expect(question.updatedAt).toBe(validQuestion.updatedAt);
  });
});
