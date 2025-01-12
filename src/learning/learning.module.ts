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
import { ExamTemplateSectionsController } from './controllers/exam-template-sections.controller';
import { ExamTemplateSectionsService } from './services/exam-template-sections.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LearningInstitution,
      InstructionalCourse,
      ExamTemplate,
      ExamTemplateSection,
      ExamTemplateSectionQuestion,
    ]),
  ],
  controllers: [
    LearningInstitutionsController,
    InstructionalCoursesController,
    ExamTemplateSectionsController,
  ],
  providers: [
    LearningInstitutionsService,
    InstructionalCoursesService,
    ExamTemplateSectionsService,
  ],
  exports: [
    LearningInstitutionsService,
    InstructionalCoursesService,
    ExamTemplateSectionsService,
  ],
})
export class LearningModule {}
