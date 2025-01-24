import { validate } from 'class-validator';
import { ValidAnswerDto } from './valid-answer.dto';

describe('ValidAnswerDto', () => {
  let dto: ValidAnswerDto;

  beforeEach(() => {
    dto = new ValidAnswerDto();
  });

  it('should pass validation with empty object (all fields optional)', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('text', () => {
    it('should pass with valid string', async () => {
      dto.text = 'Sample answer';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail with non-string value', async () => {
      (dto as any).text = 123;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('text');
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('booleanValue', () => {
    it('should pass with boolean true', async () => {
      dto.booleanValue = true;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass with boolean false', async () => {
      dto.booleanValue = false;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('fodderPoolId', () => {
    it('should pass with valid string', async () => {
      dto.fodderPoolId = 'pool-123';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail with non-string value', async () => {
      (dto as any).fodderPoolId = 123;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('fodderPoolId');
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });

  it('should pass with multiple valid fields', async () => {
    dto.text = 'Sample answer';
    dto.booleanValue = true;
    dto.fodderPoolId = 'pool-123';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
