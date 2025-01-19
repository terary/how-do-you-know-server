import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ExamTemplate,
  ExamExclusivityType,
} from '../../learning/entities/exam-template.entity';
import { ExamTemplateSection } from '../../learning/entities/exam-template-section.entity';
import { ExamTemplateSectionQuestion } from '../../learning/entities/exam-template-section-question.entity';
import { InstructionalCourse } from '../../learning/entities/instructional-course.entity';
import { QuestionTemplate } from '../../questions/entities/question-template.entity';

@Injectable()
export class ExamTemplateSeeder {
  private readonly logger = new Logger(ExamTemplateSeeder.name);

  constructor(
    @InjectRepository(ExamTemplate)
    private readonly examTemplateRepository: Repository<ExamTemplate>,
    @InjectRepository(ExamTemplateSection)
    private readonly sectionRepository: Repository<ExamTemplateSection>,
    @InjectRepository(ExamTemplateSectionQuestion)
    private readonly sectionQuestionRepository: Repository<ExamTemplateSectionQuestion>,
    @InjectRepository(InstructionalCourse)
    private readonly courseRepository: Repository<InstructionalCourse>,
    @InjectRepository(QuestionTemplate)
    private readonly questionTemplateRepository: Repository<QuestionTemplate>,
  ) {}

  async seed() {
    const existingCount = await this.examTemplateRepository.count();
    if (existingCount > 0) {
      this.logger.log('Exam templates already exist, skipping seeding');
      return;
    }

    const totalTemplates = 10;
    const templatesWithTags = Math.floor(totalTemplates * 0.8); // 80% will have tags
    const templates: ExamTemplate[] = [];

    for (let i = 0; i < totalTemplates; i++) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 14); // Start in two weeks

      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1); // One month availability

      const template = this.examTemplateRepository.create({
        name: `Exam Template ${i + 1}`,
        description: `Description for exam template ${i + 1}`,
        course_id: 'default-course-id',
        created_by: 'system',
        availability_start_date: startDate,
        availability_end_date: endDate,
        version: 1,
        is_published: true,
        examExclusivityType: ExamExclusivityType.EXAM_PRACTICE_BOTH,
        user_defined_tags:
          i < templatesWithTags ? `exams:tag${i + 1} exams:common` : '',
      });

      templates.push(template);
    }

    await this.examTemplateRepository.save(templates);
    this.logger.log(`Created ${templates.length} exam templates`);
  }
}
