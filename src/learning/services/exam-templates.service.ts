import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamTemplate } from '../entities/exam-template.entity';
import { ExamTemplateSection } from '../entities/exam-template-section.entity';
import { ExamTemplateSectionQuestion } from '../entities/exam-template-section-question.entity';
import { CreateExamTemplateDto } from '../dto/create-exam-template.dto';
import { UpdateExamTemplateDto } from '../dto/update-exam-template.dto';
import { CreateExamTemplateSectionDto } from '../dto/create-exam-template-section.dto';
import { UpdateExamTemplateSectionDto } from '../dto/update-exam-template-section.dto';
import { AddQuestionToSectionDto } from '../dto/exam-template-section-question.dto';

@Injectable()
export class ExamTemplatesService {
  constructor(
    @InjectRepository(ExamTemplate)
    private examTemplateRepository: Repository<ExamTemplate>,
    @InjectRepository(ExamTemplateSection)
    private sectionRepository: Repository<ExamTemplateSection>,
    @InjectRepository(ExamTemplateSectionQuestion)
    private sectionQuestionRepository: Repository<ExamTemplateSectionQuestion>,
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
      relations: ['sections'],
    });
  }

  async findTemplateById(id: string): Promise<ExamTemplate> {
    const template = await this.examTemplateRepository.findOne({
      where: { id },
      relations: ['sections'],
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
    return this.findTemplateById(id);
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
}
