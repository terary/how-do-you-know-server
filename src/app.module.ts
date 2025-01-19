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
import { ExamInstancesController } from './learning/controllers/exam-instances.controller';
import { ExamInstancesService } from './learning/services/exam-instances.service';
import { ExamInstance } from './learning/entities/exam-instance.entity';
import { ExamInstanceSection } from './learning/entities/exam-instance-section.entity';
import { ExamInstanceQuestion } from './learning/entities/exam-instance-question.entity';

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
      synchronize: false,
    }),
    UsersModule,
    AuthModule,
    DevDebugModule,
    QuestionsModule,
    FodderPoolsModule,
    LearningModule,
    TypeOrmModule.forFeature([
      ExamInstance,
      ExamInstanceSection,
      ExamInstanceQuestion,
    ]),
  ],
  controllers: [AppController, ExamInstancesController],
  providers: [AppService, ExamInstancesService],
})
export class AppModule {}
