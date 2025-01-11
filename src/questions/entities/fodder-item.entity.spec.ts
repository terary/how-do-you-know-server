import { FodderItem } from './fodder-item.entity';
import { FodderPool } from './fodder-pool.entity';

describe('FodderItem', () => {
  let fodderItem: FodderItem;
  const testDate = new Date();

  beforeEach(() => {
    fodderItem = new FodderItem();
    fodderItem.id = 'test-uuid';
    fodderItem.pool_id = 'pool-uuid';
    fodderItem.text = 'Test item text';
    fodderItem.created_by = 'user-uuid';
    fodderItem.created_at = testDate;
  });

  it('should create a fodder item instance', () => {
    expect(fodderItem).toBeDefined();
    expect(fodderItem instanceof FodderItem).toBeTruthy();
  });

  it('should have all required properties', () => {
    expect(fodderItem).toHaveProperty('id', 'test-uuid');
    expect(fodderItem).toHaveProperty('pool_id', 'pool-uuid');
    expect(fodderItem).toHaveProperty('text', 'Test item text');
    expect(fodderItem).toHaveProperty('created_by', 'user-uuid');
    expect(fodderItem).toHaveProperty('created_at', testDate);
  });

  it('should have a pool relationship property', () => {
    const pool = new FodderPool();
    pool.id = 'pool-uuid';
    pool.name = 'Test Pool';

    fodderItem.pool = pool;

    expect(fodderItem.pool).toBeDefined();
    expect(fodderItem.pool instanceof FodderPool).toBeTruthy();
    expect(fodderItem.pool.id).toBe('pool-uuid');
    expect(fodderItem.pool.name).toBe('Test Pool');
  });

  it('should match the pool_id with the related pool id', () => {
    const pool = new FodderPool();
    pool.id = 'pool-uuid';

    fodderItem.pool = pool;

    expect(fodderItem.pool_id).toBe(fodderItem.pool.id);
  });
});
