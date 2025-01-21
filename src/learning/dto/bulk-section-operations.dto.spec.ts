import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import {
  QuestionPositionDto,
  BulkAddQuestionsDto,
  BulkRemoveQuestionsDto,
  ReorderQuestionsDto,
} from './bulk-section-operations.dto';

const validUUID = '550e8400-e29b-41d4-a716-446655440000';

describe('Bulk Section Operations DTOs', () => {
  describe('QuestionPositionDto', () => {
    let dto: QuestionPositionDto;

    beforeEach(() => {
      dto = plainToInstance(QuestionPositionDto, {
        questionId: validUUID,
        position: 1,
      });
    });

    it('should validate a valid DTO', async () => {
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      console.log(
        'QuestionPositionDto validation errors:',
        JSON.stringify(errors, null, 2),
      );
      const validationErrors = errors.filter(
        (e) => e.property === 'questionId' || e.property === 'position',
      );
      expect(validationErrors.length).toBe(0);
    });

    it('should require questionId', async () => {
      dto = plainToInstance(QuestionPositionDto, { position: 1 });
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      const questionIdErrors = errors.filter(
        (e) => e.property === 'questionId',
      );
      expect(questionIdErrors.length).toBe(1);
    });

    it('should require position', async () => {
      dto = plainToInstance(QuestionPositionDto, { questionId: validUUID });
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      const positionErrors = errors.filter((e) => e.property === 'position');
      expect(positionErrors.length).toBe(1);
    });

    it('should validate questionId as UUID', async () => {
      dto = plainToInstance(QuestionPositionDto, {
        questionId: 'not-a-uuid',
        position: 1,
      });
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      const questionIdErrors = errors.filter(
        (e) => e.property === 'questionId',
      );
      expect(questionIdErrors.length).toBe(1);
    });

    it('should validate position as number', async () => {
      dto = plainToInstance(QuestionPositionDto, {
        questionId: validUUID,
        position: 'not-a-number',
      });
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      const positionErrors = errors.filter((e) => e.property === 'position');
      expect(positionErrors.length).toBe(1);
    });
  });

  describe('BulkAddQuestionsDto', () => {
    let dto: BulkAddQuestionsDto;

    beforeEach(() => {
      dto = plainToInstance(BulkAddQuestionsDto, {
        sectionId: validUUID,
        questionIds: [validUUID],
      });
    });

    it('should validate a valid DTO', async () => {
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      console.log(
        'BulkAddQuestionsDto validation errors:',
        JSON.stringify(errors, null, 2),
      );
      const validationErrors = errors.filter(
        (e) => e.property === 'sectionId' || e.property === 'questionIds',
      );
      expect(validationErrors.length).toBe(0);
    });

    it('should require sectionId', async () => {
      dto = plainToInstance(BulkAddQuestionsDto, {
        questionIds: [validUUID],
      });
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      const sectionIdErrors = errors.filter((e) => e.property === 'sectionId');
      expect(sectionIdErrors.length).toBe(1);
    });

    it('should require questionIds', async () => {
      dto = plainToInstance(BulkAddQuestionsDto, {
        sectionId: validUUID,
      });
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      const questionIdsErrors = errors.filter(
        (e) => e.property === 'questionIds',
      );
      expect(questionIdsErrors.length).toBe(1);
    });

    it('should validate sectionId as UUID', async () => {
      dto = plainToInstance(BulkAddQuestionsDto, {
        sectionId: 'not-a-uuid',
        questionIds: [validUUID],
      });
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      const sectionIdErrors = errors.filter((e) => e.property === 'sectionId');
      expect(sectionIdErrors.length).toBe(1);
    });

    it('should validate questionIds as array of UUIDs', async () => {
      dto = plainToInstance(BulkAddQuestionsDto, {
        sectionId: validUUID,
        questionIds: ['not-a-uuid'],
      });
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      const questionIdsErrors = errors.filter(
        (e) => e.property === 'questionIds',
      );
      expect(questionIdsErrors.length).toBe(1);
    });

    it('should require at least one questionId', async () => {
      dto = plainToInstance(BulkAddQuestionsDto, {
        sectionId: validUUID,
        questionIds: [],
      });
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      const questionIdsErrors = errors.filter(
        (e) => e.property === 'questionIds',
      );
      expect(questionIdsErrors.length).toBe(1);
    });
  });

  describe('BulkRemoveQuestionsDto', () => {
    let dto: BulkRemoveQuestionsDto;

    beforeEach(() => {
      dto = plainToInstance(BulkRemoveQuestionsDto, {
        sectionId: validUUID,
        questionIds: [validUUID],
      });
    });

    it('should validate a valid DTO', async () => {
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      console.log(
        'BulkRemoveQuestionsDto validation errors:',
        JSON.stringify(errors, null, 2),
      );
      const validationErrors = errors.filter(
        (e) => e.property === 'sectionId' || e.property === 'questionIds',
      );
      expect(validationErrors.length).toBe(0);
    });

    it('should require sectionId', async () => {
      dto = plainToInstance(BulkRemoveQuestionsDto, {
        questionIds: [validUUID],
      });
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      const sectionIdErrors = errors.filter((e) => e.property === 'sectionId');
      expect(sectionIdErrors.length).toBe(1);
    });

    it('should require questionIds', async () => {
      dto = plainToInstance(BulkRemoveQuestionsDto, {
        sectionId: validUUID,
      });
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      const questionIdsErrors = errors.filter(
        (e) => e.property === 'questionIds',
      );
      expect(questionIdsErrors.length).toBe(1);
    });

    it('should validate sectionId as UUID', async () => {
      dto = plainToInstance(BulkRemoveQuestionsDto, {
        sectionId: 'not-a-uuid',
        questionIds: [validUUID],
      });
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      const sectionIdErrors = errors.filter((e) => e.property === 'sectionId');
      expect(sectionIdErrors.length).toBe(1);
    });

    it('should validate questionIds as array of UUIDs', async () => {
      dto = plainToInstance(BulkRemoveQuestionsDto, {
        sectionId: validUUID,
        questionIds: ['not-a-uuid'],
      });
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      const questionIdsErrors = errors.filter(
        (e) => e.property === 'questionIds',
      );
      expect(questionIdsErrors.length).toBe(1);
    });

    it('should require at least one questionId', async () => {
      dto = plainToInstance(BulkRemoveQuestionsDto, {
        sectionId: validUUID,
        questionIds: [],
      });
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      const questionIdsErrors = errors.filter(
        (e) => e.property === 'questionIds',
      );
      expect(questionIdsErrors.length).toBe(1);
    });
  });

  describe('ReorderQuestionsDto', () => {
    let dto: ReorderQuestionsDto;

    beforeEach(() => {
      dto = plainToInstance(ReorderQuestionsDto, {
        sectionId: validUUID,
        questionPositions: [
          {
            questionId: validUUID,
            position: 1,
          },
        ],
      });
    });

    it('should validate a valid DTO', async () => {
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      console.log(
        'ReorderQuestionsDto validation errors:',
        JSON.stringify(errors, null, 2),
      );
      const validationErrors = errors.filter(
        (e) => e.property === 'sectionId' || e.property === 'questionPositions',
      );
      expect(validationErrors.length).toBe(0);
    });

    it('should require sectionId', async () => {
      dto = plainToInstance(ReorderQuestionsDto, {
        questionPositions: [
          {
            questionId: validUUID,
            position: 1,
          },
        ],
      });
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      const sectionIdErrors = errors.filter((e) => e.property === 'sectionId');
      expect(sectionIdErrors.length).toBe(1);
    });

    it('should require questionPositions', async () => {
      dto = plainToInstance(ReorderQuestionsDto, {
        sectionId: validUUID,
      });
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      const questionPositionsErrors = errors.filter(
        (e) => e.property === 'questionPositions',
      );
      expect(questionPositionsErrors.length).toBe(1);
    });

    it('should validate sectionId as UUID', async () => {
      dto = plainToInstance(ReorderQuestionsDto, {
        sectionId: 'not-a-uuid',
        questionPositions: [
          {
            questionId: validUUID,
            position: 1,
          },
        ],
      });
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      const sectionIdErrors = errors.filter((e) => e.property === 'sectionId');
      expect(sectionIdErrors.length).toBe(1);
    });

    it('should validate nested QuestionPositionDto objects', async () => {
      dto = plainToInstance(ReorderQuestionsDto, {
        sectionId: validUUID,
        questionPositions: [
          {
            questionId: 'not-a-uuid',
            position: 1,
          },
        ],
      });
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      const questionPositionsErrors = errors.filter(
        (e) => e.property === 'questionPositions',
      );
      expect(questionPositionsErrors.length).toBe(1);
    });

    it('should require at least one questionPosition', async () => {
      dto = plainToInstance(ReorderQuestionsDto, {
        sectionId: validUUID,
        questionPositions: [],
      });
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      const questionPositionsErrors = errors.filter(
        (e) => e.property === 'questionPositions',
      );
      expect(questionPositionsErrors.length).toBe(1);
    });
  });
});
