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
import {
  BulkAddQuestionsDto,
  BulkRemoveQuestionsDto,
  ReorderQuestionsDto,
} from '../dto/bulk-section-operations.dto';
import {
  PreviewFormat,
  PreviewResponse,
  PreviewTemplateDto,
} from '../dto/preview-template.dto';

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
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Section not found' })
  getQuestionsForSection(
    @Param('id') id: string,
  ): Promise<ExamTemplateSectionQuestion[]> {
    return this.examTemplatesService.getQuestionsForSection(id);
  }

  @Post('sections/:id/questions/bulk')
  @ApiOperation({ summary: 'Add multiple questions to a section' })
  @ApiParam({ name: 'id', description: 'ID of the exam template section' })
  @ApiResponse({
    status: 201,
    description: 'The questions have been added to the section',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Section not found' })
  bulkAddQuestionsToSection(
    @Param('id') id: string,
    @Body() data: BulkAddQuestionsDto,
  ): Promise<ExamTemplateSection> {
    return this.examTemplatesService.bulkAddQuestionsToSection(
      id,
      data.questionIds,
    );
  }

  @Delete('sections/:id/questions/bulk')
  @ApiOperation({ summary: 'Remove multiple questions from a section' })
  @ApiParam({ name: 'id', description: 'ID of the exam template section' })
  @ApiResponse({
    status: 200,
    description: 'The questions have been removed from the section',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Section not found' })
  bulkRemoveQuestionsFromSection(
    @Param('id') id: string,
    @Body() data: BulkRemoveQuestionsDto,
  ): Promise<void> {
    return this.examTemplatesService.bulkRemoveQuestionsFromSection(
      id,
      data.questionIds,
    );
  }

  @Put('sections/:id/questions/reorder')
  @ApiOperation({ summary: 'Reorder questions within a section' })
  @ApiParam({ name: 'id', description: 'ID of the exam template section' })
  @ApiResponse({
    status: 200,
    description: 'The questions have been reordered',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Section not found' })
  reorderSectionQuestions(
    @Param('id') id: string,
    @Body() data: ReorderQuestionsDto,
  ): Promise<ExamTemplateSection> {
    return this.examTemplatesService.reorderSectionQuestions(
      id,
      data.questionPositions,
    );
  }

  @Post(':id/validate')
  @ApiOperation({ summary: 'Validate an exam template' })
  @ApiParam({ name: 'id', description: 'ID of the exam template' })
  @ApiResponse({
    status: 200,
    description: 'The template is valid',
  })
  @ApiResponse({ status: 400, description: 'Template validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async validateTemplate(@Param('id') id: string): Promise<void> {
    await this.examTemplatesService.validateTemplate(id);
  }

  @Post(':id/versions')
  @ApiOperation({ summary: 'Create a new version of an exam template' })
  @ApiParam({ name: 'id', description: 'ID of the exam template' })
  @ApiResponse({
    status: 201,
    description: 'New version created',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  createNewVersion(
    @Param('id') id: string,
    @Request() req,
  ): Promise<ExamTemplate> {
    return this.examTemplatesService.createNewVersion(id, req.user.id);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish an exam template' })
  @ApiParam({ name: 'id', description: 'ID of the exam template' })
  @ApiResponse({
    status: 200,
    description: 'Template published',
  })
  @ApiResponse({ status: 400, description: 'Invalid template' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  publishTemplate(@Param('id') id: string): Promise<ExamTemplate> {
    return this.examTemplatesService.publishTemplate(id);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get version history of an exam template' })
  @ApiParam({ name: 'id', description: 'ID of the exam template' })
  @ApiResponse({
    status: 200,
    description: 'Template version history',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  getTemplateHistory(@Param('id') id: string): Promise<ExamTemplate[]> {
    return this.examTemplatesService.getTemplateHistory(id);
  }

  @ApiOperation({ summary: 'Preview an exam template' })
  @ApiResponse({
    status: 200,
    description: 'Template preview',
  })
  @ApiResponse({ status: 400, description: 'Invalid format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @Post(':id/preview')
  previewTemplate(
    @Param('id') id: string,
    @Body() data: PreviewTemplateDto,
  ): Promise<PreviewResponse> {
    return this.examTemplatesService.previewTemplate(id, data.format);
  }
}
