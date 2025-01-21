import { validate } from 'class-validator';
import { PreviewTemplateDto, PreviewFormat } from './preview-template.dto';

describe('PreviewTemplateDto', () => {
  let dto: PreviewTemplateDto;

  beforeEach(() => {
    dto = new PreviewTemplateDto();
  });

  it('should validate a valid DTO', async () => {
    dto.format = PreviewFormat.HTML;
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('format validation', () => {
    it('should require format', async () => {
      dto.format = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('format');
    });

    it('should validate enum values', async () => {
      (dto as any).format = 'INVALID_FORMAT';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('format');
    });

    it('should accept all valid enum values', async () => {
      for (const format of Object.values(PreviewFormat)) {
        dto.format = format;
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      }
    });

    it('should validate specific format values', async () => {
      // Test HTML format
      dto.format = PreviewFormat.HTML;
      let errors = await validate(dto);
      expect(errors.length).toBe(0);

      // Test PDF format
      dto.format = PreviewFormat.PDF;
      errors = await validate(dto);
      expect(errors.length).toBe(0);

      // Test JSON format
      dto.format = PreviewFormat.JSON;
      errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
});
