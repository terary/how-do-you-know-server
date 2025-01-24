import { FodderItem } from './fodder-item.entity';
import { FodderPool } from './fodder-pool.entity';
import { getMetadataArgsStorage } from 'typeorm';

describe('FodderItem', () => {
  let fodderItem: FodderItem;

  beforeEach(() => {
    fodderItem = new FodderItem();
  });

  it('should be defined', () => {
    expect(fodderItem).toBeDefined();
  });

  it('should have all required columns defined in metadata', () => {
    const metadata = getMetadataArgsStorage();
    const columns = metadata.columns.filter(
      (column) => column.target === FodderItem,
    );
    const columnNames = columns.map((column) => column.propertyName);

    expect(columnNames).toContain('id');
    expect(columnNames).toContain('pool_id');
    expect(columnNames).toContain('text');
    expect(columnNames).toContain('created_by');
    expect(columnNames).toContain('created_at');
  });

  it('should initialize with undefined properties', () => {
    expect(fodderItem.id).toBeUndefined();
    expect(fodderItem.pool_id).toBeUndefined();
    expect(fodderItem.text).toBeUndefined();
    expect(fodderItem.created_by).toBeUndefined();
    expect(fodderItem.created_at).toBeUndefined();
    expect(fodderItem.pool).toBeUndefined();
  });

  it('should accept valid values', () => {
    fodderItem.id = 'test-id';
    fodderItem.pool_id = 'test-pool-id';
    fodderItem.text = 'test text';
    fodderItem.created_by = 'test-user';
    fodderItem.created_at = new Date();

    expect(fodderItem.id).toBe('test-id');
    expect(fodderItem.pool_id).toBe('test-pool-id');
    expect(fodderItem.text).toBe('test text');
    expect(fodderItem.created_by).toBe('test-user');
    expect(fodderItem.created_at).toBeInstanceOf(Date);
  });

  describe('relationships', () => {
    it('should have ManyToOne relationship with FodderPool', () => {
      const metadata = getMetadataArgsStorage();
      const poolRelation = metadata.relations.find(
        (rel) => rel.target === FodderItem && rel.propertyName === 'pool',
      );

      expect(poolRelation).toBeDefined();
      const typeFunction = poolRelation?.type as () => typeof FodderPool;
      expect(typeFunction()).toBe(FodderPool);
      expect(poolRelation?.relationType).toBe('many-to-one');
      expect(typeof poolRelation?.inverseSideProperty).toBe('function');
    });

    it('should handle relationship assignment', () => {
      const pool = new FodderPool();
      pool.id = 'test-pool-id';
      pool.name = 'Test Pool';
      pool.description = 'Test Description';

      fodderItem.pool_id = pool.id;
      fodderItem.pool = pool;

      expect(fodderItem.pool).toBe(pool);
      expect(fodderItem.pool_id).toBe(pool.id);
    });
  });
});
