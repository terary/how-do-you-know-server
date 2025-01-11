import { FodderPool } from './fodder-pool.entity';
import { FodderItem } from './fodder-item.entity';

describe('FodderPool', () => {
  let fodderPool: FodderPool;
  const testDate = new Date();

  beforeEach(() => {
    fodderPool = new FodderPool();
    fodderPool.id = 'test-uuid';
    fodderPool.name = 'Test Pool';
    fodderPool.description = 'Test Description';
    fodderPool.created_by = 'user-uuid';
    fodderPool.created_at = testDate;
    fodderPool.items = [];
  });

  it('should create a fodder pool instance', () => {
    expect(fodderPool).toBeDefined();
    expect(fodderPool instanceof FodderPool).toBeTruthy();
  });

  it('should have all required properties', () => {
    expect(fodderPool).toHaveProperty('id', 'test-uuid');
    expect(fodderPool).toHaveProperty('name', 'Test Pool');
    expect(fodderPool).toHaveProperty('created_by', 'user-uuid');
    expect(fodderPool).toHaveProperty('created_at', testDate);
  });

  it('should allow null description', () => {
    fodderPool.description = null;
    expect(fodderPool.description).toBeNull();
  });

  it('should have an items array property', () => {
    expect(Array.isArray(fodderPool.items)).toBeTruthy();
    expect(fodderPool.items.length).toBe(0);
  });

  it('should be able to add items to the pool', () => {
    const item1 = new FodderItem();
    item1.id = 'item1-uuid';
    item1.pool_id = fodderPool.id;
    item1.text = 'Item 1';
    item1.created_by = 'user-uuid';
    item1.created_at = testDate;
    item1.pool = fodderPool;

    const item2 = new FodderItem();
    item2.id = 'item2-uuid';
    item2.pool_id = fodderPool.id;
    item2.text = 'Item 2';
    item2.created_by = 'user-uuid';
    item2.created_at = testDate;
    item2.pool = fodderPool;

    fodderPool.items = [item1, item2];

    expect(fodderPool.items.length).toBe(2);
    expect(fodderPool.items[0].text).toBe('Item 1');
    expect(fodderPool.items[1].text).toBe('Item 2');
    expect(fodderPool.items[0].pool).toBe(fodderPool);
    expect(fodderPool.items[1].pool).toBe(fodderPool);
  });

  it('should maintain bidirectional relationship with items', () => {
    const item = new FodderItem();
    item.id = 'item-uuid';
    item.pool_id = fodderPool.id;
    item.text = 'Test Item';
    item.created_by = 'user-uuid';
    item.created_at = testDate;
    item.pool = fodderPool;

    fodderPool.items = [item];

    expect(fodderPool.items[0].pool).toBe(fodderPool);
    expect(fodderPool.items[0].pool_id).toBe(fodderPool.id);
  });
});
