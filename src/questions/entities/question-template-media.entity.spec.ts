import { QuestionTemplateMedia } from './question-template-media.entity';
import { QuestionTemplate } from './question-template.entity';
import { TMediaContentType } from '../types';

describe('QuestionTemplateMedia', () => {
  let media: QuestionTemplateMedia;
  const testDate = new Date();

  beforeEach(() => {
    media = new QuestionTemplateMedia();
    media.id = 'test-uuid';
    media.template_id = 'template-uuid';
    media.mediaContentType = 'image/jpeg';
    media.height = 1080;
    media.width = 1920;
    media.url = 'https://example.com/image.jpg';
    media.created_at = testDate;
  });

  it('should create a question template media instance', () => {
    expect(media).toBeDefined();
    expect(media instanceof QuestionTemplateMedia).toBeTruthy();
  });

  it('should have all required properties', () => {
    expect(media).toHaveProperty('id', 'test-uuid');
    expect(media).toHaveProperty('template_id', 'template-uuid');
    expect(media).toHaveProperty('mediaContentType', 'image/jpeg');
    expect(media).toHaveProperty('height', 1080);
    expect(media).toHaveProperty('width', 1920);
    expect(media).toHaveProperty('url', 'https://example.com/image.jpg');
    expect(media).toHaveProperty('created_at', testDate);
  });

  it('should allow null for optional properties', () => {
    media.specialInstructionText = null;
    media.duration = null;
    media.fileSize = null;
    media.thumbnailUrl = null;

    expect(media.specialInstructionText).toBeNull();
    expect(media.duration).toBeNull();
    expect(media.fileSize).toBeNull();
    expect(media.thumbnailUrl).toBeNull();
  });

  it('should accept non-null values for optional properties', () => {
    media.specialInstructionText = 'Watch carefully';
    media.duration = 120;
    media.fileSize = 1024;
    media.thumbnailUrl = 'https://example.com/thumb.jpg';

    expect(media.specialInstructionText).toBe('Watch carefully');
    expect(media.duration).toBe(120);
    expect(media.fileSize).toBe(1024);
    expect(media.thumbnailUrl).toBe('https://example.com/thumb.jpg');
  });

  describe('mediaContentType validation', () => {
    it('should accept valid image content types', () => {
      const validImageTypes: TMediaContentType[] = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'image/*',
      ];

      validImageTypes.forEach((type) => {
        media.mediaContentType = type;
        expect(media.mediaContentType).toBe(type);
      });
    });

    it('should accept valid audio content types', () => {
      const validAudioTypes: TMediaContentType[] = [
        'audio/mpeg',
        'audio/wav',
        'audio/ogg',
        'audio/aac',
        'audio/webm',
        'audio/*',
      ];

      validAudioTypes.forEach((type) => {
        media.mediaContentType = type;
        expect(media.mediaContentType).toBe(type);
      });
    });

    it('should accept valid video content types', () => {
      const validVideoTypes: TMediaContentType[] = [
        'video/mp4',
        'video/webm',
        'video/ogg',
        'video/avi',
        'video/quicktime',
        'video/*',
      ];

      validVideoTypes.forEach((type) => {
        media.mediaContentType = type;
        expect(media.mediaContentType).toBe(type);
      });
    });

    it('should accept application/octet-stream', () => {
      media.mediaContentType = 'application/octet-stream';
      expect(media.mediaContentType).toBe('application/octet-stream');
    });
  });

  it('should have template relationship', () => {
    const template = new QuestionTemplate();
    template.id = 'template-uuid';
    template.userPromptType = 'multimedia';
    template.userResponseType = 'multiple-choice-4';
    template.exclusivityType = 'exam-practice-both';
    template.media = [media];

    media.template = template;

    expect(media.template).toBeDefined();
    expect(media.template instanceof QuestionTemplate).toBeTruthy();
    expect(media.template_id).toBe(template.id);
    expect(media.template.media).toContain(media);
  });
});
