import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateTemplateDto } from './create-template.dto';
import { MediaDto } from './media.dto';
import { ValidAnswerDto } from './valid-answer.dto';
import { TUserPromptType, TUserResponseType } from '../types';

describe('CreateTemplateDto', () => {
  let dto: CreateTemplateDto;

  beforeEach(() => {
    dto = new CreateTemplateDto();
  });

  it('should fail validation when required fields are missing', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === 'userPromptType')).toBeTruthy();
    expect(errors.some((e) => e.property === 'userResponseType')).toBeTruthy();
    expect(errors.some((e) => e.property === 'exclusivityType')).toBeTruthy();
    expect(errors.some((e) => e.property === 'validAnswers')).toBeTruthy();
  });

  it('should pass validation with valid data', async () => {
    dto.userPromptType = 'text';
    dto.userResponseType = 'multiple-choice-4';
    dto.exclusivityType = 'exam-practice-both';
    dto.userPromptText = 'Sample prompt';
    dto.instructionText = 'Sample instruction';
    dto.validAnswers = [{ text: 'Sample answer' }];

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('userPromptType', () => {
    it('should fail with invalid prompt type', async () => {
      dto.userPromptType = 'invalid' as any;
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'userPromptType')).toBeTruthy();
    });

    it('should pass with valid prompt types', async () => {
      const validTypes: TUserPromptType[] = ['text', 'multimedia'];
      for (const type of validTypes) {
        dto.userPromptType = type;
        const errors = await validate(dto);
        expect(errors.some((e) => e.property === 'userPromptType')).toBeFalsy();
      }
    });
  });

  describe('userResponseType', () => {
    it('should fail with invalid response type', async () => {
      dto.userResponseType = 'invalid' as any;
      const errors = await validate(dto);
      expect(
        errors.some((e) => e.property === 'userResponseType'),
      ).toBeTruthy();
    });

    it('should pass with valid response types', async () => {
      const validTypes: TUserResponseType[] = [
        'free-text-255',
        'multiple-choice-4',
        'true-false',
      ];
      for (const type of validTypes) {
        dto.userResponseType = type;
        const errors = await validate(dto);
        expect(
          errors.some((e) => e.property === 'userResponseType'),
        ).toBeFalsy();
      }
    });
  });

  describe('exclusivityType', () => {
    it('should fail with invalid exclusivity type', async () => {
      dto.exclusivityType = 'invalid' as any;
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'exclusivityType')).toBeTruthy();
    });

    it('should pass with valid exclusivity types', async () => {
      const validTypes = [
        'exam-only',
        'practice-only',
        'exam-practice-both',
      ] as const;
      for (const type of validTypes) {
        dto.exclusivityType = type;
        const errors = await validate(dto);
        expect(
          errors.some((e) => e.property === 'exclusivityType'),
        ).toBeFalsy();
      }
    });
  });

  describe('optional text fields', () => {
    beforeEach(() => {
      // Set required fields
      dto.userPromptType = 'text';
      dto.userResponseType = 'multiple-choice-4';
      dto.exclusivityType = 'exam-practice-both';
      dto.validAnswers = [{ text: 'Sample answer' }];
    });

    it('should pass with valid userPromptText', async () => {
      dto.userPromptText = 'Valid prompt text';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail with non-string userPromptText', async () => {
      (dto as any).userPromptText = 123;
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'userPromptText')).toBeTruthy();
    });

    it('should pass with valid instructionText', async () => {
      dto.instructionText = 'Valid instruction text';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail with non-string instructionText', async () => {
      (dto as any).instructionText = 123;
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === 'instructionText')).toBeTruthy();
    });
  });

  describe('media', () => {
    beforeEach(() => {
      // Set required fields
      const plainData = {
        userPromptType: 'multimedia' as TUserPromptType,
        userResponseType: 'multiple-choice-4' as TUserResponseType,
        exclusivityType: 'exam-practice-both' as const,
        validAnswers: [{ text: 'Sample answer' }],
      };
      dto = plainToInstance(CreateTemplateDto, plainData);
    });

    it('should pass with valid media array', async () => {
      const validMediaData = {
        mediaContentType: 'video/mp4',
        height: 720,
        width: 1280,
        url: 'https://example.com/video.mp4',
        duration: 120,
        fileSize: 1024000,
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
      };

      const plainData = {
        ...dto,
        media: [validMediaData],
      };

      const instance = plainToInstance(CreateTemplateDto, plainData);
      const errors = await validate(instance, {
        validationError: { target: false },
        whitelist: true,
      });

      if (errors.length > 0) {
        console.log('Validation errors:', JSON.stringify(errors, null, 2));
      }

      expect(errors.length).toBe(0);
    });

    it('should validate each media item in the array', async () => {
      const invalidMedia = {
        mediaContentType: 'invalid/type',
        height: 'invalid',
        width: 'invalid',
        url: 'not-a-url',
      };

      const plainData = {
        ...dto,
        media: [invalidMedia],
      };

      const instance = plainToInstance(CreateTemplateDto, plainData);
      const errors = await validate(instance, {
        validationError: { target: false },
        whitelist: true,
        skipMissingProperties: false,
      });
      expect(errors.length).toBeGreaterThan(0);
      const mediaErrors = errors.find((e) => e.property === 'media')?.children;
      expect(mediaErrors?.length).toBeGreaterThan(0);
    });

    it('should handle type transformation correctly', async () => {
      type CreateTemplateWithMedia = {
        userPromptType: TUserPromptType;
        userResponseType: TUserResponseType;
        exclusivityType: 'exam-only' | 'practice-only' | 'exam-practice-both';
        media: {
          mediaContentType: string;
          height: number;
          width: number;
          url: string;
        }[];
        validAnswers: { text: string }[];
      };

      const plainData: CreateTemplateWithMedia = {
        userPromptType: 'multimedia',
        userResponseType: 'multiple-choice-4',
        exclusivityType: 'exam-practice-both',
        media: [
          {
            mediaContentType: 'video/mp4',
            height: 720,
            width: 1280,
            url: 'https://example.com/video.mp4',
          },
        ],
        validAnswers: [{ text: 'Sample answer' }],
      };

      const instance = plainToInstance(
        CreateTemplateDto,
        plainData,
      ) as CreateTemplateDto;
      expect(instance).toBeInstanceOf(CreateTemplateDto);
      expect(instance.media?.[0]).toBeInstanceOf(MediaDto);
      const errors = await validate(instance);
      expect(errors.length).toBe(0);
    });
  });

  describe('validAnswers', () => {
    beforeEach(() => {
      const plainData = {
        userPromptType: 'text' as TUserPromptType,
        userResponseType: 'multiple-choice-4' as TUserResponseType,
        exclusivityType: 'exam-practice-both' as const,
      };
      dto = plainToInstance(CreateTemplateDto, plainData);
    });

    it('should pass with valid answers array', async () => {
      const validAnswer = {
        text: 'Sample answer',
      };

      const plainData = {
        ...dto,
        validAnswers: [validAnswer],
      };

      const instance = plainToInstance(CreateTemplateDto, plainData);
      const errors = await validate(instance);
      expect(errors.length).toBe(0);
    });

    it('should fail with empty answers array', async () => {
      const plainData = {
        ...dto,
        validAnswers: [],
      };

      const instance = plainToInstance(CreateTemplateDto, plainData);
      const errors = await validate(instance);
      expect(errors.some((e) => e.property === 'validAnswers')).toBeTruthy();
    });

    it('should validate each answer in the array', async () => {
      const plainData = {
        ...dto,
        validAnswers: [{ text: 123 }],
      };

      const instance = plainToInstance(CreateTemplateDto, plainData);
      const errors = await validate(instance, {
        validationError: { target: false },
        whitelist: true,
        skipMissingProperties: false,
      });
      expect(errors.length).toBeGreaterThan(0);
      const answerErrors = errors.find(
        (e) => e.property === 'validAnswers',
      )?.children;
      expect(answerErrors?.length).toBeGreaterThan(0);
    });

    it('should handle type transformation correctly', async () => {
      const plainData = {
        userPromptType: 'text' as TUserPromptType,
        userResponseType: 'multiple-choice-4' as TUserResponseType,
        exclusivityType: 'exam-practice-both' as const,
        validAnswers: [
          { text: 'Answer 1' },
          { text: 'Answer 2', booleanValue: true },
        ],
      };

      const instance = plainToInstance(CreateTemplateDto, plainData);
      expect(instance).toBeInstanceOf(CreateTemplateDto);
      expect(instance.validAnswers[0]).toBeInstanceOf(ValidAnswerDto);
      expect(instance.validAnswers[1]).toBeInstanceOf(ValidAnswerDto);
      const errors = await validate(instance);
      expect(errors.length).toBe(0);
    });

    it('should handle different types of valid answers', async () => {
      const plainData = {
        ...dto,
        validAnswers: [
          { text: 'Text answer' },
          { booleanValue: true },
          { fodderPoolId: 'pool-123' },
        ],
      };

      const instance = plainToInstance(CreateTemplateDto, plainData);
      const errors = await validate(instance);
      expect(errors.length).toBe(0);
    });
  });
});
