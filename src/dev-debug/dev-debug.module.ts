import { Module } from '@nestjs/common';
import { DevDebugService } from './dev-debug.service';
import { DevDebugController } from './dev-debug.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [DevDebugController],
  providers: [DevDebugService],
})
export class DevDebugModule {}
