import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { FodderPool, FodderItem } from './entities';

@Injectable()
export class FodderPoolsService {
  constructor(
    @InjectRepository(FodderPool)
    private readonly fodderPoolRepository: Repository<FodderPool>,
    @InjectRepository(FodderItem)
    private readonly fodderItemRepository: Repository<FodderItem>,
  ) {}

  async findAll(): Promise<FodderPool[]> {
    return this.fodderPoolRepository.find({
      relations: ['items'],
    });
  }

  async findOne(id: string): Promise<FodderPool> {
    return this.fodderPoolRepository.findOne({
      where: { id },
      relations: ['items'],
    });
  }

  async create(
    data: {
      name: string;
      description?: string;
      items?: { text: string }[];
    },
    userId: string,
  ): Promise<FodderPool> {
    const pool = this.fodderPoolRepository.create({
      name: data.name,
      description: data.description,
      created_by: userId,
    });

    const savedPool = await this.fodderPoolRepository.save(pool);

    if (data.items?.length) {
      const items = data.items.map((item) =>
        this.fodderItemRepository.create({
          pool_id: savedPool.id,
          text: item.text,
          created_by: userId,
        }),
      );
      await this.fodderItemRepository.save(items);
    }

    return this.findOne(savedPool.id);
  }

  async addItems(
    poolId: string,
    items: { text: string }[],
    userId: string,
  ): Promise<FodderItem[]> {
    const fodderItems = items.map((item) =>
      this.fodderItemRepository.create({
        pool_id: poolId,
        text: item.text,
        created_by: userId,
      }),
    );

    return this.fodderItemRepository.save(fodderItems);
  }

  async removeItems(poolId: string, itemIds: string[]): Promise<void> {
    await this.fodderItemRepository.delete({
      pool_id: poolId,
      id: In(itemIds),
    });
  }

  async delete(id: string): Promise<void> {
    // First delete all items in the pool
    await this.fodderItemRepository.delete({ pool_id: id });
    // Then delete the pool itself
    await this.fodderPoolRepository.delete(id);
  }
}
