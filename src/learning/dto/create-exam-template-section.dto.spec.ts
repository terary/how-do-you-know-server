import { validate } from 'class-validator';
import { CreateExamTemplateSectionDto } from './create-exam-template-section.dto';

describe('CreateExamTemplateSectionDto', () => {
  let dto: CreateExamTemplateSectionDto;

  beforeEach(() => {
    dto = new CreateExamTemplateSectionDto();
    dto.title = 'Test Section';
    dto.instructions = 'Test instructions';
    dto.position = 1;
    dto.timeLimitSeconds = 3600;
  });

  it('should validate a valid DTO', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('title validation', () => {
    it('should require title', async () => {
      dto.title = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });

    it('should validate string type', async () => {
      (dto as any).title = 123;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });

    it('should not allow empty string', async () => {
      dto.title = '';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });
  });

  describe('instructions validation', () => {
    it('should require instructions', async () => {
      dto.instructions = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('instructions');
    });

    it('should validate string type', async () => {
      (dto as any).instructions = 123;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('instructions');
    });

    it('should not allow empty string', async () => {
      dto.instructions = '';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('instructions');
    });
  });

  describe('position validation', () => {
    it('should require position', async () => {
      dto.position = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('position');
    });

    it('should validate integer type', async () => {
      (dto as any).position = 'not-a-number';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('position');
    });

    it('should validate minimum value', async () => {
      dto.position = 0;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('position');
    });

    it('should not allow floating point numbers', async () => {
      dto.position = 1.5;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('position');
    });
  });

  describe('timeLimitSeconds validation', () => {
    it('should require timeLimitSeconds', async () => {
      dto.timeLimitSeconds = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('timeLimitSeconds');
    });

    it('should validate integer type', async () => {
      (dto as any).timeLimitSeconds = 'not-a-number';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('timeLimitSeconds');
    });

    it('should validate minimum value', async () => {
      dto.timeLimitSeconds = 0;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('timeLimitSeconds');
    });

    it('should not allow floating point numbers', async () => {
      dto.timeLimitSeconds = 3600.5;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('timeLimitSeconds');
    });
  });
});
