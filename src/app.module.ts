import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DevDebugModule } from './dev-debug/dev-debug.module';
import { QuestionsModule } from './questions/questions.module';
import { FodderPoolsModule } from './questions/fodder-pools.module';
import { LearningModule } from './learning/learning.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    DevDebugModule,
    QuestionsModule,
    FodderPoolsModule,
    LearningModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
