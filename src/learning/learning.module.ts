import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningInstitution } from './entities/learning-institution.entity';
import { InstructionalCourse } from './entities/instructional-course.entity';
import { ExamTemplate } from './entities/exam-template.entity';
import { ExamTemplateSection } from './entities/exam-template-section.entity';
import { ExamTemplateSectionQuestion } from './entities/exam-template-section-question.entity';
import { LearningInstitutionsController } from './controllers/learning-institutions.controller';
import { LearningInstitutionsService } from './services/learning-institutions.service';
import { ExamTemplatesController } from './controllers/exam-templates.controller';
import { ExamTemplatesService } from './services/exam-templates.service';

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
  providers: [LearningInstitutionsService, ExamTemplatesService],
  controllers: [LearningInstitutionsController, ExamTemplatesController],
  exports: [LearningInstitutionsService, ExamTemplatesService],
})
export class LearningModule {}
