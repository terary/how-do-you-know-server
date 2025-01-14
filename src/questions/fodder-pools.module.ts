import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { FodderPool, FodderItem } from './entities';
import { FodderPoolsService } from './fodder-pools.service';
import { FodderPoolsController } from './fodder-pools.controller';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([FodderPool, FodderItem])],
  providers: [FodderPoolsService],
  controllers: [FodderPoolsController],
  exports: [FodderPoolsService],
})
export class FodderPoolsModule {}
