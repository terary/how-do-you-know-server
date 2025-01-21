import { Test, TestingModule } from '@nestjs/testing';
import { Type } from '@nestjs/common';
import { createTypeOrmMock } from './typeorm.mock';
import { TypeOrmModule } from '@nestjs/typeorm';

interface ModuleTestConfig<T> {
  module: Type<T>;
  imports?: Type<any>[];
  providers?: Type<any>[];
  controllers?: Type<any>[];
  exports?: Type<any>[];
  entities: Type<any>[];
}

interface TestModuleResult {
  moduleRef: TestingModule;
  mocks: {
    repository: any;
    typeorm: any;
  };
}

/**
 * Factory for creating NestJS module tests with common patterns and mocks.
 * Provides a standardized way to test module compilation, providers, controllers, and entity registration.
 *
 * @example
 * ```typescript
 * describe('MyModule', () => {
 *   const testFactory = new ModuleTestFactory({
 *     module: MyModule,
 *     providers: [MyService],
 *     controllers: [MyController],
 *     entities: [MyEntity],
 *   });
 *
 *   const { moduleRef, mocks } = testFactory.createTestCases(describe);
 *
 *   // Add module-specific tests
 *   describe('MyService', () => {
 *     it('should do something', () => {
 *       const service = moduleRef.get(MyService);
 *       // Test service functionality
 *     });
 *   });
 * });
 * ```
 */
export class ModuleTestFactory<T> {
  private readonly config: ModuleTestConfig<T>;
  private mockTypeOrm: any;
  private mockRepository: any;

  constructor(config: ModuleTestConfig<T>) {
    this.config = config;
  }

  async create(): Promise<TestModuleResult> {
    this.mockTypeOrm = createTypeOrmMock(this.config.entities);
    this.mockRepository = this.mockTypeOrm.providers;

    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: this.config.entities,
          synchronize: true,
        }),
        TypeOrmModule.forFeature(this.config.entities),
        this.config.module,
        ...(this.config.imports || []),
      ],
      providers: [
        ...this.mockTypeOrm.providers,
        ...(this.config.providers || []),
      ],
      controllers: this.config.controllers || [],
      exports: this.config.exports || [],
    }).compile();

    return {
      moduleRef,
      mocks: {
        repository: this.mockRepository,
        typeorm: this.mockTypeOrm,
      },
    };
  }

  createTestCases(describe: jest.Describe) {
    describe('Module Tests', () => {
      let moduleRef: TestingModule;
      let mocks: TestModuleResult['mocks'];

      beforeAll(async () => {
        const result = await this.create();
        moduleRef = result.moduleRef;
        mocks = result.mocks;
      }, 10000);

      afterAll(async () => {
        if (moduleRef) {
          await moduleRef.close();
        }
      });

      it('should compile the module', () => {
        expect(moduleRef).toBeDefined();
      });

      if (this.config.providers?.length) {
        this.config.providers.forEach((provider) => {
          it(`should provide ${provider.name}`, () => {
            const service = moduleRef.get(provider);
            expect(service).toBeDefined();
          });
        });
      }

      if (this.config.controllers?.length) {
        this.config.controllers.forEach((controller) => {
          it(`should provide ${controller.name}`, () => {
            const controllerInstance = moduleRef.get(controller);
            expect(controllerInstance).toBeDefined();
          });
        });
      }

      if (this.config.entities?.length) {
        it('should register all entities with TypeORM', () => {
          this.config.entities.forEach((entity) => {
            const repository = moduleRef.get(`${entity.name}Repository`);
            expect(repository).toBeDefined();
          });
        });
      }

      if (this.config.exports?.length) {
        this.config.exports.forEach((exported) => {
          it(`should export ${exported.name}`, () => {
            const exportedInstance = moduleRef.get(exported);
            expect(exportedInstance).toBeDefined();
          });
        });
      }
    });
  }
}
