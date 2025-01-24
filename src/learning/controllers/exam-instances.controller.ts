import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ExamInstancesService } from '../services/exam-instances.service';
import { CreateExamInstanceDto } from '../dto/create-exam-instance.dto';
import { ExamInstance } from '../entities/exam-instance.entity';
import { ExamInstanceQuestion } from '../entities/exam-instance-question.entity';
import { ExamInstanceSection } from '../entities/exam-instance-section.entity';

@ApiTags('exam-instances')
@Controller('exam-instances')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExamInstancesController {
  constructor(private readonly examInstancesService: ExamInstancesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new exam instance' })
  @ApiResponse({
    status: 201,
    description: 'The exam instance has been created',
  })
  async createInstance(
    @Request() req,
    @Body() data: CreateExamInstanceDto,
  ): Promise<ExamInstance> {
    return this.examInstancesService.createInstance(req.user.id, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exam instances for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of exam instances',
  })
  async findUserInstances(@Request() req): Promise<ExamInstance[]> {
    return this.examInstancesService.findUserInstances(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an exam instance by ID' })
  @ApiParam({ name: 'id', description: 'ID of the exam instance' })
  @ApiResponse({
    status: 200,
    description: 'The exam instance',
  })
  async findInstanceById(
    @Request() req,
    @Param('id') id: string,
  ): Promise<ExamInstance> {
    const instance = await this.examInstancesService.findInstanceById(id);
    if (instance.user_id !== req.user.id) {
      throw new ForbiddenException('Not authorized to access this exam');
    }
    return instance;
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start an exam' })
  @ApiParam({ name: 'id', description: 'ID of the exam instance' })
  @ApiResponse({
    status: 200,
    description: 'The exam has been started',
  })
  async startExam(
    @Request() req,
    @Param('id') id: string,
  ): Promise<ExamInstance> {
    return this.examInstancesService.startExam(req.user.id, id);
  }

  @Post(':id/questions/:questionId/answer')
  @ApiOperation({ summary: 'Submit an answer for a question' })
  @ApiParam({ name: 'id', description: 'ID of the exam instance' })
  @ApiParam({ name: 'questionId', description: 'ID of the question' })
  @ApiResponse({
    status: 200,
    description: 'The answer has been submitted',
  })
  async submitAnswer(
    @Request() req,
    @Param('id') id: string,
    @Param('questionId') questionId: string,
    @Body() data: { answer: any },
  ): Promise<ExamInstanceQuestion> {
    return this.examInstancesService.submitAnswer(
      req.user.id,
      id,
      questionId,
      data.answer,
    );
  }

  @Post(':id/sections/:sectionId/complete')
  @ApiOperation({ summary: 'Complete a section' })
  @ApiParam({ name: 'id', description: 'ID of the exam instance' })
  @ApiParam({ name: 'sectionId', description: 'ID of the section' })
  @ApiResponse({
    status: 200,
    description: 'The section has been completed',
  })
  async completeSection(
    @Request() req,
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
  ): Promise<ExamInstanceSection> {
    return this.examInstancesService.completeSection(
      req.user.id,
      id,
      sectionId,
    );
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete an exam' })
  @ApiParam({ name: 'id', description: 'ID of the exam instance' })
  @ApiResponse({
    status: 200,
    description: 'The exam has been completed',
  })
  async completeExam(
    @Request() req,
    @Param('id') id: string,
  ): Promise<ExamInstance> {
    return this.examInstancesService.completeExam(req.user.id, id);
  }

  @Post(':id/sections/:sectionId/notes')
  @ApiOperation({ summary: 'Add a note to a section' })
  @ApiParam({ name: 'id', description: 'ID of the exam instance' })
  @ApiParam({ name: 'sectionId', description: 'ID of the section' })
  @ApiResponse({
    status: 200,
    description: 'The note has been added',
  })
  async addNote(
    @Request() req,
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @Body() data: { note: string },
  ): Promise<ExamInstance> {
    return this.examInstancesService.addNote(
      req.user.id,
      id,
      sectionId,
      data.note,
    );
  }

  @Post(':id/questions/:questionId/notes')
  @ApiOperation({ summary: 'Add a note to a question' })
  @ApiParam({ name: 'id', description: 'ID of the exam instance' })
  @ApiParam({ name: 'questionId', description: 'ID of the question' })
  @ApiResponse({
    status: 200,
    description: 'The note has been added',
    type: ExamInstanceQuestion,
  })
  async addQuestionNote(
    @Request() req,
    @Param('id') id: string,
    @Param('questionId') questionId: string,
    @Body() data: { note: string },
  ): Promise<ExamInstanceQuestion> {
    return this.examInstancesService.addQuestionNote(
      req.user.id,
      id,
      questionId,
      data.note,
    );
  }

  @Get(':id/questions/:questionId/notes')
  @ApiOperation({ summary: 'Get notes for a question' })
  @ApiParam({ name: 'id', description: 'ID of the exam instance' })
  @ApiParam({ name: 'questionId', description: 'ID of the question' })
  @ApiResponse({
    status: 200,
    description: 'List of notes for the question',
    type: [Object],
  })
  async getQuestionNotes(
    @Request() req,
    @Param('id') id: string,
    @Param('questionId') questionId: string,
  ): Promise<{ note: string; created_at: Date }[]> {
    return this.examInstancesService.getQuestionNotes(
      req.user.id,
      id,
      questionId,
    );
  }
}
