import { Test, TestingModule } from '@nestjs/testing';
import { createTypeOrmMock } from './typeorm.mock';
import { mockAuthModule } from './auth.mock';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Injectable, Module } from '@nestjs/common';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

// Test entities and classes
@Entity()
class TestEntity {
  @PrimaryGeneratedColumn()
  id: number;
}

@Injectable()
class TestService {
  findAll() {
    return [];
  }
}

@Injectable()
class TestController {
  constructor(private readonly service: TestService) {}
}

@Module({
  imports: [TypeOrmModule.forFeature([TestEntity])],
  providers: [TestService],
  controllers: [TestController],
  exports: [TestService],
})
class TestModule {}

export class BaseModuleSpec {
  public moduleRef: TestingModule;
  protected mockRepository: any;
  protected mockTypeOrm: any;

  constructor(
    protected readonly moduleClass: any,
    protected readonly serviceClass: any,
    protected readonly controllerClass: any | null,
    protected readonly entities: any[],
  ) {}

  async beforeAll() {
    this.mockTypeOrm = createTypeOrmMock(this.entities);
    this.mockRepository = this.mockTypeOrm.providers;

    // Create module with mocked dependencies
    this.moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: this.entities,
          synchronize: true,
        }),
        TypeOrmModule.forFeature(this.entities),
        this.moduleClass,
      ],
      providers: [...this.mockTypeOrm.providers],
    })
      .overrideProvider('AuthModule')
      .useValue(mockAuthModule.AuthModule)
      .compile();
  }

  async afterAll() {
    if (this.moduleRef) {
      await this.moduleRef.close();
    }
    jest.clearAllMocks();
    jest.resetModules();
  }

  runTests() {
    describe('Module Tests', () => {
      it('should compile the module', () => {
        expect(this.moduleRef).toBeDefined();
      });

      it(`should provide ${this.serviceClass.name}`, () => {
        const service = this.moduleRef.get(this.serviceClass);
        expect(service).toBeInstanceOf(this.serviceClass);
      });

      if (this.controllerClass) {
        it(`should provide ${this.controllerClass.name}`, () => {
          const controller = this.moduleRef.get(this.controllerClass);
          expect(controller).toBeInstanceOf(this.controllerClass);
        });
      }

      it('should register all entities with TypeORM', () => {
        this.entities.forEach((entity) => {
          const repository = this.moduleRef.get(`${entity.name}Repository`);
          expect(repository).toBeDefined();
        });
      });

      it(`should export ${this.serviceClass.name}`, () => {
        const service = this.moduleRef.get(this.serviceClass);
        expect(service).toBeDefined();
      });
    });
  }
}

// Test suite for BaseModuleSpec
describe('BaseModuleSpec', () => {
  let baseModuleSpec: BaseModuleSpec;

  beforeAll(async () => {
    baseModuleSpec = new BaseModuleSpec(
      TestModule,
      TestService,
      TestController,
      [TestEntity],
    );
    await baseModuleSpec.beforeAll();
  });

  afterAll(async () => {
    await baseModuleSpec.afterAll();
  });

  describe('Module Tests', () => {
    it('should compile the module', () => {
      expect(baseModuleSpec.moduleRef).toBeDefined();
    });

    it(`should provide TestService`, () => {
      const service = baseModuleSpec.moduleRef.get(TestService);
      expect(service).toBeInstanceOf(TestService);
    });

    it(`should provide TestController`, () => {
      const controller = baseModuleSpec.moduleRef.get(TestController);
      expect(controller).toBeInstanceOf(TestController);
    });

    it('should register all entities with TypeORM', () => {
      const repository = baseModuleSpec.moduleRef.get(
        `${TestEntity.name}Repository`,
      );
      expect(repository).toBeDefined();
    });

    it(`should export TestService`, () => {
      const service = baseModuleSpec.moduleRef.get(TestService);
      expect(service).toBeDefined();
    });
  });
});
