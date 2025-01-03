import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FodderPoolsService } from './fodder-pools.service';
import { FodderPool, FodderItem } from './entities';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiProperty,
} from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

class FodderItemDto {
  @ApiProperty({
    description: 'The text content of the fodder item',
    example: 'July 4, 1776',
  })
  @IsString()
  text: string;
}

@ApiTags('fodder-pools')
@Controller('fodder-pools')
@UseGuards(JwtAuthGuard)
export class FodderPoolsController {
  constructor(private readonly fodderPoolsService: FodderPoolsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all fodder pools' })
  @ApiResponse({
    status: 200,
    description: 'List of all fodder pools',
    type: [FodderPool],
  })
  findAll(): Promise<FodderPool[]> {
    return this.fodderPoolsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a fodder pool by ID' })
  @ApiParam({ name: 'id', description: 'ID of the fodder pool' })
  @ApiResponse({
    status: 200,
    description: 'The fodder pool',
    type: FodderPool,
  })
  findOne(@Param('id') id: string): Promise<FodderPool> {
    return this.fodderPoolsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new fodder pool' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Historical Events' },
        description: { type: 'string', example: 'Important dates in history' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              text: { type: 'string', example: 'July 4, 1776' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The fodder pool has been created',
    type: FodderPool,
  })
  create(
    @Body()
    data: {
      name: string;
      description?: string;
      items?: { text: string }[];
    },
    @Request() req,
  ): Promise<FodderPool> {
    return this.fodderPoolsService.create(data, req.user.id);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Add items to a fodder pool' })
  @ApiParam({ name: 'id', description: 'ID of the fodder pool' })
  @ApiBody({
    type: [FodderItemDto],
    description: 'Array of fodder items to add',
    examples: {
      items: {
        value: [{ text: 'July 4, 1776' }, { text: 'December 7, 1941' }],
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The items have been added to the fodder pool',
    type: [FodderItem],
  })
  addItems(
    @Param('id') id: string,
    @Body() items: { text: string }[],
    @Request() req,
  ): Promise<FodderItem[]> {
    return this.fodderPoolsService.addItems(id, items, req.user.id);
  }

  @Delete(':poolId/items')
  @ApiOperation({ summary: 'Remove items from a fodder pool' })
  @ApiParam({ name: 'poolId', description: 'ID of the fodder pool' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        itemIds: {
          type: 'array',
          items: { type: 'string' },
          example: ['item-id-1', 'item-id-2'],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The items have been removed from the fodder pool',
  })
  removeItems(
    @Param('poolId') poolId: string,
    @Body() data: { itemIds: string[] },
  ): Promise<void> {
    return this.fodderPoolsService.removeItems(poolId, data.itemIds);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a fodder pool' })
  @ApiParam({ name: 'id', description: 'ID of the fodder pool' })
  @ApiResponse({
    status: 200,
    description: 'The fodder pool has been deleted',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.fodderPoolsService.delete(id);
  }
}
