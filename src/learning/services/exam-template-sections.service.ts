import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamTemplateSection } from '../entities/exam-template-section.entity';
import { ExamTemplate } from '../entities/exam-template.entity';
import { CreateExamTemplateSectionDto } from '../dto/create-exam-template-section.dto';
import { UpdateExamTemplateSectionDto } from '../dto/update-exam-template-section.dto';
import { ExamTemplateSectionDto } from '../dto/exam-template-section.dto';

@Injectable()
export class ExamTemplateSectionsService {
  constructor(
    @InjectRepository(ExamTemplateSection)
    private readonly sectionRepository: Repository<ExamTemplateSection>,
    @InjectRepository(ExamTemplate)
    private readonly examTemplateRepository: Repository<ExamTemplate>,
  ) {}

  async create(
    examId: string,
    createDto: CreateExamTemplateSectionDto,
  ): Promise<ExamTemplateSectionDto> {
    // Verify exam template exists
    const examTemplate = await this.examTemplateRepository.findOne({
      where: { id: examId },
    });
    if (!examTemplate) {
      throw new NotFoundException(
        `Exam template with ID "${examId}" not found`,
      );
    }

    const section = this.sectionRepository.create({
      ...createDto,
      exam_template_id: examId,
    });
    const saved = await this.sectionRepository.save(section);
    return this.toDto(saved);
  }

  async findAll(examId: string): Promise<ExamTemplateSectionDto[]> {
    // Verify exam template exists
    const examTemplate = await this.examTemplateRepository.findOne({
      where: { id: examId },
    });
    if (!examTemplate) {
      throw new NotFoundException(
        `Exam template with ID "${examId}" not found`,
      );
    }

    const sections = await this.sectionRepository.find({
      where: { exam_template_id: examId },
      order: { position: 'ASC' },
    });
    return sections.map((section) => this.toDto(section));
  }

  async findOne(examId: string, id: string): Promise<ExamTemplateSectionDto> {
    const section = await this.sectionRepository.findOne({
      where: { id, exam_template_id: examId },
    });
    if (!section) {
      throw new NotFoundException(
        `Exam template section with ID "${id}" not found`,
      );
    }
    return this.toDto(section);
  }

  async update(
    examId: string,
    id: string,
    updateDto: UpdateExamTemplateSectionDto,
  ): Promise<ExamTemplateSectionDto> {
    const section = await this.findOne(examId, id);
    await this.sectionRepository.update(id, updateDto);
    return this.findOne(examId, id);
  }

  async remove(examId: string, id: string): Promise<void> {
    const section = await this.findOne(examId, id);
    await this.sectionRepository.delete(id);
  }

  private toDto(entity: ExamTemplateSection): ExamTemplateSectionDto {
    const dto = new ExamTemplateSectionDto();
    Object.assign(dto, entity);
    return dto;
  }
}
