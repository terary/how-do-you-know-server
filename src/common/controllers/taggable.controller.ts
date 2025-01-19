import { Put, Get, Body, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { UpdateTagsDto } from '../dto/update-tags.dto';
import { TaggableService } from '../services/taggable.service';

export abstract class TaggableController<
  T extends { id: string; user_defined_tags: string },
> {
  constructor(protected readonly service: TaggableService<T>) {}

  @Put(':id/tags')
  @ApiOperation({ summary: 'Update entity tags' })
  @ApiResponse({
    status: 200,
    description: 'The tags have been updated',
  })
  @ApiResponse({ status: 404, description: 'Entity not found' })
  @ApiParam({ name: 'id', description: 'ID of the entity' })
  async updateTags(
    @Param('id') id: string,
    @Body() updateTagsDto: UpdateTagsDto,
  ): Promise<T> {
    return this.service.updateTags(id, updateTagsDto);
  }

  @Get('search/tags')
  @ApiOperation({ summary: 'Search entities by tags' })
  @ApiResponse({
    status: 200,
    description: 'List of entities matching the tags',
  })
  @ApiQuery({
    name: 'tags',
    description: 'Space-separated list of tags to search for',
    required: true,
    type: String,
  })
  async findByTags(@Query('tags') tags: string): Promise<T[]> {
    return this.service.findByTags(tags);
  }
}
