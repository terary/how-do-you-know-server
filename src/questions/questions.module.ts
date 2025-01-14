import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import {
  FodderPool,
  FodderItem,
  QuestionTemplate,
  QuestionTemplateMedia,
  QuestionTemplateValidAnswer,
  QuestionActual,
  QuestionActualChoice,
  QuestionActualValidAnswer,
} from './entities';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      FodderPool,
      FodderItem,
      QuestionTemplate,
      QuestionTemplateMedia,
      QuestionTemplateValidAnswer,
      QuestionActual,
      QuestionActualChoice,
      QuestionActualValidAnswer,
    ]),
  ],
  providers: [QuestionsService],
  controllers: [QuestionsController],
  exports: [QuestionsService],
})
export class QuestionsModule {}
