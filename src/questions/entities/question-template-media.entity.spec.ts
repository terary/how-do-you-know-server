import { QuestionTemplateMedia } from './question-template-media.entity';
import { QuestionTemplate } from './question-template.entity';
import { getMetadataArgsStorage } from 'typeorm';

describe('QuestionTemplateMedia', () => {
  let media: QuestionTemplateMedia;
  let template: QuestionTemplate;

  beforeEach(() => {
    media = new QuestionTemplateMedia();
    template = new QuestionTemplate();
  });

  it('should be defined', () => {
    expect(media).toBeDefined();
  });

  it('should have all required columns defined in metadata', () => {
    const metadata = getMetadataArgsStorage();
    const columns = metadata.columns.filter(
      (column) => column.target === QuestionTemplateMedia,
    );
    const columnNames = columns.map((column) => column.propertyName);

    expect(columnNames).toContain('id');
    expect(columnNames).toContain('template_id');
    expect(columnNames).toContain('mediaContentType');
    expect(columnNames).toContain('height');
    expect(columnNames).toContain('width');
    expect(columnNames).toContain('url');
    expect(columnNames).toContain('specialInstructionText');
    expect(columnNames).toContain('duration');
    expect(columnNames).toContain('fileSize');
    expect(columnNames).toContain('thumbnailUrl');
    expect(columnNames).toContain('created_at');
  });

  it('should have correct property types', () => {
    expect(media.id).toBeUndefined();
    expect(media.template_id).toBeUndefined();
    expect(media.mediaContentType).toBeUndefined();
    expect(media.height).toBeUndefined();
    expect(media.width).toBeUndefined();
    expect(media.url).toBeUndefined();
    expect(media.specialInstructionText).toBeUndefined();
    expect(media.duration).toBeUndefined();
    expect(media.fileSize).toBeUndefined();
    expect(media.thumbnailUrl).toBeUndefined();
    expect(media.created_at).toBeUndefined();
  });

  it('should accept valid values', () => {
    const now = new Date();
    Object.assign(media, {
      id: 'test-id',
      template_id: 'template-id',
      mediaContentType: 'image/jpeg',
      height: 100,
      width: 200,
      url: 'https://example.com/image.jpg',
      specialInstructionText: 'test instruction',
      duration: 60,
      fileSize: 1024,
      thumbnailUrl: 'https://example.com/thumb.jpg',
      created_at: now,
    });

    expect(media.id).toBe('test-id');
    expect(media.template_id).toBe('template-id');
    expect(media.mediaContentType).toBe('image/jpeg');
    expect(media.height).toBe(100);
    expect(media.width).toBe(200);
    expect(media.url).toBe('https://example.com/image.jpg');
    expect(media.specialInstructionText).toBe('test instruction');
    expect(media.duration).toBe(60);
    expect(media.fileSize).toBe(1024);
    expect(media.thumbnailUrl).toBe('https://example.com/thumb.jpg');
    expect(media.created_at).toBe(now);
  });

  it('should allow null values for nullable fields', () => {
    Object.assign(media, {
      specialInstructionText: null,
      duration: null,
      fileSize: null,
      thumbnailUrl: null,
    });

    expect(media.specialInstructionText).toBeNull();
    expect(media.duration).toBeNull();
    expect(media.fileSize).toBeNull();
    expect(media.thumbnailUrl).toBeNull();
  });

  it('should accept all valid media content types', () => {
    const validContentTypes = [
      'application/octet-stream',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/*',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/aac',
      'audio/webm',
      'audio/*',
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/avi',
      'video/quicktime',
      'video/*',
    ];

    validContentTypes.forEach((contentType) => {
      media.mediaContentType = contentType as any;
      expect(media.mediaContentType).toBe(contentType);
    });
  });

  describe('relationships', () => {
    it('should have ManyToOne relationship with QuestionTemplate', () => {
      const metadata = getMetadataArgsStorage();
      const relations = metadata.relations.filter(
        (relation) => relation.target === QuestionTemplateMedia,
      );
      const templateRelation = relations.find(
        (relation) => relation.propertyName === 'template',
      );
      const joinColumns = metadata.joinColumns.filter(
        (joinColumn) => joinColumn.target === QuestionTemplateMedia,
      );
      const templateJoinColumn = joinColumns.find(
        (joinColumn) => joinColumn.propertyName === 'template',
      );

      expect(templateRelation).toBeDefined();
      expect(templateRelation?.relationType).toBe('many-to-one');
      expect(templateJoinColumn).toBeDefined();
      expect(templateJoinColumn?.name).toBe('template_id');

      // Test bidirectional relationship
      template.media = [media];
      media.template = template;
      expect(media.template).toBeDefined();
      expect(media.template).toBeInstanceOf(QuestionTemplate);
      expect(template.media).toContain(media);

      // Test relationship type
      const typeFunction =
        templateRelation?.type as () => typeof QuestionTemplate;
      expect(typeFunction()).toBe(QuestionTemplate);
    });

    it('should initialize relationships as undefined', () => {
      const freshMedia = new QuestionTemplateMedia();
      expect(freshMedia.template).toBeUndefined();
    });
  });
});
