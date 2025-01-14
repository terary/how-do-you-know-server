import { validate } from 'class-validator';
import { UpdateLearningInstitutionDto } from './update-learning-institution.dto';

describe('UpdateLearningInstitutionDto', () => {
  let dto: UpdateLearningInstitutionDto;

  beforeEach(() => {
    dto = new UpdateLearningInstitutionDto();
  });

  it('should validate an empty DTO', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('name validation', () => {
    it('should be optional', async () => {
      dto.name = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate when provided', async () => {
      dto.name = 'Test University';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should enforce minimum length when provided', async () => {
      dto.name = 'A';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });

    it('should enforce maximum length when provided', async () => {
      dto.name = 'A'.repeat(101);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });
  });

  describe('description validation', () => {
    it('should be optional', async () => {
      dto.description = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate when provided', async () => {
      dto.description = 'A comprehensive test university description';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should enforce minimum length when provided', async () => {
      dto.description = 'Short';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('description');
    });
  });

  describe('website validation', () => {
    it('should be optional', async () => {
      dto.website = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate URL format when provided', async () => {
      dto.website = 'not-a-url';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('website');
    });

    it('should accept valid URLs', async () => {
      dto.website = 'https://test-university.edu';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('email validation', () => {
    it('should be optional', async () => {
      dto.email = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate email format when provided', async () => {
      dto.email = 'not-an-email';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should accept valid emails', async () => {
      dto.email = 'contact@test-university.edu';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('phone validation', () => {
    it('should be optional', async () => {
      dto.phone = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate phone format when provided', async () => {
      dto.phone = 'invalid-phone!@#';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('phone');
    });

    it('should accept valid phone formats', async () => {
      const validPhones = [
        '+1-234-567-8900',
        '1234567890',
        '+1 234 567 8900',
        '123-456-7890',
      ];

      for (const phone of validPhones) {
        dto.phone = phone;
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      }
    });
  });

  describe('address validation', () => {
    it('should be optional', async () => {
      dto.address = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should enforce minimum length when provided', async () => {
      dto.address = 'A';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('address');
    });

    it('should accept valid address', async () => {
      dto.address = '123 Test St, Test City, TC 12345';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
});
