# Testing Utilities and Patterns

This directory contains reusable testing utilities and patterns for NestJS applications.

## Overview

The testing utilities provide:

- Common module testing patterns
- Repository mocks
- Service and controller test helpers
- Entity mocking utilities
- Query builder mocks

## Module Testing

The `ModuleTestFactory` provides a standardized way to test NestJS modules:

```typescript
import { ModuleTestFactory } from './module-test.factory';

describe('MyModule', () => {
  const testFactory = new ModuleTestFactory({
    module: MyModule,
    providers: [MyService],
    controllers: [MyController],
    entities: [MyEntity],
  });

  const { moduleRef, mocks } = testFactory.createTestCases(describe);

  // Add module-specific tests
  describe('MyService', () => {
    it('should do something', () => {
      const service = moduleRef.get(MyService);
      // Test service functionality
    });
  });
});
```

## Test Utilities

### Entity Mocking

```typescript
import { createMockEntity } from './test-utils';

const mockUser = createMockEntity(User, {
  name: 'Test User',
  email: 'test@example.com',
});
```

### Repository Testing

```typescript
import { createRepositoryTests } from './test-utils';

createRepositoryTests(userRepository, User, mockUser);
```

### Service Testing

```typescript
import { createServiceTests } from './test-utils';

createServiceTests(userService, ['create', 'findAll', 'update', 'delete']);
```

### Controller Testing

```typescript
import { createControllerTests } from './test-utils';

createControllerTests(userController, [
  'create',
  'findAll',
  'update',
  'delete',
]);
```

### Query Builder Mocking

```typescript
import { createMockQueryBuilder } from './test-utils';

const queryBuilder = createMockQueryBuilder();
repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
```

## Best Practices

1. **Use the Factory Pattern**: The `ModuleTestFactory` provides a consistent way to test modules.
2. **Reuse Mocks**: Use the provided mock utilities instead of creating new ones.
3. **Type Safety**: Leverage TypeScript types for better type checking.
4. **Test Organization**: Group related tests using describe blocks.
5. **Isolation**: Each test should be independent and not rely on other tests.

## Common Patterns

### Testing Repositories

- Mock the repository methods
- Test CRUD operations
- Verify query builder usage
- Test custom repository methods

### Testing Services

- Mock dependencies
- Test business logic
- Verify error handling
- Test edge cases

### Testing Controllers

- Mock service layer
- Test request/response handling
- Verify DTOs
- Test validation

## Examples

### Complete Module Test

```typescript
describe('UserModule', () => {
  const testFactory = new ModuleTestFactory({
    module: UserModule,
    providers: [UserService],
    controllers: [UserController],
    entities: [User],
  });

  const { moduleRef, mocks } = testFactory.createTestCases(describe);

  // Repository tests
  createRepositoryTests(mocks.repository, User, mockUser);

  // Service tests
  const userService = moduleRef.get(UserService);
  createServiceTests(userService, ['create', 'findAll']);

  // Controller tests
  const userController = moduleRef.get(UserController);
  createControllerTests(userController, ['create', 'findAll']);

  // Custom tests
  describe('UserService', () => {
    describe('create', () => {
      it('should create a user', async () => {
        const dto = { name: 'Test', email: 'test@example.com' };
        mocks.repository.create.mockReturnValue(mockUser);
        mocks.repository.save.mockResolvedValue(mockUser);

        const result = await userService.create(dto);
        expect(result).toEqual(mockUser);
      });
    });
  });
});
```
