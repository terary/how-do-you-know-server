import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  ExamInstance,
  ExamInstanceStatus,
  ExamInstanceType,
} from '../entities/exam-instance.entity';
import {
  ExamInstanceSection,
  SectionStatus,
} from '../entities/exam-instance-section.entity';
import {
  ExamInstanceQuestion,
  QuestionStatus,
} from '../entities/exam-instance-question.entity';
import { ExamTemplate } from '../entities/exam-template.entity';
import { CreateExamInstanceDto } from '../dto/create-exam-instance.dto';

@Injectable()
export class ExamInstancesService {
  constructor(
    @InjectRepository(ExamInstance)
    private examInstanceRepository: Repository<ExamInstance>,
    @InjectRepository(ExamInstanceSection)
    private sectionRepository: Repository<ExamInstanceSection>,
    @InjectRepository(ExamInstanceQuestion)
    private questionRepository: Repository<ExamInstanceQuestion>,
    @InjectRepository(ExamTemplate)
    private templateRepository: Repository<ExamTemplate>,
    private dataSource: DataSource,
  ) {}

  async createInstance(
    userId: string,
    data: CreateExamInstanceDto,
  ): Promise<ExamInstance> {
    const template = await this.templateRepository.findOne({
      where: { id: data.template_id },
      relations: ['sections', 'sections.questions'],
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    if (!template.is_published) {
      throw new BadRequestException(
        'Cannot create instance from unpublished template',
      );
    }

    // Start a transaction to create the instance and all its components
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create the exam instance
      const instance = this.examInstanceRepository.create({
        ...data,
        user_id: userId,
        status: ExamInstanceStatus.SCHEDULED,
      });

      const savedInstance = await queryRunner.manager.save(instance);

      // Create sections
      for (const templateSection of template.sections) {
        const section = this.sectionRepository.create({
          exam_instance_id: savedInstance.id,
          template_section_id: templateSection.id,
          position: templateSection.position,
          time_limit_seconds: templateSection.timeLimitSeconds,
        });

        const savedSection = await queryRunner.manager.save(section);

        // Create questions
        const questions = templateSection.questions.map((templateQuestion) =>
          this.questionRepository.create({
            section_id: savedSection.id,
            template_question_id: templateQuestion.id,
            position: templateQuestion.position,
          }),
        );

        await queryRunner.manager.save(questions);
      }

      await queryRunner.commitTransaction();
      return this.findInstanceById(savedInstance.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findInstanceById(id: string): Promise<ExamInstance> {
    const instance = await this.examInstanceRepository.findOne({
      where: { id },
      relations: [
        'template',
        'sections',
        'sections.questions',
        'sections.templateSection',
        'sections.questions.templateQuestion',
      ],
    });

    if (!instance) {
      throw new NotFoundException('Exam instance not found');
    }

    return instance;
  }

  async startExam(userId: string, instanceId: string): Promise<ExamInstance> {
    const instance = await this.findInstanceById(instanceId);

    if (instance.user_id !== userId) {
      throw new ForbiddenException('Not authorized to access this exam');
    }

    if (instance.status !== ExamInstanceStatus.SCHEDULED) {
      throw new BadRequestException('Exam is not in scheduled state');
    }

    const now = new Date();
    if (now < instance.start_date || now > instance.end_date) {
      throw new BadRequestException('Exam is not available at this time');
    }

    instance.status = ExamInstanceStatus.IN_PROGRESS;
    instance.started_at = now;

    return this.examInstanceRepository.save(instance);
  }

  async submitAnswer(
    userId: string,
    instanceId: string,
    questionId: string,
    answer: any,
  ): Promise<ExamInstanceQuestion> {
    const instance = await this.findInstanceById(instanceId);

    if (instance.user_id !== userId) {
      throw new ForbiddenException('Not authorized to access this exam');
    }

    if (instance.status !== ExamInstanceStatus.IN_PROGRESS) {
      throw new BadRequestException('Exam is not in progress');
    }

    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: ['section', 'templateQuestion'],
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (question.section.exam_instance_id !== instanceId) {
      throw new BadRequestException(
        'Question does not belong to this exam instance',
      );
    }

    // TODO: Implement answer validation and scoring logic based on question type
    question.student_answer = answer;
    question.status = QuestionStatus.ANSWERED;
    question.answered_at = new Date();

    return this.questionRepository.save(question);
  }

  async completeSection(
    userId: string,
    instanceId: string,
    sectionId: string,
  ): Promise<ExamInstanceSection> {
    const instance = await this.findInstanceById(instanceId);

    if (instance.user_id !== userId) {
      throw new ForbiddenException('Not authorized to access this exam');
    }

    const section = await this.sectionRepository.findOne({
      where: { id: sectionId, exam_instance_id: instanceId },
    });

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    if (section.status === SectionStatus.COMPLETED) {
      throw new BadRequestException('Section is already completed');
    }

    section.status = SectionStatus.COMPLETED;
    section.completed_at = new Date();

    return this.sectionRepository.save(section);
  }

  async completeExam(
    userId: string,
    instanceId: string,
  ): Promise<ExamInstance> {
    const instance = await this.findInstanceById(instanceId);

    if (instance.user_id !== userId) {
      throw new ForbiddenException('Not authorized to access this exam');
    }

    if (instance.status !== ExamInstanceStatus.IN_PROGRESS) {
      throw new BadRequestException('Exam is not in progress');
    }

    instance.status = ExamInstanceStatus.COMPLETED;
    instance.completed_at = new Date();

    return this.examInstanceRepository.save(instance);
  }

  async addNote(
    userId: string,
    instanceId: string,
    sectionId: string,
    note: string,
  ): Promise<ExamInstance> {
    const instance = await this.findInstanceById(instanceId);

    if (instance.user_id !== userId) {
      throw new ForbiddenException('Not authorized to access this exam');
    }

    if (!instance.user_notes) {
      instance.user_notes = [];
    }

    instance.user_notes.push({
      section_id: sectionId,
      note,
      created_at: new Date(),
    });

    return this.examInstanceRepository.save(instance);
  }

  async findUserInstances(userId: string): Promise<ExamInstance[]> {
    return this.examInstanceRepository.find({
      where: { user_id: userId },
      relations: ['template'],
      order: {
        created_at: 'DESC',
      },
    });
  }

  async addQuestionNote(
    userId: string,
    instanceId: string,
    questionId: string,
    note: string,
  ): Promise<ExamInstanceQuestion> {
    const instance = await this.findInstanceById(instanceId);

    if (instance.user_id !== userId) {
      throw new ForbiddenException('Not authorized to access this exam');
    }

    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: ['section'],
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (question.section.exam_instance_id !== instanceId) {
      throw new BadRequestException(
        'Question does not belong to this exam instance',
      );
    }

    if (!question.user_notes) {
      question.user_notes = [];
    }

    question.user_notes.push({
      note,
      created_at: new Date(),
    });

    return this.questionRepository.save(question);
  }

  async getQuestionNotes(
    userId: string,
    instanceId: string,
    questionId: string,
  ): Promise<{ note: string; created_at: Date }[]> {
    const instance = await this.findInstanceById(instanceId);

    if (instance.user_id !== userId) {
      throw new ForbiddenException('Not authorized to access this exam');
    }

    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: ['section'],
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (question.section.exam_instance_id !== instanceId) {
      throw new BadRequestException(
        'Question does not belong to this exam instance',
      );
    }

    return question.user_notes || [];
  }
}
