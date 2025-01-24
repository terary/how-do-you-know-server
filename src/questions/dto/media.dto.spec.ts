import { validate } from 'class-validator';
import { MediaDto } from './media.dto';

describe('MediaDto', () => {
  let dto: MediaDto;

  beforeEach(() => {
    dto = new MediaDto();
  });

  it('should fail validation when required fields are missing', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === 'mediaContentType')).toBeTruthy();
    expect(errors.some((e) => e.property === 'height')).toBeTruthy();
    expect(errors.some((e) => e.property === 'width')).toBeTruthy();
    expect(errors.some((e) => e.property === 'url')).toBeTruthy();
  });

  it('should pass validation with valid data', async () => {
    dto.mediaContentType = 'video/mp4';
    dto.height = 720;
    dto.width = 1280;
    dto.url = 'https://example.com/video.mp4';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('mediaContentType', () => {
    it('should fail with invalid content type', async () => {
      dto.mediaContentType = 'invalid/type' as any;
      const errors = await validate(dto);
      expect(
        errors.some((e) => e.property === 'mediaContentType'),
      ).toBeTruthy();
    });

    it('should pass with valid content types', async () => {
      const validTypes = [
        'video/mp4',
        'image/jpeg',
        'audio/mpeg',
        'video/*',
        'image/*',
        'audio/*',
      ] as const;

      for (const type of validTypes) {
        dto.mediaContentType = type;
        const errors = await validate(dto);
        expect(
          errors.some((e) => e.property === 'mediaContentType'),
        ).toBeFalsy();
      }
    });
  });

  describe('dimensions', () => {
    it('should fail with non-numeric dimensions', async () => {
      (dto as any).height = 'invalid';
      (dto as any).width = 'invalid';
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'height')).toBeTruthy();
      expect(errors.some((e) => e.property === 'width')).toBeTruthy();
    });

    it('should pass with valid numeric dimensions', async () => {
      dto.height = 720;
      dto.width = 1280;
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'height')).toBeFalsy();
      expect(errors.some((e) => e.property === 'width')).toBeFalsy();
    });
  });

  describe('url', () => {
    it('should fail with invalid URL', async () => {
      dto.url = 'not-a-url';
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'url')).toBeTruthy();
    });

    it('should pass with valid URL', async () => {
      dto.url = 'https://example.com/video.mp4';
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'url')).toBeFalsy();
    });
  });

  describe('optional fields', () => {
    beforeEach(() => {
      // Set required fields
      dto.mediaContentType = 'video/mp4';
      dto.height = 720;
      dto.width = 1280;
      dto.url = 'https://example.com/video.mp4';
    });

    it('should pass with valid specialInstructionText', async () => {
      dto.specialInstructionText = 'Special instructions';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass with valid duration', async () => {
      dto.duration = 120;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass with valid fileSize', async () => {
      dto.fileSize = 1024000;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass with valid thumbnailUrl', async () => {
      dto.thumbnailUrl = 'https://example.com/thumbnail.jpg';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail with invalid optional fields', async () => {
      dto.duration = 'invalid' as any;
      dto.fileSize = 'invalid' as any;
      dto.thumbnailUrl = 'not-a-url';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'duration')).toBeTruthy();
      expect(errors.some((e) => e.property === 'fileSize')).toBeTruthy();
      expect(errors.some((e) => e.property === 'thumbnailUrl')).toBeTruthy();
    });
  });
});
