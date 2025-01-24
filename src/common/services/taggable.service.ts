import { Repository } from 'typeorm';
import { UpdateTagsDto } from '../dto/update-tags.dto';
import { NotFoundException } from '@nestjs/common';

export abstract class TaggableService<
  T extends { id: string; user_defined_tags: string },
> {
  constructor(protected readonly repository: Repository<T>) {}

  async updateTags(id: string, updateTagsDto: UpdateTagsDto): Promise<T> {
    const entity = await this.repository.findOne({ where: { id } as any });
    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    entity.user_defined_tags = updateTagsDto.tags;
    return this.repository.save(entity);
  }

  async findByTags(tags: string): Promise<T[]> {
    const tagList = tags.split(' ').filter((tag) => tag.length > 0);
    if (tagList.length === 0) {
      return [];
    }

    const queryBuilder = this.repository.createQueryBuilder('entity');
    tagList.forEach((tag) => {
      queryBuilder.orWhere('entity.user_defined_tags LIKE :tag', {
        tag: `%${tag}%`,
      });
    });

    return queryBuilder.getMany();
  }
}
