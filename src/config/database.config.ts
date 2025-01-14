import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { QuestionTemplate } from '../questions/entities/question-template.entity';
import { QuestionTemplateMedia } from '../questions/entities/question-template-media.entity';
import { QuestionTemplateValidAnswer } from '../questions/entities/question-template-valid-answer.entity';
import { FodderPool } from '../questions/entities/fodder-pool.entity';
import { FodderItem } from '../questions/entities/fodder-item.entity';
import { QuestionActual } from '../questions/entities/question-actual.entity';
import { QuestionActualChoice } from '../questions/entities/question-actual-choice.entity';
import { QuestionActualValidAnswer } from '../questions/entities/question-actual-valid-answer.entity';
import { ExamTemplate } from '../learning/entities/exam-template.entity';
import { ExamTemplateSection } from '../learning/entities/exam-template-section.entity';
import { ExamTemplateSectionQuestion } from '../learning/entities/exam-template-section-question.entity';
import { InstructionalCourse } from '../learning/entities/instructional-course.entity';
import { LearningInstitution } from '../learning/entities/learning-institution.entity';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: [
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
    InstructionalCourse,
    LearningInstitution,
  ],
  synchronize: configService.get('NODE_ENV') === 'development',
  logging: configService.get('NODE_ENV') === 'development',
});
