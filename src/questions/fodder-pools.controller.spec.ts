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
    create: jest.fn(),
    getById: jest.fn(),
    getAll: jest.fn(),
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

      mockFodderPoolsService.create.mockResolvedValue(expectedPool);

      const request = { user: { id: testUserId } };
      const result = await controller.create(createDto, request);

      expect(result).toEqual(expectedPool);
      expect(service.create).toHaveBeenCalledWith(createDto, testUserId);
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

      mockFodderPoolsService.getById.mockResolvedValue(expectedPool);

      const result = await controller.findOne(poolId);

      expect(result).toEqual(expectedPool);
      expect(service.getById).toHaveBeenCalledWith(poolId);
    });
  });

  describe('findAll', () => {
    it('should return all pools', async () => {
      const expectedPools = [
        {
          id: 'test-uuid-1',
          name: 'Test Pool 1',
          description: 'Test Description 1',
          created_by: testUserId,
          created_at: new Date(),
        },
        {
          id: 'test-uuid-2',
          name: 'Test Pool 2',
          description: 'Test Description 2',
          created_by: testUserId,
          created_at: new Date(),
        },
      ];

      mockFodderPoolsService.getAll.mockResolvedValue(expectedPools);

      const result = await controller.findAll();

      expect(result).toEqual(expectedPools);
      expect(service.getAll).toHaveBeenCalled();
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

  describe('removeItems', () => {
    it('should remove items from a pool', async () => {
      const poolId = 'test-pool-uuid';
      const itemIds = ['item-1', 'item-2'];

      await controller.removeItems(poolId, { itemIds });

      expect(service.removeItems).toHaveBeenCalledWith(poolId, itemIds);
    });
  });

  describe('remove', () => {
    it('should delete a pool', async () => {
      const poolId = 'test-pool-uuid';

      await controller.remove(poolId);

      expect(service.delete).toHaveBeenCalledWith(poolId);
    });
  });
});
