import { Injectable, Logger } from '@nestjs/common';
import { UserSeeder } from './user.seeder';
import { QuestionTemplateSeeder } from './question-template.seeder';
import { LearningInstitutionSeeder } from './learning-institution.seeder';
import { InstructionalCourseSeeder } from './instructional-course.seeder';
import { ExamTemplateSeeder } from './exam-template.seeder';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly userSeeder: UserSeeder,
    private readonly questionTemplateSeeder: QuestionTemplateSeeder,
    private readonly learningInstitutionSeeder: LearningInstitutionSeeder,
    private readonly instructionalCourseSeeder: InstructionalCourseSeeder,
    private readonly examTemplateSeeder: ExamTemplateSeeder,
  ) {}

  async seed() {
    this.logger.log('Starting seeder...');

    // Seed users first as they might be referenced by other entities
    await this.userSeeder.seed();

    // Seed learning institutions before courses
    await this.learningInstitutionSeeder.seed();

    // Seed courses after institutions
    await this.instructionalCourseSeeder.seed();

    // Seed question templates before exam templates
    await this.questionTemplateSeeder.seed();

    // Finally, seed exam templates which depend on courses and questions
    await this.examTemplateSeeder.seed();
  }
}
