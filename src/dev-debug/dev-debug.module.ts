import { Module } from '@nestjs/common';
import { DevDebugService } from './dev-debug.service';
import { DevDebugController } from './dev-debug.controller';

@Module({
  controllers: [DevDebugController],
  providers: [DevDebugService],
})
export class DevDebugModule {}
