import { validate } from 'class-validator';
import { GenerateActualDto } from './generate-actual.dto';

describe('GenerateActualDto', () => {
  let dto: GenerateActualDto;

  beforeEach(() => {
    dto = new GenerateActualDto();
  });

  it('should fail validation when required fields are missing', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === 'examType')).toBeTruthy();
    expect(errors.some((e) => e.property === 'sectionPosition')).toBeTruthy();
  });

  it('should pass validation with valid data', async () => {
    dto.examType = 'practice';
    dto.sectionPosition = 1;
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('examType', () => {
    it('should fail with invalid exam type', async () => {
      (dto as any).examType = 'invalid';
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'examType')).toBeTruthy();
    });

    it('should pass with practice exam type', async () => {
      dto.examType = 'practice';
      dto.sectionPosition = 1;
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'examType')).toBeFalsy();
    });

    it('should pass with live exam type', async () => {
      dto.examType = 'live';
      dto.sectionPosition = 1;
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'examType')).toBeFalsy();
    });
  });

  describe('sectionPosition', () => {
    it('should fail with non-numeric position', async () => {
      dto.examType = 'practice';
      (dto as any).sectionPosition = 'invalid';
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'sectionPosition')).toBeTruthy();
    });

    it('should pass with numeric position', async () => {
      dto.examType = 'practice';
      dto.sectionPosition = 1;
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'sectionPosition')).toBeFalsy();
    });
  });
});
