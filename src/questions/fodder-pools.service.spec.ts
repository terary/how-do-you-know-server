import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { FodderPoolsService } from './fodder-pools.service';
import { FodderPool, FodderItem } from './entities';

describe('FodderPoolsService', () => {
  let service: FodderPoolsService;
  let poolRepository: Repository<FodderPool>;
  let itemRepository: Repository<FodderItem>;

  const testUserId = '00000000-0000-0000-0000-000000000000';

  // Mock repositories
  const mockPoolRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };

  const mockItemRepository = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FodderPoolsService,
        {
          provide: getRepositoryToken(FodderPool),
          useValue: mockPoolRepository,
        },
        {
          provide: getRepositoryToken(FodderItem),
          useValue: mockItemRepository,
        },
      ],
    }).compile();

    service = module.get<FodderPoolsService>(FodderPoolsService);
    poolRepository = module.get<Repository<FodderPool>>(
      getRepositoryToken(FodderPool),
    );
    itemRepository = module.get<Repository<FodderItem>>(
      getRepositoryToken(FodderItem),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new fodder pool', async () => {
      const poolData = {
        name: 'Test Pool',
        description: 'Test Description',
      };

      const expectedPool = {
        id: 'test-uuid',
        ...poolData,
        created_by: testUserId,
        created_at: expect.any(Date),
      };

      mockPoolRepository.create.mockReturnValue(expectedPool);
      mockPoolRepository.save.mockResolvedValue(expectedPool);
      mockPoolRepository.findOne.mockResolvedValue(expectedPool);

      const result = await service.create(poolData, testUserId);

      expect(result).toEqual(expectedPool);
      expect(mockPoolRepository.create).toHaveBeenCalledWith({
        ...poolData,
        created_by: testUserId,
      });
      expect(mockPoolRepository.save).toHaveBeenCalledWith(expectedPool);
    });

    it('should create a pool with items', async () => {
      const poolData = {
        name: 'Test Pool',
        description: 'Test Description',
        items: [{ text: 'Item 1' }, { text: 'Item 2' }],
      };

      const poolWithoutItems = {
        id: 'test-uuid',
        name: poolData.name,
        description: poolData.description,
        created_by: testUserId,
        created_at: expect.any(Date),
      };

      const expectedItems = poolData.items.map((item, index) => ({
        id: `test-item-uuid-${index}`,
        pool_id: poolWithoutItems.id,
        text: item.text,
        created_by: testUserId,
        created_at: expect.any(Date),
      }));

      const expectedPool = {
        ...poolWithoutItems,
        items: expectedItems,
      };

      mockPoolRepository.create.mockReturnValue(poolWithoutItems);
      mockPoolRepository.save.mockResolvedValue(poolWithoutItems);
      mockItemRepository.create.mockImplementation((data) => ({
        id: `test-item-uuid-${Math.random()}`,
        ...data,
        created_at: new Date(),
      }));
      mockItemRepository.save.mockResolvedValue(expectedItems);
      mockPoolRepository.findOne.mockResolvedValue(expectedPool);

      const result = await service.create(poolData, testUserId);

      expect(result).toEqual(expectedPool);
      expect(mockPoolRepository.create).toHaveBeenCalledWith({
        name: poolData.name,
        description: poolData.description,
        created_by: testUserId,
      });
      expect(mockPoolRepository.save).toHaveBeenCalledWith(poolWithoutItems);
      expect(mockItemRepository.create).toHaveBeenCalledTimes(
        poolData.items.length,
      );
      poolData.items.forEach((item, index) => {
        expect(mockItemRepository.create).toHaveBeenCalledWith({
          pool_id: poolWithoutItems.id,
          text: item.text,
          created_by: testUserId,
        });
      });
      expect(mockItemRepository.save).toHaveBeenCalledWith(
        expect.arrayContaining(
          poolData.items.map((item) =>
            expect.objectContaining({
              pool_id: poolWithoutItems.id,
              text: item.text,
              created_by: testUserId,
            }),
          ),
        ),
      );
      expect(mockPoolRepository.findOne).toHaveBeenCalledWith({
        where: { id: poolWithoutItems.id },
        relations: ['items'],
      });
    });

    it('should create a pool with empty items array', async () => {
      const poolData = {
        name: 'Test Pool',
        description: 'Test Description',
        items: [],
      };

      const expectedPool = {
        id: 'test-uuid',
        name: poolData.name,
        description: poolData.description,
        created_by: testUserId,
        created_at: expect.any(Date),
        items: [],
      };

      mockPoolRepository.create.mockReturnValue(expectedPool);
      mockPoolRepository.save.mockResolvedValue(expectedPool);
      mockPoolRepository.findOne.mockResolvedValue(expectedPool);

      const result = await service.create(poolData, testUserId);

      expect(result).toEqual(expectedPool);
      expect(mockPoolRepository.create).toHaveBeenCalledWith({
        name: poolData.name,
        description: poolData.description,
        created_by: testUserId,
      });
      expect(mockPoolRepository.save).toHaveBeenCalledWith(expectedPool);
      expect(mockItemRepository.create).not.toHaveBeenCalled();
      expect(mockItemRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('addItems', () => {
    it('should add items to an existing pool', async () => {
      const poolId = 'test-pool-uuid';
      const items = [{ text: 'Item 1' }, { text: 'Item 2' }];

      const expectedItems = items.map((item, index) => ({
        id: `test-item-uuid-${index}`,
        pool_id: poolId,
        text: item.text,
        created_by: testUserId,
        created_at: expect.any(Date),
      }));

      mockItemRepository.create.mockImplementation((data) => data);
      mockItemRepository.save.mockResolvedValue(expectedItems);

      const result = await service.addItems(poolId, items, testUserId);

      expect(result).toEqual(expectedItems);
      expect(mockItemRepository.create).toHaveBeenCalledTimes(items.length);
      expect(mockItemRepository.save).toHaveBeenCalledWith(
        expect.arrayContaining(
          items.map((item) =>
            expect.objectContaining({
              pool_id: poolId,
              text: item.text,
              created_by: testUserId,
            }),
          ),
        ),
      );
    });
  });

  describe('removeItems', () => {
    it('should remove items from a pool', async () => {
      const poolId = 'test-pool-uuid';
      const itemIds = ['item-1', 'item-2'];

      await service.removeItems(poolId, itemIds);

      expect(mockItemRepository.delete).toHaveBeenCalledWith({
        pool_id: poolId,
        id: In(itemIds),
      });
    });
  });

  describe('delete', () => {
    it('should delete a pool and its items', async () => {
      const poolId = 'test-pool-uuid';

      await service.delete(poolId);

      expect(mockItemRepository.delete).toHaveBeenCalledWith({
        pool_id: poolId,
      });
      expect(mockPoolRepository.delete).toHaveBeenCalledWith(poolId);
    });
  });

  describe('update', () => {
    it('should update a pool and handle items', async () => {
      const poolId = 'test-pool-uuid';
      const updateData = {
        name: 'Updated Pool Name',
        description: 'Updated Description',
        itemsToAdd: [{ text: 'New Item 1' }, { text: 'New Item 2' }],
        itemIdsToRemove: ['item-1', 'item-2'],
      };
      const updatedPool = {
        id: poolId,
        name: updateData.name,
        description: updateData.description,
        created_by: testUserId,
        created_at: new Date(),
      };

      const newItems = updateData.itemsToAdd.map((item, index) => ({
        id: `new-item-${index}`,
        pool_id: poolId,
        text: item.text,
        created_by: testUserId,
        created_at: expect.any(Date),
      }));

      mockPoolRepository.update.mockResolvedValue({ affected: 1 });
      mockItemRepository.create.mockImplementation((data) => data);
      mockItemRepository.save.mockResolvedValue(newItems);
      mockPoolRepository.findOne.mockResolvedValue(updatedPool);

      const result = await service.update(poolId, updateData, testUserId);

      expect(result).toEqual(updatedPool);
      expect(mockPoolRepository.update).toHaveBeenCalledWith(poolId, {
        name: updateData.name,
        description: updateData.description,
      });
      expect(mockItemRepository.create).toHaveBeenCalledTimes(
        updateData.itemsToAdd.length,
      );
      expect(mockItemRepository.save).toHaveBeenCalledWith(
        expect.arrayContaining(
          updateData.itemsToAdd.map((item) =>
            expect.objectContaining({
              pool_id: poolId,
              text: item.text,
              created_by: testUserId,
            }),
          ),
        ),
      );
      expect(mockItemRepository.delete).toHaveBeenCalledWith({
        pool_id: poolId,
        id: In(updateData.itemIdsToRemove),
      });
      expect(mockPoolRepository.findOne).toHaveBeenCalledWith({
        where: { id: poolId },
        relations: ['items'],
      });
    });

    it('should update pool properties only when no item operations', async () => {
      const poolId = 'test-pool-uuid';
      const updateData = {
        name: 'Updated Pool Name',
      };
      const updatedPool = {
        id: poolId,
        name: updateData.name,
        created_by: testUserId,
        created_at: new Date(),
      };

      mockPoolRepository.update.mockResolvedValue({ affected: 1 });
      mockPoolRepository.findOne.mockResolvedValue(updatedPool);

      const result = await service.update(poolId, updateData, testUserId);

      expect(result).toEqual(updatedPool);
      expect(mockPoolRepository.update).toHaveBeenCalledWith(
        poolId,
        updateData,
      );
      expect(mockItemRepository.create).not.toHaveBeenCalled();
      expect(mockItemRepository.save).not.toHaveBeenCalled();
      expect(mockItemRepository.delete).not.toHaveBeenCalled();
    });

    it('should return null when pool is not found', async () => {
      const poolId = 'non-existent-uuid';
      const updateData = {
        name: 'Updated Pool Name',
        itemsToAdd: [{ text: 'New Item' }],
      };

      mockPoolRepository.update.mockResolvedValue({ affected: 0 });
      mockPoolRepository.findOne.mockResolvedValue(null);

      const result = await service.update(poolId, updateData, testUserId);

      expect(result).toBeNull();
      expect(mockPoolRepository.update).toHaveBeenCalledWith(poolId, {
        name: updateData.name,
      });
      expect(mockItemRepository.create).not.toHaveBeenCalled();
      expect(mockItemRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return a pool by id', async () => {
      const poolId = 'test-pool-uuid';
      const expectedPool = {
        id: poolId,
        name: 'Test Pool',
        description: 'Test Description',
        created_by: testUserId,
        created_at: new Date(),
      };

      mockPoolRepository.findOne.mockResolvedValue(expectedPool);

      const result = await service.getById(poolId);

      expect(result).toEqual(expectedPool);
      expect(mockPoolRepository.findOne).toHaveBeenCalledWith({
        where: { id: poolId },
        relations: ['items'],
      });
    });

    it('should return null when pool not found', async () => {
      const poolId = 'non-existent-uuid';

      mockPoolRepository.findOne.mockResolvedValue(null);

      const result = await service.getById(poolId);

      expect(result).toBeNull();
    });
  });

  describe('getAll', () => {
    it('should return all pools', async () => {
      const expectedPools = [
        {
          id: 'pool-1',
          name: 'Pool 1',
          description: 'Description 1',
          created_by: testUserId,
          created_at: new Date(),
          items: [],
        },
        {
          id: 'pool-2',
          name: 'Pool 2',
          description: 'Description 2',
          created_by: testUserId,
          created_at: new Date(),
          items: [],
        },
      ];

      mockPoolRepository.find.mockResolvedValue(expectedPools);

      const result = await service.getAll();

      expect(result).toEqual(expectedPools);
      expect(mockPoolRepository.find).toHaveBeenCalledWith({
        relations: ['items'],
      });
    });
  });
});
