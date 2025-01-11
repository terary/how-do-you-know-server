import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningInstitution } from './entities/learning-institution.entity';
import { InstructionalCourse } from './entities/instructional-course.entity';
import { ExamTemplate } from './entities/exam-template.entity';
import { LearningInstitutionsController } from './controllers/learning-institutions.controller';
import { LearningInstitutionsService } from './services/learning-institutions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LearningInstitution,
      InstructionalCourse,
      ExamTemplate,
    ]),
  ],
  providers: [LearningInstitutionsService],
  controllers: [LearningInstitutionsController],
  exports: [LearningInstitutionsService],
})
export class LearningModule {}
