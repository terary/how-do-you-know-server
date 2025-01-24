import { validate } from 'class-validator';
import { UpdateExamTemplateSectionDto } from './update-exam-template-section.dto';

describe('UpdateExamTemplateSectionDto', () => {
  let dto: UpdateExamTemplateSectionDto;

  beforeEach(() => {
    dto = new UpdateExamTemplateSectionDto();
  });

  it('should validate an empty DTO', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate a fully populated DTO', async () => {
    dto.title = 'Test Section';
    dto.instructions = 'Test instructions';
    dto.position = 1;
    dto.timeLimitSeconds = 3600;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('title validation', () => {
    it('should validate string type when provided', async () => {
      dto.title = 'Valid Title';
      let errors = await validate(dto);
      expect(errors.length).toBe(0);

      (dto as any).title = 123;
      errors = await validate(dto);
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
    it('should validate string type when provided', async () => {
      dto.instructions = 'Valid Instructions';
      let errors = await validate(dto);
      expect(errors.length).toBe(0);

      (dto as any).instructions = 123;
      errors = await validate(dto);
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
    it('should validate integer type when provided', async () => {
      dto.position = 1;
      let errors = await validate(dto);
      expect(errors.length).toBe(0);

      (dto as any).position = 'not-a-number';
      errors = await validate(dto);
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
    it('should validate integer type when provided', async () => {
      dto.timeLimitSeconds = 3600;
      let errors = await validate(dto);
      expect(errors.length).toBe(0);

      (dto as any).timeLimitSeconds = 'not-a-number';
      errors = await validate(dto);
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
