import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import {
  QuestionTemplate,
  QuestionTemplateMedia,
  QuestionTemplateValidAnswer,
  QuestionActual,
  QuestionActualChoice,
  QuestionActualValidAnswer,
} from './entities';
import { TUserPromptType, TUserResponseType, TMediaContentType } from './types';
import { SearchQuestionsDto } from './dto/search-questions.dto';

type CreateTemplateData = {
  userPromptType: TUserPromptType;
  userResponseType: TUserResponseType;
  exclusivityType: 'exam-only' | 'practice-only' | 'exam-practice-both';
  userPromptText?: string;
  instructionText?: string;
  media?: {
    mediaContentType: TMediaContentType;
    height: number;
    width: number;
    url: string;
    specialInstructionText?: string;
    duration?: number;
    fileSize?: number;
    thumbnailUrl?: string;
  }[];
  validAnswers: {
    text?: string;
    booleanValue?: boolean;
    fodderPoolId?: string;
  }[];
};

type UpdateTemplateData = Partial<CreateTemplateData>;

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(QuestionTemplate)
    private readonly templateRepository: Repository<QuestionTemplate>,
    @InjectRepository(QuestionTemplateMedia)
    private readonly templateMediaRepository: Repository<QuestionTemplateMedia>,
    @InjectRepository(QuestionTemplateValidAnswer)
    private readonly templateAnswerRepository: Repository<QuestionTemplateValidAnswer>,
    @InjectRepository(QuestionActual)
    private readonly actualRepository: Repository<QuestionActual>,
    @InjectRepository(QuestionActualChoice)
    private readonly actualChoiceRepository: Repository<QuestionActualChoice>,
    @InjectRepository(QuestionActualValidAnswer)
    private readonly actualAnswerRepository: Repository<QuestionActualValidAnswer>,
  ) {}

  async findAllTemplates(): Promise<QuestionTemplate[]> {
    return this.templateRepository.find({
      relations: ['media', 'validAnswers'],
    });
  }

  async findTemplateById(id: string): Promise<QuestionTemplate> {
    return this.templateRepository.findOne({
      where: { id },
      relations: ['media', 'validAnswers'],
    });
  }

  async createTemplate(
    data: CreateTemplateData,
    userId: string,
  ): Promise<QuestionTemplate> {
    const template = this.templateRepository.create({
      userPromptType: data.userPromptType,
      userResponseType: data.userResponseType,
      exclusivityType: data.exclusivityType,
      userPromptText: data.userPromptText,
      instructionText: data.instructionText,
      created_by: userId,
    });

    const savedTemplate = await this.templateRepository.save(template);

    if (data.media?.length) {
      const mediaEntities = data.media.map((m) =>
        this.templateMediaRepository.create({
          template_id: savedTemplate.id,
          ...m,
        }),
      );
      await this.templateMediaRepository.save(mediaEntities);
    }

    if (data.validAnswers?.length) {
      const answerEntities = data.validAnswers.map((a) =>
        this.templateAnswerRepository.create({
          template_id: savedTemplate.id,
          ...a,
        }),
      );
      await this.templateAnswerRepository.save(answerEntities);
    }

    return this.findTemplateById(savedTemplate.id);
  }

  async generateActual(
    templateId: string,
    examType: 'practice' | 'live',
    sectionPosition: number,
  ): Promise<QuestionActual> {
    const template = await this.findTemplateById(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // Create the actual question
    const actual = this.actualRepository.create({
      template_id: template.id,
      examType,
      sectionPosition,
      userPromptText: template.userPromptText,
      instructionText: template.instructionText,
    });

    const savedActual = await this.actualRepository.save(actual);

    // Handle multiple choice questions
    if (template.userResponseType === 'multiple-choice-4') {
      const validAnswer = template.validAnswers[0];
      if (!validAnswer) {
        throw new Error('Valid answer not found for multiple choice question');
      }

      // TODO: Implement fodder pool selection logic
      // For now, just use the correct answer and some dummy options
      const choices = [
        { text: validAnswer.text, isCorrect: true, position: 0 },
        { text: 'Dummy Option 1', isCorrect: false, position: 1 },
        { text: 'Dummy Option 2', isCorrect: false, position: 2 },
        { text: 'Dummy Option 3', isCorrect: false, position: 3 },
      ].map((c) =>
        this.actualChoiceRepository.create({
          question_actual_id: savedActual.id,
          ...c,
        }),
      );

      await this.actualChoiceRepository.save(choices);
    }

    // Add valid answers for practice exams
    if (examType === 'practice') {
      const validAnswers = template.validAnswers.map((a) =>
        this.actualAnswerRepository.create({
          question_actual_id: savedActual.id,
          text: a.text,
          booleanValue: a.booleanValue,
        }),
      );

      await this.actualAnswerRepository.save(validAnswers);
    }

    return this.findActualById(savedActual.id);
  }

  async findActualById(id: string): Promise<QuestionActual> {
    return this.actualRepository.findOne({
      where: { id },
      relations: ['choices', 'validAnswers'],
    });
  }

  async updateTemplate(
    id: string,
    data: UpdateTemplateData,
    userId: string,
  ): Promise<QuestionTemplate> {
    const template = await this.findTemplateById(id);
    if (!template) {
      throw new Error('Template not found');
    }

    // Update basic fields
    if (data.userPromptType) template.userPromptType = data.userPromptType;
    if (data.userResponseType)
      template.userResponseType = data.userResponseType;
    if (data.exclusivityType) template.exclusivityType = data.exclusivityType;
    if (data.userPromptText) template.userPromptText = data.userPromptText;
    if (data.instructionText) template.instructionText = data.instructionText;

    // Save the updated template
    const savedTemplate = await this.templateRepository.save(template);

    // Update media if provided
    if (data.media) {
      // Remove existing media
      await this.templateMediaRepository.delete({ template_id: id });

      // Add new media
      const mediaEntities = data.media.map((m) =>
        this.templateMediaRepository.create({
          template_id: savedTemplate.id,
          ...m,
        }),
      );
      await this.templateMediaRepository.save(mediaEntities);
    }

    // Update valid answers if provided
    if (data.validAnswers) {
      // Remove existing answers
      await this.templateAnswerRepository.delete({ template_id: id });

      // Add new answers
      const answerEntities = data.validAnswers.map((a) =>
        this.templateAnswerRepository.create({
          template_id: savedTemplate.id,
          ...a,
        }),
      );
      await this.templateAnswerRepository.save(answerEntities);
    }

    return this.findTemplateById(savedTemplate.id);
  }

  async searchQuestions(
    searchParams: SearchQuestionsDto,
  ): Promise<QuestionTemplate[]> {
    const queryBuilder = this.templateRepository.createQueryBuilder('question');

    if (searchParams.searchTerm) {
      queryBuilder.andWhere(
        '(question.userPromptText ILIKE :searchTerm OR question.instructionText ILIKE :searchTerm)',
        { searchTerm: `%${searchParams.searchTerm}%` },
      );
    }

    if (searchParams.difficulty) {
      queryBuilder.andWhere('question.difficulty = :difficulty', {
        difficulty: searchParams.difficulty,
      });
    }

    if (searchParams.topics && searchParams.topics.length > 0) {
      queryBuilder.andWhere('question.topics && :topics', {
        topics: searchParams.topics,
      });
    }

    if (searchParams.userPromptType) {
      queryBuilder.andWhere('question.userPromptType = :userPromptType', {
        userPromptType: searchParams.userPromptType,
      });
    }

    if (searchParams.userResponseType) {
      queryBuilder.andWhere('question.userResponseType = :userResponseType', {
        userResponseType: searchParams.userResponseType,
      });
    }

    if (searchParams.courseId) {
      queryBuilder
        .innerJoin(
          'exam_template_section_questions',
          'etq',
          'etq.question_template_id = question.id',
        )
        .innerJoin('exam_template_sections', 'ets', 'ets.id = etq.section_id')
        .innerJoin('exam_templates', 'et', 'et.id = ets.exam_template_id')
        .andWhere('et.course_id = :courseId', {
          courseId: searchParams.courseId,
        });
    }

    return queryBuilder
      .leftJoinAndSelect('question.media', 'media')
      .leftJoinAndSelect('question.validAnswers', 'validAnswers')
      .orderBy('question.created_at', 'DESC')
      .getMany();
  }
}
