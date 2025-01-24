import { plainToInstance } from 'class-transformer';
import { ExamTemplateSectionDto } from './exam-template-section.dto';

describe('ExamTemplateSectionDto', () => {
  let dto: ExamTemplateSectionDto;
  const now = new Date();

  beforeEach(() => {
    dto = plainToInstance(ExamTemplateSectionDto, {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Test Section',
      instructions: 'Test instructions',
      position: 1,
      timeLimitSeconds: 3600,
      exam_template_id: '123e4567-e89b-12d3-a456-426614174001',
      created_at: now,
      updated_at: now,
    });
  });

  it('should create a DTO instance', () => {
    expect(dto).toBeDefined();
    expect(dto).toBeInstanceOf(ExamTemplateSectionDto);
  });

  it('should have all required properties', () => {
    expect(dto.id).toBeDefined();
    expect(dto.title).toBeDefined();
    expect(dto.instructions).toBeDefined();
    expect(dto.position).toBeDefined();
    expect(dto.timeLimitSeconds).toBeDefined();
    expect(dto.exam_template_id).toBeDefined();
    expect(dto.created_at).toBeDefined();
    expect(dto.updated_at).toBeDefined();
  });

  it('should have correct property types', () => {
    expect(typeof dto.id).toBe('string');
    expect(typeof dto.title).toBe('string');
    expect(typeof dto.instructions).toBe('string');
    expect(typeof dto.position).toBe('number');
    expect(typeof dto.timeLimitSeconds).toBe('number');
    expect(typeof dto.exam_template_id).toBe('string');
    expect(dto.created_at).toBeInstanceOf(Date);
    expect(dto.updated_at).toBeInstanceOf(Date);
  });

  it('should transform dates correctly', () => {
    expect(dto.created_at).toEqual(now);
    expect(dto.updated_at).toEqual(now);
  });

  it('should handle null values', () => {
    const partialDto = plainToInstance(ExamTemplateSectionDto, {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Test Section',
    });

    expect(partialDto.id).toBeDefined();
    expect(partialDto.title).toBeDefined();
    expect(partialDto.instructions).toBeUndefined();
    expect(partialDto.position).toBeUndefined();
    expect(partialDto.timeLimitSeconds).toBeUndefined();
    expect(partialDto.exam_template_id).toBeUndefined();
    expect(partialDto.created_at).toBeUndefined();
    expect(partialDto.updated_at).toBeUndefined();
  });

  it('should handle all properties being set', () => {
    const fullDto = plainToInstance(ExamTemplateSectionDto, {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Test Section',
      instructions: 'Test instructions',
      position: 1,
      timeLimitSeconds: 3600,
      exam_template_id: '123e4567-e89b-12d3-a456-426614174001',
      created_at: now,
      updated_at: now,
    });

    expect(fullDto.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(fullDto.title).toBe('Test Section');
    expect(fullDto.instructions).toBe('Test instructions');
    expect(fullDto.position).toBe(1);
    expect(fullDto.timeLimitSeconds).toBe(3600);
    expect(fullDto.exam_template_id).toBe(
      '123e4567-e89b-12d3-a456-426614174001',
    );
    expect(fullDto.created_at).toEqual(now);
    expect(fullDto.updated_at).toEqual(now);
  });
});
