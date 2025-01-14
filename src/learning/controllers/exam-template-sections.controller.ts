import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ExamTemplateSectionsService } from '../services/exam-template-sections.service';
import { CreateExamTemplateSectionDto } from '../dto/create-exam-template-section.dto';
import { UpdateExamTemplateSectionDto } from '../dto/update-exam-template-section.dto';
import { ExamTemplateSectionDto } from '../dto/exam-template-section.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('exam-template-sections')
@Controller('exam-templates/:examId/sections')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExamTemplateSectionsController {
  constructor(private readonly sectionsService: ExamTemplateSectionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new exam template section' })
  @ApiResponse({
    status: 201,
    description: 'The exam template section has been created',
    type: ExamTemplateSectionDto,
  })
  create(
    @Param('examId') examId: string,
    @Body() createDto: CreateExamTemplateSectionDto,
  ): Promise<ExamTemplateSectionDto> {
    return this.sectionsService.create(examId, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sections for an exam template' })
  @ApiResponse({
    status: 200,
    description: 'List of all sections for the exam template',
    type: [ExamTemplateSectionDto],
  })
  findAll(@Param('examId') examId: string): Promise<ExamTemplateSectionDto[]> {
    return this.sectionsService.findAll(examId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific exam template section' })
  @ApiResponse({
    status: 200,
    description: 'The exam template section',
    type: ExamTemplateSectionDto,
  })
  findOne(
    @Param('examId') examId: string,
    @Param('id') id: string,
  ): Promise<ExamTemplateSectionDto> {
    return this.sectionsService.findOne(examId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an exam template section' })
  @ApiResponse({
    status: 200,
    description: 'The exam template section has been updated',
    type: ExamTemplateSectionDto,
  })
  update(
    @Param('examId') examId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateExamTemplateSectionDto,
  ): Promise<ExamTemplateSectionDto> {
    return this.sectionsService.update(examId, id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an exam template section' })
  @ApiResponse({
    status: 200,
    description: 'The exam template section has been deleted',
  })
  remove(
    @Param('examId') examId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.sectionsService.remove(examId, id);
  }
}
