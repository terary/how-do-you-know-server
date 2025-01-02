import { Injectable, Logger } from '@nestjs/common';
import { UserSeeder } from './user.seeder';
import { QuestionSeeder } from './question.seeder';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly userSeeder: UserSeeder,
    private readonly questionSeeder: QuestionSeeder,
  ) {}

  async seed() {
    try {
      this.logger.log('Starting database seeding...');

      await this.userSeeder.seed();
      this.logger.log('Users seeded successfully');

      await this.questionSeeder.seed();
      this.logger.log('Questions seeded successfully');

      this.logger.log('Database seeding completed successfully');
    } catch (error) {
      this.logger.error('Database seeding failed!');
      this.logger.error(error);
      throw error;
    }
  }
}
