import { FodderPool } from './fodder-pool.entity';
import { FodderItem } from './fodder-item.entity';
import { getMetadataArgsStorage } from 'typeorm';

describe('FodderPool', () => {
  let fodderPool: FodderPool;

  beforeEach(() => {
    fodderPool = new FodderPool();
  });

  it('should be defined', () => {
    expect(fodderPool).toBeDefined();
  });

  it('should have all required columns defined in metadata', () => {
    const columns = getMetadataArgsStorage().columns.filter(
      (col) => col.target === FodderPool,
    );
    expect(columns.map((col) => col.propertyName)).toContain('id');
    expect(columns.map((col) => col.propertyName)).toContain('name');
    expect(columns.map((col) => col.propertyName)).toContain('description');
    expect(columns.map((col) => col.propertyName)).toContain('created_by');
    expect(columns.map((col) => col.propertyName)).toContain('created_at');
  });

  it('should initialize with undefined properties', () => {
    expect(fodderPool.id).toBeUndefined();
    expect(fodderPool.name).toBeUndefined();
    expect(fodderPool.description).toBeUndefined();
    expect(fodderPool.created_by).toBeUndefined();
    expect(fodderPool.created_at).toBeUndefined();
    expect(fodderPool.items).toBeUndefined();
  });

  it('should accept valid values', () => {
    const now = new Date();
    Object.assign(fodderPool, {
      id: 1,
      name: 'Test Pool',
      description: 'Test Description',
      created_by: 'user1',
      created_at: now,
      items: [],
    });

    expect(fodderPool.id).toBe(1);
    expect(fodderPool.name).toBe('Test Pool');
    expect(fodderPool.description).toBe('Test Description');
    expect(fodderPool.created_by).toBe('user1');
    expect(fodderPool.created_at).toBe(now);
    expect(fodderPool.items).toEqual([]);
  });

  it('should allow null values for nullable fields', () => {
    Object.assign(fodderPool, {
      description: null,
    });

    expect(fodderPool.description).toBeNull();
  });

  describe('relationships', () => {
    it('should have OneToMany relationship with FodderItem', () => {
      const relations = getMetadataArgsStorage().relations.filter(
        (rel) => rel.target === FodderPool && rel.propertyName === 'items',
      );

      expect(relations).toHaveLength(1);
      const itemsRelation = relations[0];
      const typeFunction = itemsRelation.type as () => typeof FodderItem;
      expect(typeFunction()).toBe(FodderItem);
      expect(itemsRelation.relationType).toBe('one-to-many');
      expect(typeof itemsRelation.inverseSideProperty).toBe('function');
    });

    it('should initialize relationships as undefined', () => {
      const freshPool = new FodderPool();
      expect(freshPool.items).toBeUndefined();
    });
  });
});
