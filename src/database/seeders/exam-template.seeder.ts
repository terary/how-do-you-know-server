import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamTemplate } from '../../learning/entities/exam-template.entity';
import { ExamTemplateSection } from '../../learning/entities/exam-template-section.entity';
import { ExamTemplateSectionQuestion } from '../../learning/entities/exam-template-section-question.entity';
import { InstructionalCourse } from '../../learning/entities/instructional-course.entity';
import { QuestionTemplate } from '../../questions/entities/question-template.entity';
import { Logger } from '@nestjs/common';

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
    this.logger.log('Starting exam template seeding...');

    const courses = await this.courseRepository.find();
    if (courses.length === 0) {
      this.logger.warn('No courses found. Please run course seeder first.');
      return;
    }

    const questionTemplates = await this.questionTemplateRepository.find();
    if (questionTemplates.length === 0) {
      this.logger.warn(
        'No question templates found. Please run question template seeder first.',
      );
      return;
    }

    const examTemplates = [
      {
        name: 'Programming Fundamentals Mid-term',
        description: 'Mid-term exam covering basic programming concepts',
        availability_start_date: new Date('2024-03-15'),
        availability_end_date: new Date('2024-03-20'),
        course: courses[0],
        created_by: 'f390d9c3-0f0e-49e0-9bac-22bcb3730968',
        sections: [
          {
            title: 'Multiple Choice',
            instructions: 'Basic programming concepts',
            position: 1,
            timeLimitSeconds: 1800, // 30 minutes
            questions: [
              {
                question_template: questionTemplates[0],
                position: 1,
              },
              {
                question_template: questionTemplates[1],
                position: 2,
              },
            ],
          },
          {
            title: 'True/False',
            instructions: 'Programming theory',
            position: 2,
            timeLimitSeconds: 1200, // 20 minutes
            questions: [
              {
                question_template: questionTemplates[2],
                position: 1,
              },
            ],
          },
        ],
      },
      {
        name: 'Medical Research Methods Final',
        description: 'Final examination on research methodologies',
        availability_start_date: new Date('2024-06-01'),
        availability_end_date: new Date('2024-06-10'),
        course: courses[1],
        created_by: 'f390d9c3-0f0e-49e0-9bac-22bcb3730968',
        sections: [
          {
            title: 'Research Fundamentals',
            instructions: 'Basic research concepts',
            position: 1,
            timeLimitSeconds: 2700, // 45 minutes
            questions: [
              {
                question_template: questionTemplates[3],
                position: 1,
              },
              {
                question_template: questionTemplates[0],
                position: 2,
              },
            ],
          },
        ],
      },
    ];

    for (const templateData of examTemplates) {
      const existingTemplate = await this.examTemplateRepository.findOne({
        where: {
          name: templateData.name,
          course_id: templateData.course.id,
        },
      });

      let template = existingTemplate;
      if (!existingTemplate) {
        template = await this.examTemplateRepository.save({
          name: templateData.name,
          description: templateData.description,
          course_id: templateData.course.id,
          created_by: templateData.created_by,
          availability_start_date: templateData.availability_start_date,
          availability_end_date: templateData.availability_end_date,
        });

        this.logger.log(
          `Created exam template: ${template.name} for ${templateData.course.name}`,
        );
      } else {
        this.logger.log(
          `Exam template already exists: ${existingTemplate.name}, proceeding to create sections and questions`,
        );
      }

      // Create sections and questions
      for (const sectionData of templateData.sections) {
        const existingSection = await this.sectionRepository.findOne({
          where: {
            title: sectionData.title,
            exam_template_id: template.id,
          },
        });

        if (!existingSection) {
          const { questions, ...sectionInfo } = sectionData;
          const section = this.sectionRepository.create({
            title: sectionInfo.title,
            instructions: sectionInfo.instructions,
            position: sectionInfo.position,
            timeLimitSeconds: sectionInfo.timeLimitSeconds,
            exam_template_id: template.id,
          });
          await this.sectionRepository.save(section);

          // Create section questions
          for (const questionData of questions) {
            const sectionQuestion = this.sectionQuestionRepository.create({
              section_id: section.id,
              question_template_id: questionData.question_template.id,
              position: questionData.position,
            });
            await this.sectionQuestionRepository.save(sectionQuestion);
          }
          this.logger.log(
            `Created section: ${section.title} with ${questions.length} questions`,
          );
        } else {
          this.logger.log(
            `Section already exists: ${existingSection.title}, skipping`,
          );
        }
      }
    }

    this.logger.log('Exam template seeding completed');
  }
}
