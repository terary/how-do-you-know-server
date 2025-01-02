import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../../questions/entities/question.entity';

type QuestionType = 'text' | 'multiple-choice' | 'true-false';

interface QuestionData {
  title: string;
  content: string;
  tags: string[];
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
}

@Injectable()
export class QuestionSeeder {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async seed() {
    const questions: QuestionData[] = [
      {
        title: 'Basic Programming Concepts',
        content: 'What is the difference between let and const in JavaScript?',
        tags: ['javascript', 'programming-basics'],
        type: 'text',
        correctAnswer:
          'let allows reassignment, const does not allow reassignment of the variable.',
      },
      {
        title: 'Multiple Choice Test',
        content: 'Which of the following is NOT a JavaScript data type?',
        tags: ['javascript', 'data-types'],
        type: 'multiple-choice',
        options: ['string', 'integer', 'boolean', 'undefined'],
        correctAnswer: 'integer',
      },
      {
        title: 'True/False Question',
        content: 'JavaScript is a statically typed language.',
        tags: ['javascript', 'language-features'],
        type: 'true-false',
        options: ['true', 'false'],
        correctAnswer: 'false',
      },
    ];

    for (const questionData of questions) {
      const existingQuestion = await this.questionRepository.findOne({
        where: { title: questionData.title },
      });

      if (!existingQuestion) {
        const question = this.questionRepository.create(questionData);
        await this.questionRepository.save(question);
      }
    }
  }
}
