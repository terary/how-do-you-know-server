import { validate } from 'class-validator';
import { CreateLearningInstitutionDto } from './create-learning-institution.dto';

describe('CreateLearningInstitutionDto', () => {
  let dto: CreateLearningInstitutionDto;

  beforeEach(() => {
    dto = new CreateLearningInstitutionDto();
    dto.name = 'Test University';
    dto.description = 'A comprehensive test university';
    dto.website = 'https://test-university.edu';
    dto.email = 'contact@test-university.edu';
    dto.phone = '+1-234-567-8900';
    dto.address = '123 Test St, Test City, TC 12345';
  });

  it('should validate a valid DTO', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('name validation', () => {
    it('should require name', async () => {
      dto.name = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });

    it('should enforce minimum length', async () => {
      dto.name = 'A';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });

    it('should enforce maximum length', async () => {
      dto.name = 'A'.repeat(101);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });
  });

  describe('description validation', () => {
    it('should require description', async () => {
      dto.description = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('description');
    });

    it('should enforce minimum length', async () => {
      dto.description = 'Short';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('description');
    });
  });

  describe('website validation', () => {
    it('should require website', async () => {
      dto.website = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('website');
    });

    it('should validate URL format', async () => {
      dto.website = 'not-a-url';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('website');
    });
  });

  describe('email validation', () => {
    it('should require email', async () => {
      dto.email = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should validate email format', async () => {
      dto.email = 'not-an-email';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });
  });

  describe('phone validation', () => {
    it('should require phone', async () => {
      dto.phone = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('phone');
    });

    it('should validate phone format', async () => {
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
  });
});
