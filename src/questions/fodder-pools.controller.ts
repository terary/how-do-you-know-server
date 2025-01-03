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

@Controller('fodder-pools')
@UseGuards(JwtAuthGuard)
export class FodderPoolsController {
  constructor(private readonly fodderPoolsService: FodderPoolsService) {}

  @Get()
  findAll(): Promise<FodderPool[]> {
    return this.fodderPoolsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<FodderPool> {
    return this.fodderPoolsService.findOne(id);
  }

  @Post()
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
  addItems(
    @Param('id') id: string,
    @Body() items: { text: string }[],
    @Request() req,
  ): Promise<FodderItem[]> {
    return this.fodderPoolsService.addItems(id, items, req.user.id);
  }

  @Delete(':poolId/items')
  removeItems(
    @Param('poolId') poolId: string,
    @Body() data: { itemIds: string[] },
  ): Promise<void> {
    return this.fodderPoolsService.removeItems(poolId, data.itemIds);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.fodderPoolsService.delete(id);
  }
}
