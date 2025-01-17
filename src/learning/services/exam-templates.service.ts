import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ExamTemplate } from '../entities/exam-template.entity';
import { ExamTemplateSection } from '../entities/exam-template-section.entity';
import { ExamTemplateSectionQuestion } from '../entities/exam-template-section-question.entity';
import { CreateExamTemplateDto } from '../dto/create-exam-template.dto';
import { UpdateExamTemplateDto } from '../dto/update-exam-template.dto';
import { CreateExamTemplateSectionDto } from '../dto/create-exam-template-section.dto';
import { UpdateExamTemplateSectionDto } from '../dto/update-exam-template-section.dto';
import { AddQuestionToSectionDto } from '../dto/exam-template-section-question.dto';
import { ExamTemplateValidationService } from './exam-template-validation.service';
import { PreviewFormat, PreviewResponse } from '../dto/preview-template.dto';
import * as handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ExamTemplatesService {
  constructor(
    @InjectRepository(ExamTemplate)
    private examTemplateRepository: Repository<ExamTemplate>,
    @InjectRepository(ExamTemplateSection)
    private sectionRepository: Repository<ExamTemplateSection>,
    @InjectRepository(ExamTemplateSectionQuestion)
    private sectionQuestionRepository: Repository<ExamTemplateSectionQuestion>,
    private validationService: ExamTemplateValidationService,
  ) {}

  // Exam Template CRUD
  async createTemplate(
    data: CreateExamTemplateDto,
    userId: string,
  ): Promise<ExamTemplate> {
    const template = this.examTemplateRepository.create({
      ...data,
      created_by: userId,
    });
    return this.examTemplateRepository.save(template);
  }

  async findAllTemplates(): Promise<ExamTemplate[]> {
    return this.examTemplateRepository.find({
      relations: [
        'sections',
        'sections.questions',
        'sections.questions.questionTemplate',
      ],
    });
  }

  async findTemplateById(id: string): Promise<ExamTemplate> {
    const template = await this.examTemplateRepository.findOne({
      where: { id },
      relations: [
        'sections',
        'sections.questions',
        'sections.questions.questionTemplate',
      ],
    });

    if (!template) {
      throw new NotFoundException('Exam template not found');
    }

    return template;
  }

  async updateTemplate(
    id: string,
    data: UpdateExamTemplateDto,
  ): Promise<ExamTemplate> {
    await this.examTemplateRepository.update(id, data);
    const template = await this.findTemplateById(id);

    const validationResult = this.validationService.validateTemplate(
      template,
      true,
    );
    if (!validationResult.isValid) {
      throw new BadRequestException({
        message: 'Template validation failed',
        errors: validationResult.errors,
      });
    }

    return template;
  }

  async validateTemplate(id: string): Promise<void> {
    const template = await this.findTemplateById(id);
    const validationResult = this.validationService.validateTemplate(
      template,
      true,
    );
    if (!validationResult.isValid) {
      throw new BadRequestException({
        message: 'Template validation failed',
        errors: validationResult.errors,
      });
    }
  }

  async removeTemplate(id: string): Promise<void> {
    const result = await this.examTemplateRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Exam template not found');
    }
  }

  // Section CRUD
  async createSection(
    data: CreateExamTemplateSectionDto,
  ): Promise<ExamTemplateSection> {
    const section = this.sectionRepository.create(data);
    return this.sectionRepository.save(section);
  }

  async findSectionById(id: string): Promise<ExamTemplateSection> {
    const section = await this.sectionRepository.findOne({
      where: { id },
      relations: ['examTemplate'],
    });
    if (!section) {
      throw new NotFoundException('Exam template section not found');
    }
    return section;
  }

  async updateSection(
    id: string,
    data: UpdateExamTemplateSectionDto,
  ): Promise<ExamTemplateSection> {
    await this.sectionRepository.update(id, data);
    return this.findSectionById(id);
  }

  async removeSection(id: string): Promise<void> {
    const result = await this.sectionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Exam template section not found');
    }
  }

  // Section Questions Management
  async addQuestionToSection(
    sectionId: string,
    data: AddQuestionToSectionDto,
  ): Promise<ExamTemplateSectionQuestion> {
    const section = await this.findSectionById(sectionId);

    const existingQuestion = await this.sectionQuestionRepository.findOne({
      where: {
        section_id: sectionId,
        question_template_id: data.question_template_id,
      },
    });

    if (existingQuestion) {
      return existingQuestion;
    }

    const sectionQuestion = this.sectionQuestionRepository.create({
      section_id: sectionId,
      question_template_id: data.question_template_id,
    });

    return this.sectionQuestionRepository.save(sectionQuestion);
  }

  async removeQuestionFromSection(
    sectionId: string,
    questionTemplateId: string,
  ): Promise<void> {
    const result = await this.sectionQuestionRepository.delete({
      section_id: sectionId,
      question_template_id: questionTemplateId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Question not found in section');
    }
  }

  async getQuestionsForSection(
    sectionId: string,
  ): Promise<ExamTemplateSectionQuestion[]> {
    return this.sectionQuestionRepository.find({
      where: { section_id: sectionId },
      relations: ['questionTemplate'],
    });
  }

  async bulkAddQuestionsToSection(
    sectionId: string,
    questionIds: string[],
  ): Promise<ExamTemplateSection> {
    const section = await this.sectionRepository.findOne({
      where: { id: sectionId },
      relations: ['examTemplate'],
    });

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    const questions = questionIds.map((questionId, index) => {
      return this.sectionQuestionRepository.create({
        section_id: sectionId,
        question_template_id: questionId,
        position: index + 1,
      });
    });

    await this.sectionQuestionRepository.save(questions);
    return this.getSectionWithQuestions(sectionId);
  }

  async bulkRemoveQuestionsFromSection(
    sectionId: string,
    questionIds: string[],
  ): Promise<void> {
    const section = await this.sectionRepository.findOne({
      where: { id: sectionId },
      relations: ['examTemplate'],
    });

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    await this.sectionQuestionRepository.delete({
      section_id: sectionId,
      question_template_id: In(questionIds),
    });
  }

  async reorderSectionQuestions(
    sectionId: string,
    questionPositions: { questionId: string; position: number }[],
  ): Promise<ExamTemplateSection> {
    const section = await this.sectionRepository.findOne({
      where: { id: sectionId },
      relations: ['examTemplate'],
    });

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    const updates = questionPositions.map(({ questionId, position }) => {
      return this.sectionQuestionRepository.update(
        {
          section_id: sectionId,
          question_template_id: questionId,
        },
        { position },
      );
    });

    await Promise.all(updates);
    return this.getSectionWithQuestions(sectionId);
  }

  private async getSectionWithQuestions(
    id: string,
  ): Promise<ExamTemplateSection> {
    const section = await this.sectionRepository
      .createQueryBuilder('section')
      .leftJoinAndSelect('section.examTemplate', 'examTemplate')
      .leftJoinAndSelect('section.questions', 'questions')
      .leftJoinAndSelect('questions.questionTemplate', 'questionTemplate')
      .where('section.id = :id', { id })
      .orderBy('questions.position', 'ASC')
      .getOne();

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    return section;
  }

  async createNewVersion(id: string, userId: string): Promise<ExamTemplate> {
    const template = await this.findTemplateById(id);
    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // Create new template as a copy
    const newTemplate = this.examTemplateRepository.create({
      ...template,
      id: undefined, // Let the database generate a new ID
      version: template.version + 1,
      parent_template_id: template.id,
      is_published: false,
      created_by: userId,
      created_at: undefined,
      updated_at: undefined,
    });

    const savedTemplate = await this.examTemplateRepository.save(newTemplate);

    // Copy sections
    for (const section of template.sections) {
      const newSection = this.sectionRepository.create({
        ...section,
        id: undefined,
        exam_template_id: savedTemplate.id,
        created_at: undefined,
        updated_at: undefined,
      });
      const savedSection = await this.sectionRepository.save(newSection);

      // Copy questions
      if (section.questions) {
        const newQuestions = section.questions.map((question) => ({
          ...question,
          id: undefined,
          section_id: savedSection.id,
          created_at: undefined,
          updated_at: undefined,
        }));
        await this.sectionQuestionRepository.save(newQuestions);
      }
    }

    return this.findTemplateById(savedTemplate.id);
  }

  async publishTemplate(id: string): Promise<ExamTemplate> {
    const template = await this.findTemplateById(id);
    if (!template) {
      throw new NotFoundException('Template not found');
    }

    const validationResult = this.validationService.validateTemplate(
      template,
      true,
    );
    if (!validationResult.isValid) {
      throw new BadRequestException({
        message: 'Cannot publish invalid template',
        errors: validationResult.errors,
      });
    }

    template.is_published = true;
    return this.examTemplateRepository.save(template);
  }

  async getTemplateHistory(id: string): Promise<ExamTemplate[]> {
    const template = await this.findTemplateById(id);
    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // Get the root template
    let rootTemplate = template;
    while (rootTemplate.parent_template_id) {
      const parent = await this.findTemplateById(
        rootTemplate.parent_template_id,
      );
      if (!parent) break;
      rootTemplate = parent;
    }

    // Get all versions in the tree
    return this.examTemplateRepository
      .createQueryBuilder('template')
      .where('template.id = :rootId', { rootId: rootTemplate.id })
      .orWhere('template.parent_template_id = :rootId', {
        rootId: rootTemplate.id,
      })
      .orderBy('template.version', 'DESC')
      .getMany();
  }

  async previewTemplate(
    id: string,
    format: PreviewFormat,
  ): Promise<PreviewResponse> {
    const template = await this.findTemplateById(id);
    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // Calculate metadata
    const metadata = {
      totalQuestions: 0,
      totalSections: template.sections.length,
      totalTime: 0,
      difficultyBreakdown: {},
      topicBreakdown: {},
    };

    template.sections.forEach((section) => {
      metadata.totalQuestions += section.questions.length;
      metadata.totalTime += section.timeLimitSeconds;

      section.questions.forEach((question) => {
        // Update difficulty breakdown
        const difficulty = question.questionTemplate.difficulty;
        metadata.difficultyBreakdown[difficulty] =
          (metadata.difficultyBreakdown[difficulty] || 0) + 1;

        // Update topic breakdown
        question.questionTemplate.topics.forEach((topic) => {
          metadata.topicBreakdown[topic] =
            (metadata.topicBreakdown[topic] || 0) + 1;
        });
      });
    });

    let content: string;
    switch (format) {
      case PreviewFormat.JSON:
        content = JSON.stringify(template, null, 2);
        break;

      case PreviewFormat.HTML:
        content = await this.generateHtmlPreview(template);
        break;

      case PreviewFormat.PDF:
        const htmlContent = await this.generateHtmlPreview(template);
        content = await this.generatePdfFromHtml(htmlContent);
        break;

      default:
        throw new BadRequestException('Unsupported format');
    }

    return {
      format,
      content,
      metadata,
    };
  }

  private async generateHtmlPreview(template: ExamTemplate): Promise<string> {
    // HTML template using handlebars
    const source = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>{{title}}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          .section { margin-bottom: 30px; border: 1px solid #ccc; padding: 20px; }
          .question { margin-bottom: 20px; }
          .metadata { color: #666; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <h1>{{title}}</h1>
        <p>{{description}}</p>
        
        {{#each sections}}
        <div class="section">
          <h2>{{title}}</h2>
          <p>{{instructions}}</p>
          <p class="metadata">Time limit: {{timeLimitSeconds}} seconds</p>
          
          {{#each questions}}
          <div class="question">
            <h3>Question {{position}}</h3>
            <p>{{questionTemplate.userPromptText}}</p>
            {{#if questionTemplate.instructionText}}
            <p><em>{{questionTemplate.instructionText}}</em></p>
            {{/if}}
            
            {{#each questionTemplate.media}}
            <div class="media">
              <img src="{{url}}" alt="Question media" style="max-width: 100%;">
            </div>
            {{/each}}
          </div>
          {{/each}}
        </div>
        {{/each}}
      </body>
      </html>
    `;

    const compiledTemplate = handlebars.compile(source);
    return compiledTemplate(template);
  }

  private async generatePdfFromHtml(html: string): Promise<string> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdf = await page.pdf({ format: 'A4' });
    await browser.close();
    return btoa(pdf.toString()); // I replaced with this as toString accepts 0 arguments.
    //    return pdf.toString('base64'); // ai generated
  }
}
