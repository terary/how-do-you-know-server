import { validate } from 'class-validator';
import { SearchQuestionsDto } from './search-questions.dto';
import { QuestionDifficulty } from '../entities/question-template.entity';

describe('SearchQuestionsDto', () => {
  let dto: SearchQuestionsDto;

  beforeEach(() => {
    dto = new SearchQuestionsDto();
  });

  it('should pass validation with empty object', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('searchTerm', () => {
    it('should pass with valid string', async () => {
      dto.searchTerm = 'test search';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail with non-string value', async () => {
      (dto as any).searchTerm = 123;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('difficulty', () => {
    it('should pass with valid difficulty enum', async () => {
      dto.difficulty = QuestionDifficulty.EASY;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail with invalid difficulty value', async () => {
      (dto as any).difficulty = 'INVALID_DIFFICULTY';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isEnum');
    });
  });

  describe('topics', () => {
    it('should pass with valid string array', async () => {
      dto.topics = ['topic1', 'topic2'];
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail with non-array value', async () => {
      (dto as any).topics = 'not an array';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isArray');
    });
  });

  describe('userPromptType', () => {
    it('should pass with valid prompt type', async () => {
      dto.userPromptType = 'text';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass with multimedia type', async () => {
      dto.userPromptType = 'multimedia';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail with invalid prompt type', async () => {
      (dto as any).userPromptType = 'invalid';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isEnum');
    });
  });

  describe('userResponseType', () => {
    it('should pass with free-text-255', async () => {
      dto.userResponseType = 'free-text-255';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass with multiple-choice-4', async () => {
      dto.userResponseType = 'multiple-choice-4';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass with true-false', async () => {
      dto.userResponseType = 'true-false';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail with invalid response type', async () => {
      (dto as any).userResponseType = 'invalid';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isEnum');
    });
  });

  describe('courseId', () => {
    it('should pass with valid string', async () => {
      dto.courseId = 'course123';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail with non-string value', async () => {
      (dto as any).courseId = 123;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });
});
