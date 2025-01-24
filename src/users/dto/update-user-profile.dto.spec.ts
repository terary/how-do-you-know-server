import { validate } from 'class-validator';
import { UpdateUserProfileDto } from './update-user-profile.dto';
import { TUserRole } from '../types';
import { plainToInstance } from 'class-transformer';

describe('UpdateUserProfileDto', () => {
  let dto: UpdateUserProfileDto;

  beforeEach(() => {
    dto = plainToInstance(UpdateUserProfileDto, {
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: ['user' as TUserRole],
    });
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should validate with correct data', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate email format', async () => {
    dto.email = 'invalid-email';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should validate username length', async () => {
    dto.username = 'a'; // too short
    let errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('minLength');

    dto.username = 'a'.repeat(51); // too long
    errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('maxLength');
  });

  it('should validate firstName and lastName are not empty', async () => {
    dto.firstName = '';
    dto.lastName = '';
    const errors = await validate(dto);
    expect(errors.length).toBe(2);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    expect(errors[1].constraints).toHaveProperty('isNotEmpty');
  });

  it('should validate roles array contains valid roles', async () => {
    dto.roles = ['invalid_role' as TUserRole];
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEnum');

    // Test with valid roles
    dto.roles = ['user', 'admin:users'] as TUserRole[];
    const validErrors = await validate(dto);
    expect(validErrors.length).toBe(0);
  });

  it('should validate dates are valid Date objects', async () => {
    dto.createdAt = 'invalid-date' as any;
    dto.updatedAt = 'invalid-date' as any;
    const errors = await validate(dto);
    expect(errors.length).toBe(2);
    expect(errors[0].constraints).toHaveProperty('isDate');
    expect(errors[1].constraints).toHaveProperty('isDate');
  });
});
