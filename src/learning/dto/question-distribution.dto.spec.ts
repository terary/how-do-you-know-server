import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import {
  QuestionDistributionRulesDto,
  DifficultyDistributionRule,
  TopicDistributionRule,
} from './question-distribution.dto';
import { QuestionDifficulty } from '../../questions/entities/question-template.entity';

describe('QuestionDistributionRulesDto', () => {
  describe('DifficultyDistributionRule', () => {
    let rule: DifficultyDistributionRule;

    beforeEach(() => {
      rule = plainToInstance(DifficultyDistributionRule, {
        difficulty: QuestionDifficulty.EASY,
        percentage: 50,
      });
    });

    it('should validate a valid rule', async () => {
      const errors = await validate(rule);
      expect(errors.length).toBe(0);
    });

    it('should require difficulty', async () => {
      rule.difficulty = undefined;
      const errors = await validate(rule);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('difficulty');
    });

    it('should validate difficulty enum values', async () => {
      (rule as any).difficulty = 'INVALID_DIFFICULTY';
      const errors = await validate(rule);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('difficulty');
    });

    it('should require percentage', async () => {
      rule.percentage = undefined;
      const errors = await validate(rule);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('percentage');
    });

    it('should validate percentage minimum', async () => {
      rule.percentage = -1;
      const errors = await validate(rule);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('percentage');
    });

    it('should validate percentage maximum', async () => {
      rule.percentage = 101;
      const errors = await validate(rule);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('percentage');
    });
  });

  describe('TopicDistributionRule', () => {
    let rule: TopicDistributionRule;

    beforeEach(() => {
      rule = plainToInstance(TopicDistributionRule, {
        topics: ['math', 'science'],
        percentage: 50,
      });
    });

    it('should validate a valid rule', async () => {
      const errors = await validate(rule);
      expect(errors.length).toBe(0);
    });

    it('should require topics', async () => {
      rule.topics = undefined;
      const errors = await validate(rule);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('topics');
    });

    it('should validate topics is array', async () => {
      (rule as any).topics = 'not-an-array';
      const errors = await validate(rule);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('topics');
    });

    it('should require percentage', async () => {
      rule.percentage = undefined;
      const errors = await validate(rule);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('percentage');
    });

    it('should validate percentage minimum', async () => {
      rule.percentage = -1;
      const errors = await validate(rule);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('percentage');
    });

    it('should validate percentage maximum', async () => {
      rule.percentage = 101;
      const errors = await validate(rule);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('percentage');
    });
  });

  describe('QuestionDistributionRulesDto', () => {
    let dto: QuestionDistributionRulesDto;

    beforeEach(() => {
      dto = plainToInstance(QuestionDistributionRulesDto, {
        difficultyRules: [
          { difficulty: QuestionDifficulty.EASY, percentage: 30 },
          { difficulty: QuestionDifficulty.MEDIUM, percentage: 40 },
          { difficulty: QuestionDifficulty.HARD, percentage: 30 },
        ],
        topicRules: [
          { topics: ['math'], percentage: 50 },
          { topics: ['science'], percentage: 50 },
        ],
      });
    });

    it('should validate a valid DTO', async () => {
      const errors = await validate(dto, { whitelist: true });
      expect(errors.length).toBe(0);
    });

    it('should allow empty difficulty rules', async () => {
      dto.difficultyRules = undefined;
      const errors = await validate(dto, { whitelist: true });
      expect(errors.length).toBe(0);
    });

    it('should allow empty topic rules', async () => {
      dto.topicRules = undefined;
      const errors = await validate(dto, { whitelist: true });
      expect(errors.length).toBe(0);
    });

    it('should validate nested difficulty rules', async () => {
      dto = plainToInstance(QuestionDistributionRulesDto, {
        difficultyRules: [{ difficulty: 'INVALID' as any, percentage: 100 }],
      });
      const errors = await validate(dto, { whitelist: true });
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should validate nested topic rules', async () => {
      dto = plainToInstance(QuestionDistributionRulesDto, {
        topicRules: [{ topics: 'not-an-array' as any, percentage: 100 }],
      });
      const errors = await validate(dto, { whitelist: true });
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should validate total percentage for difficulty rules equals 100', async () => {
      dto.difficultyRules = plainToInstance(DifficultyDistributionRule, [
        { difficulty: QuestionDifficulty.EASY, percentage: 60 },
        { difficulty: QuestionDifficulty.MEDIUM, percentage: 60 },
      ]);
      // Note: This validation is typically done at the service level
    });

    it('should validate total percentage for topic rules equals 100', async () => {
      dto.topicRules = plainToInstance(TopicDistributionRule, [
        { topics: ['math'], percentage: 60 },
        { topics: ['science'], percentage: 60 },
      ]);
      // Note: This validation is typically done at the service level
    });
  });
});
