import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionTemplate } from '../../questions/entities/question-template.entity';
import { FodderPool } from '../../questions/entities/fodder-pool.entity';
import { User } from '../../users/entities/user.entity';
import { TUserPromptType, TUserResponseType } from '../../questions/types';
import { QuestionTemplateMedia } from '../../questions/entities/question-template-media.entity';
import { QuestionTemplateValidAnswer } from '../../questions/entities/question-template-valid-answer.entity';
import { QuestionDifficulty } from '../../questions/entities/question-template.entity';

@Injectable()
export class QuestionTemplateSeeder {
  constructor(
    @InjectRepository(QuestionTemplate)
    private readonly questionTemplateRepository: Repository<QuestionTemplate>,
    @InjectRepository(FodderPool)
    private readonly fodderPoolRepository: Repository<FodderPool>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(QuestionTemplateMedia)
    private readonly mediaRepository: Repository<QuestionTemplateMedia>,
    @InjectRepository(QuestionTemplateValidAnswer)
    private readonly validAnswerRepository: Repository<QuestionTemplateValidAnswer>,
  ) {}

  async seed() {
    // Find admin user using query builder
    const adminUser = await this.userRepository
      .createQueryBuilder('user')
      .where(':role = ANY(user.roles)', { role: 'admin:exams' })
      .getOne();

    if (!adminUser) {
      throw new Error(
        'Admin user not found. Please ensure the user seeder has run and created an admin user with the admin:exams role.',
      );
    }

    // Create fodder pools
    const birthdayPool = await this.fodderPoolRepository.save(
      this.fodderPoolRepository.create({
        name: 'Famous Birthdays',
        description: "Collection of famous people's birthdays",
        created_by: adminUser.id,
        items: [
          { text: 'January 27, 1756', created_by: adminUser.id }, // Mozart
          { text: 'March 21, 1685', created_by: adminUser.id }, // Bach
          { text: 'May 7, 1840', created_by: adminUser.id }, // Tchaikovsky
          { text: 'December 16, 1770', created_by: adminUser.id }, // Beethoven
          { text: 'March 1, 1810', created_by: adminUser.id }, // Chopin
          { text: 'March 28, 1986', created_by: adminUser.id }, // Lady Gaga
          { text: 'May 13, 1950', created_by: adminUser.id }, // Stevie Wonder
          { text: 'September 23, 1926', created_by: adminUser.id }, // John Coltrane
        ],
      }),
    );

    const capitalCitiesPool = await this.fodderPoolRepository.save(
      this.fodderPoolRepository.create({
        name: 'World Capital Cities',
        description: 'Capital cities from around the world',
        created_by: adminUser.id,
        items: [
          { text: 'Paris', created_by: adminUser.id },
          { text: 'London', created_by: adminUser.id },
          { text: 'Tokyo', created_by: adminUser.id },
          { text: 'Berlin', created_by: adminUser.id },
          { text: 'Rome', created_by: adminUser.id },
          { text: 'Madrid', created_by: adminUser.id },
          { text: 'Moscow', created_by: adminUser.id },
          { text: 'Beijing', created_by: adminUser.id },
          { text: 'Ottawa', created_by: adminUser.id },
          { text: 'Canberra', created_by: adminUser.id },
        ],
      }),
    );

    // Create question templates
    const templates = [
      {
        userPromptType: 'text' as TUserPromptType,
        userResponseType: 'multiple-choice-4' as TUserResponseType,
        exclusivityType: 'exam-practice-both' as const,
        userPromptText: 'When was Wolfgang Amadeus Mozart born?',
        created_by: adminUser.id,
        difficulty: QuestionDifficulty.MEDIUM,
        topics: ['music', 'history', 'classical'],
        fodderPool: birthdayPool,
        answers: [{ text: 'January 27, 1756' }],
      },
      {
        userPromptType: 'text' as TUserPromptType,
        userResponseType: 'true-false' as TUserResponseType,
        exclusivityType: 'practice-only' as const,
        userPromptText: 'Mozart was born in the 18th century.',
        created_by: adminUser.id,
        difficulty: QuestionDifficulty.EASY,
        topics: ['music', 'history'],
        answers: [{ booleanValue: true }],
      },
      {
        userPromptType: 'multimedia' as TUserPromptType,
        userResponseType: 'multiple-choice-4' as TUserResponseType,
        exclusivityType: 'exam-only' as const,
        instructionText:
          "Listen to this musical piece and identify the composer's birthplace.",
        created_by: adminUser.id,
        difficulty: QuestionDifficulty.HARD,
        topics: ['music', 'geography'],
        fodderPool: capitalCitiesPool,
        mediaItems: [
          {
            mediaContentType: 'audio/mpeg' as const,
            height: 0,
            width: 0,
            url: 'https://example.com/mozart-symphony-40.mp3',
            specialInstructionText: 'Listen carefully to the first movement.',
            duration: 180,
          },
        ],
        answers: [{ text: 'Salzburg' }],
      },
      {
        userPromptType: 'text' as TUserPromptType,
        userResponseType: 'free-text-255' as TUserResponseType,
        exclusivityType: 'exam-practice-both' as const,
        userPromptText: "Name three of Mozart's most famous operas.",
        created_by: adminUser.id,
        difficulty: QuestionDifficulty.HARD,
        topics: ['music', 'opera'],
        answers: [
          { text: 'The Magic Flute' },
          { text: 'Don Giovanni' },
          { text: 'The Marriage of Figaro' },
        ],
      },
    ];

    for (const templateData of templates) {
      const { answers, mediaItems, fodderPool, ...templateFields } =
        templateData;

      const existingTemplate = await this.questionTemplateRepository.findOne({
        where: {
          userPromptText: templateFields.userPromptText,
          instructionText: templateFields.instructionText,
        },
      });

      if (!existingTemplate) {
        // Create the template
        const template = await this.questionTemplateRepository.save(
          this.questionTemplateRepository.create(templateFields),
        );

        // Create media if any
        if (mediaItems) {
          for (const mediaItem of mediaItems) {
            await this.mediaRepository.save(
              this.mediaRepository.create({
                ...mediaItem,
                template_id: template.id,
              }),
            );
          }
        }

        // Create valid answers
        for (const answer of answers) {
          await this.validAnswerRepository.save(
            this.validAnswerRepository.create({
              ...answer,
              template_id: template.id,
            }),
          );
        }
      }
    }
  }
}
