import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeederService } from './seeder.service';
import { UserSeeder } from './user.seeder';
import { QuestionTemplateSeeder } from './question-template.seeder';
import { LearningInstitutionSeeder } from './learning-institution.seeder';
import { InstructionalCourseSeeder } from './instructional-course.seeder';
import { ExamTemplateSeeder } from './exam-template.seeder';
import { User } from '../../users/entities/user.entity';
import { QuestionTemplate } from '../../questions/entities/question-template.entity';
import { QuestionTemplateMedia } from '../../questions/entities/question-template-media.entity';
import { QuestionTemplateValidAnswer } from '../../questions/entities/question-template-valid-answer.entity';
import { FodderPool } from '../../questions/entities/fodder-pool.entity';
import { FodderItem } from '../../questions/entities/fodder-item.entity';
import { QuestionActual } from '../../questions/entities/question-actual.entity';
import { QuestionActualChoice } from '../../questions/entities/question-actual-choice.entity';
import { QuestionActualValidAnswer } from '../../questions/entities/question-actual-valid-answer.entity';
import { ExamTemplate } from '../../learning/entities/exam-template.entity';
import { ExamTemplateSection } from '../../learning/entities/exam-template-section.entity';
import { ExamTemplateSectionQuestion } from '../../learning/entities/exam-template-section-question.entity';
import { LearningInstitution } from '../../learning/entities/learning-institution.entity';
import { InstructionalCourse } from '../../learning/entities/instructional-course.entity';
import { getDatabaseConfig } from '../../config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      QuestionTemplate,
      QuestionTemplateMedia,
      QuestionTemplateValidAnswer,
      FodderPool,
      FodderItem,
      QuestionActual,
      QuestionActualChoice,
      QuestionActualValidAnswer,
      ExamTemplate,
      ExamTemplateSection,
      ExamTemplateSectionQuestion,
      LearningInstitution,
      InstructionalCourse,
    ]),
  ],
  providers: [
    SeederService,
    UserSeeder,
    QuestionTemplateSeeder,
    LearningInstitutionSeeder,
    InstructionalCourseSeeder,
    ExamTemplateSeeder,
  ],
  exports: [SeederService],
})
export class SeederModule {}
