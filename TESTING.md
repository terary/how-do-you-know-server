# Testing Guide

## Testing Patterns

### 1. Module Testing

We use `BaseModuleSpec` for consistent module testing. Located in `src/common/test/base-module.spec.ts`, it tests:

- Module compilation
- Service provision
- Controller provision
- Entity registration
- Service exports

```typescript
// Example usage
const moduleSpec = new BaseModuleSpec(YourModule, YourService, YourController, [
  YourEntity1,
  YourEntity2,
]);

describe('YourModule', () => {
  beforeAll(async () => {
    await moduleSpec.beforeAll();
  });

  afterAll(async () => {
    await moduleSpec.afterAll();
  });

  // This runs all standard module tests
  moduleSpec.runTests();
});
```

### 2. Mock Resources

Located in `src/common/test/`:

- `typeorm.mock.ts`: TypeORM mocking utilities
- `auth.mock.ts`: Authentication mocking

### 3. Database Testing

- Uses in-memory SQLite for tests
- Auto-synchronizes schema
- Isolated test database per suite

### 4. Repository Testing

Mock repositories are automatically created with common methods:

- find
- findOne
- save
- update
- delete
- createQueryBuilder (with common query methods)

### 5. Service Testing

Test services with mocked repositories:

```typescript
describe('YourService', () => {
  let service: YourService;
  let mockRepository: MockRepository<YourEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        YourService,
        {
          provide: getRepositoryToken(YourEntity),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<YourService>(YourService);
    mockRepository = module.get(getRepositoryToken(YourEntity));
  });
});
```

### 6. Controller Testing

Test controllers with mocked services:

```typescript
describe('YourController', () => {
  let controller: YourController;
  let mockService: MockType<YourService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [YourController],
      providers: [
        {
          provide: YourService,
          useValue: createMockService(),
        },
      ],
    }).compile();

    controller = module.get<YourController>(YourController);
    mockService = module.get(YourService);
  });
});
```

## Best Practices

1. Use `BaseModuleSpec` for module tests
2. Mock external dependencies
3. Use in-memory SQLite for database tests
4. Clean up after tests using `afterAll`
5. Reset modules and clear mocks between tests
6. Test both success and error cases
7. Validate input/output types

## Common Test Files Structure

```
src/
├── common/
│   └── test/
│       ├── base-module.spec.ts    # Base module testing
│       ├── typeorm.mock.ts        # TypeORM mocks
│       └── auth.mock.ts           # Auth mocks
└── your-feature/
    ├── your-feature.module.ts
    ├── your-feature.module.spec.ts
    ├── your-feature.service.ts
    ├── your-feature.service.spec.ts
    ├── your-feature.controller.ts
    └── your-feature.controller.spec.ts
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test path/to/file.spec.ts

# Run tests with coverage
npm run test:cov
```
