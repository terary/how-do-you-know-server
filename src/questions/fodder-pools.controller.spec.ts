import { Test, TestingModule } from '@nestjs/testing';
import { FodderPoolsController } from './fodder-pools.controller';
import { FodderPoolsService } from './fodder-pools.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('FodderPoolsController', () => {
  let controller: FodderPoolsController;
  let service: FodderPoolsService;

  const testUserId = '00000000-0000-0000-0000-000000000000';

  // Mock service
  const mockFodderPoolsService = {
    createPool: jest.fn(),
    findPoolById: jest.fn(),
    addItems: jest.fn(),
    removeItems: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FodderPoolsController],
      providers: [
        {
          provide: FodderPoolsService,
          useValue: mockFodderPoolsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<FodderPoolsController>(FodderPoolsController);
    service = module.get<FodderPoolsService>(FodderPoolsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new fodder pool', async () => {
      const createDto = {
        name: 'Test Pool',
        description: 'Test Description',
      };

      const expectedPool = {
        id: 'test-uuid',
        ...createDto,
        created_by: testUserId,
        created_at: new Date(),
      };

      mockFodderPoolsService.createPool.mockResolvedValue(expectedPool);

      const request = { user: { id: testUserId } };
      const result = await controller.create(createDto, request);

      expect(result).toEqual(expectedPool);
      expect(service.createPool).toHaveBeenCalledWith(createDto, testUserId);
    });
  });

  describe('findOne', () => {
    it('should return a pool by id', async () => {
      const poolId = 'test-uuid';
      const expectedPool = {
        id: poolId,
        name: 'Test Pool',
        description: 'Test Description',
        created_by: testUserId,
        created_at: new Date(),
      };

      mockFodderPoolsService.findPoolById.mockResolvedValue(expectedPool);

      const result = await controller.findOne(poolId);

      expect(result).toEqual(expectedPool);
      expect(service.findPoolById).toHaveBeenCalledWith(poolId);
    });
  });

  describe('addItems', () => {
    it('should add items to a pool', async () => {
      const poolId = 'test-pool-uuid';
      const items = [{ text: 'Item 1' }, { text: 'Item 2' }];

      const expectedItems = items.map((item, index) => ({
        id: `test-item-uuid-${index}`,
        pool_id: poolId,
        ...item,
        created_by: testUserId,
        created_at: new Date(),
      }));

      mockFodderPoolsService.addItems.mockResolvedValue(expectedItems);

      const request = { user: { id: testUserId } };
      const result = await controller.addItems(poolId, items, request);

      expect(result).toEqual(expectedItems);
      expect(service.addItems).toHaveBeenCalledWith(poolId, items, testUserId);
    });
  });

  // Add more test cases as needed...
});
