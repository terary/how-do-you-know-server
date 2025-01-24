import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningInstitution } from './entities/learning-institution.entity';
import { InstructionalCourse } from './entities/instructional-course.entity';
import { ExamTemplate } from './entities/exam-template.entity';
import { ExamTemplateSection } from './entities/exam-template-section.entity';
import { ExamTemplateSectionQuestion } from './entities/exam-template-section-question.entity';
import { LearningInstitutionsController } from './controllers/learning-institutions.controller';
import { LearningInstitutionsService } from './services/learning-institutions.service';
import { InstructionalCoursesController } from './controllers/instructional-courses.controller';
import { InstructionalCoursesService } from './services/instructional-courses.service';
import { ExamTemplatesController } from './controllers/exam-templates.controller';
import { ExamTemplatesService } from './services/exam-templates.service';
import { ExamTemplateSectionsController } from './controllers/exam-template-sections.controller';
import { ExamTemplateSectionsService } from './services/exam-template-sections.service';
import { User } from '../users/entities/user.entity';
import { ExamTemplateValidationService } from './services/exam-template-validation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LearningInstitution,
      InstructionalCourse,
      ExamTemplate,
      ExamTemplateSection,
      ExamTemplateSectionQuestion,
      User,
    ]),
  ],
  controllers: [
    LearningInstitutionsController,
    InstructionalCoursesController,
    ExamTemplatesController,
    ExamTemplateSectionsController,
  ],
  providers: [
    LearningInstitutionsService,
    InstructionalCoursesService,
    ExamTemplatesService,
    ExamTemplateSectionsService,
    ExamTemplateValidationService,
  ],
  exports: [ExamTemplatesService, ExamTemplateValidationService],
})
export class LearningModule {}
