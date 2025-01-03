import { Injectable } from '@nestjs/common';
import { UserSeeder } from './user.seeder';
import { QuestionTemplateSeeder } from './question-template.seeder';

@Injectable()
export class SeederService {
  constructor(
    private readonly userSeeder: UserSeeder,
    private readonly questionTemplateSeeder: QuestionTemplateSeeder,
  ) {}

  async seed() {
    await this.userSeeder.seed();
    await this.questionTemplateSeeder.seed();
  }
}
