import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ExamTemplatesService } from '../services/exam-templates.service';
import { ExamTemplate } from '../entities/exam-template.entity';
import { ExamTemplateSection } from '../entities/exam-template-section.entity';
import { ExamTemplateSectionQuestion } from '../entities/exam-template-section-question.entity';
import { CreateExamTemplateDto } from '../dto/create-exam-template.dto';
import { UpdateExamTemplateDto } from '../dto/update-exam-template.dto';
import { CreateExamTemplateSectionDto } from '../dto/create-exam-template-section.dto';
import { UpdateExamTemplateSectionDto } from '../dto/update-exam-template-section.dto';
import {
  AddQuestionToSectionDto,
  RemoveQuestionFromSectionDto,
} from '../dto/exam-template-section-question.dto';

@ApiTags('exam-templates')
@Controller('exam-templates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExamTemplatesController {
  constructor(private readonly examTemplatesService: ExamTemplatesService) {}

  // Exam Template Endpoints
  @Post()
  @ApiOperation({ summary: 'Create a new exam template' })
  @ApiResponse({
    status: 201,
    description: 'The exam template has been created',
    type: ExamTemplate,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createTemplate(
    @Body() data: CreateExamTemplateDto,
    @Request() req,
  ): Promise<ExamTemplate> {
    return this.examTemplatesService.createTemplate(data, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exam templates' })
  @ApiResponse({
    status: 200,
    description: 'List of exam templates',
    type: [ExamTemplate],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllTemplates(): Promise<ExamTemplate[]> {
    return this.examTemplatesService.findAllTemplates();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an exam template by ID' })
  @ApiParam({ name: 'id', description: 'ID of the exam template' })
  @ApiResponse({
    status: 200,
    description: 'The exam template',
    type: ExamTemplate,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Exam template not found' })
  findTemplateById(@Param('id') id: string): Promise<ExamTemplate> {
    return this.examTemplatesService.findTemplateById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an exam template' })
  @ApiParam({ name: 'id', description: 'ID of the exam template' })
  @ApiResponse({
    status: 200,
    description: 'The exam template has been updated',
    type: ExamTemplate,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Exam template not found' })
  updateTemplate(
    @Param('id') id: string,
    @Body() data: UpdateExamTemplateDto,
  ): Promise<ExamTemplate> {
    return this.examTemplatesService.updateTemplate(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an exam template' })
  @ApiParam({ name: 'id', description: 'ID of the exam template' })
  @ApiResponse({
    status: 200,
    description: 'The exam template has been deleted',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Exam template not found' })
  removeTemplate(@Param('id') id: string): Promise<void> {
    return this.examTemplatesService.removeTemplate(id);
  }

  // Section Endpoints
  @Post('sections')
  @ApiOperation({ summary: 'Create a new exam template section' })
  @ApiResponse({
    status: 201,
    description: 'The section has been created',
    type: ExamTemplateSection,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createSection(
    @Body() data: CreateExamTemplateSectionDto,
  ): Promise<ExamTemplateSection> {
    return this.examTemplatesService.createSection(data);
  }

  @Get('sections/:id')
  @ApiOperation({ summary: 'Get an exam template section by ID' })
  @ApiParam({ name: 'id', description: 'ID of the exam template section' })
  @ApiResponse({
    status: 200,
    description: 'The section',
    type: ExamTemplateSection,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Section not found' })
  findSectionById(@Param('id') id: string): Promise<ExamTemplateSection> {
    return this.examTemplatesService.findSectionById(id);
  }

  @Put('sections/:id')
  @ApiOperation({ summary: 'Update an exam template section' })
  @ApiParam({ name: 'id', description: 'ID of the exam template section' })
  @ApiResponse({
    status: 200,
    description: 'The section has been updated',
    type: ExamTemplateSection,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Section not found' })
  updateSection(
    @Param('id') id: string,
    @Body() data: UpdateExamTemplateSectionDto,
  ): Promise<ExamTemplateSection> {
    return this.examTemplatesService.updateSection(id, data);
  }

  @Delete('sections/:id')
  @ApiOperation({ summary: 'Delete an exam template section' })
  @ApiParam({ name: 'id', description: 'ID of the exam template section' })
  @ApiResponse({ status: 200, description: 'The section has been deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Section not found' })
  removeSection(@Param('id') id: string): Promise<void> {
    return this.examTemplatesService.removeSection(id);
  }

  // Section Questions Endpoints
  @Post('sections/:id/questions')
  @ApiOperation({ summary: 'Add a question to a section' })
  @ApiParam({ name: 'id', description: 'ID of the exam template section' })
  @ApiResponse({
    status: 201,
    description: 'The question has been added to the section',
    type: ExamTemplateSectionQuestion,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Section not found' })
  addQuestionToSection(
    @Param('id') id: string,
    @Body() data: AddQuestionToSectionDto,
  ): Promise<ExamTemplateSectionQuestion> {
    return this.examTemplatesService.addQuestionToSection(id, data);
  }

  @Delete('sections/:id/questions')
  @ApiOperation({ summary: 'Remove a question from a section' })
  @ApiParam({ name: 'id', description: 'ID of the exam template section' })
  @ApiResponse({
    status: 200,
    description: 'The question has been removed from the section',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Question or section not found' })
  removeQuestionFromSection(
    @Param('id') id: string,
    @Body() data: RemoveQuestionFromSectionDto,
  ): Promise<void> {
    return this.examTemplatesService.removeQuestionFromSection(
      id,
      data.question_template_id,
    );
  }

  @Get('sections/:id/questions')
  @ApiOperation({ summary: 'Get all questions in a section' })
  @ApiParam({ name: 'id', description: 'ID of the exam template section' })
  @ApiResponse({
    status: 200,
    description: 'List of questions in the section',
    type: [ExamTemplateSectionQuestion],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Section not found' })
  getQuestionsForSection(
    @Param('id') id: string,
  ): Promise<ExamTemplateSectionQuestion[]> {
    return this.examTemplatesService.getQuestionsForSection(id);
  }
}
