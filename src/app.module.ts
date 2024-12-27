import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DevDebugModule } from './dev-debug/dev-debug.module';

@Module({
  imports: [DevDebugModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
