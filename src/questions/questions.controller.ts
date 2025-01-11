import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuestionsService } from './questions.service';
import { QuestionTemplate, QuestionActual } from './entities';
import { TUserPromptType, TUserResponseType } from './types';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

class MediaDto {
  @ApiProperty({
    enum: [
      'application/octet-stream',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/*',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/aac',
      'audio/webm',
      'audio/*',
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/avi',
      'video/quicktime',
      'video/*',
    ],
    description:
      'Content type of the media. Use */* types for iframe/embedded content.',
    example: 'video/mp4',
  })
  @IsEnum([
    'application/octet-stream',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/*',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/aac',
    'audio/webm',
    'audio/*',
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/avi',
    'video/quicktime',
    'video/*',
  ])
  mediaContentType:
    | 'application/octet-stream'
    | 'image/jpeg'
    | 'image/png'
    | 'image/gif'
    | 'image/webp'
    | 'image/svg+xml'
    | 'image/*'
    | 'audio/mpeg'
    | 'audio/wav'
    | 'audio/ogg'
    | 'audio/aac'
    | 'audio/webm'
    | 'audio/*'
    | 'video/mp4'
    | 'video/webm'
    | 'video/ogg'
    | 'video/avi'
    | 'video/quicktime'
    | 'video/*';

  @ApiProperty({ description: 'Height of the media in pixels' })
  @IsNumber()
  height: number;

  @ApiProperty({ description: 'Width of the media in pixels' })
  @IsNumber()
  width: number;

  @ApiProperty({ description: 'URL of the media content' })
  @IsUrl()
  url: string;

  @ApiProperty({
    description: 'Special instructions for the media',
    required: false,
  })
  @IsString()
  @IsOptional()
  specialInstructionText?: string;

  @ApiProperty({ description: 'Duration in seconds', required: false })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiProperty({ description: 'File size in bytes', required: false })
  @IsNumber()
  @IsOptional()
  fileSize?: number;

  @ApiProperty({
    description: 'Thumbnail URL for video content',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  thumbnailUrl?: string;
}

class ValidAnswerDto {
  @ApiProperty({ description: 'Text answer', required: false })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiProperty({ description: 'Boolean answer', required: false })
  @IsOptional()
  booleanValue?: boolean;

  @ApiProperty({ description: 'ID of the fodder pool', required: false })
  @IsString()
  @IsOptional()
  fodderPoolId?: string;
}

class CreateTemplateDto {
  @ApiProperty({
    enum: ['text', 'multimedia'],
    description: 'Type of user prompt',
  })
  @IsEnum(['text', 'multimedia'])
  userPromptType: TUserPromptType;

  @ApiProperty({
    enum: ['free-text-255', 'multiple-choice-4', 'true-false'],
    description: 'Type of user response',
  })
  @IsEnum(['free-text-255', 'multiple-choice-4', 'true-false'])
  userResponseType: TUserResponseType;

  @ApiProperty({
    enum: ['exam-only', 'practice-only', 'exam-practice-both'],
    description: 'Question exclusivity type',
  })
  @IsEnum(['exam-only', 'practice-only', 'exam-practice-both'])
  exclusivityType: 'exam-only' | 'practice-only' | 'exam-practice-both';

  @ApiProperty({ description: 'Text of the user prompt', required: false })
  @IsString()
  @IsOptional()
  userPromptText?: string;

  @ApiProperty({ description: 'Instruction text', required: false })
  @IsString()
  @IsOptional()
  instructionText?: string;

  @ApiProperty({ type: [MediaDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  @IsOptional()
  media?: MediaDto[];

  @ApiProperty({ type: [ValidAnswerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValidAnswerDto)
  validAnswers: ValidAnswerDto[];
}

class GenerateActualDto {
  @ApiProperty({ enum: ['practice', 'live'], description: 'Type of exam' })
  @IsEnum(['practice', 'live'])
  examType: 'practice' | 'live';

  @ApiProperty({ description: 'Position in the section' })
  @IsNumber()
  sectionPosition: number;
}

class UpdateTemplateDto {
  @ApiProperty({
    enum: ['text', 'multimedia'],
    description: 'Type of user prompt',
    required: false,
  })
  @IsEnum(['text', 'multimedia'])
  @IsOptional()
  userPromptType?: TUserPromptType;

  @ApiProperty({
    enum: ['free-text-255', 'multiple-choice-4', 'true-false'],
    description: 'Type of user response',
    required: false,
  })
  @IsEnum(['free-text-255', 'multiple-choice-4', 'true-false'])
  @IsOptional()
  userResponseType?: TUserResponseType;

  @ApiProperty({
    enum: ['exam-only', 'practice-only', 'exam-practice-both'],
    description: 'Question exclusivity type',
    required: false,
  })
  @IsEnum(['exam-only', 'practice-only', 'exam-practice-both'])
  @IsOptional()
  exclusivityType?: 'exam-only' | 'practice-only' | 'exam-practice-both';

  @ApiProperty({ description: 'Text of the user prompt', required: false })
  @IsString()
  @IsOptional()
  userPromptText?: string;

  @ApiProperty({ description: 'Instruction text', required: false })
  @IsString()
  @IsOptional()
  instructionText?: string;

  @ApiProperty({ type: [MediaDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  @IsOptional()
  media?: MediaDto[];

  @ApiProperty({ type: [ValidAnswerDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValidAnswerDto)
  @IsOptional()
  validAnswers?: ValidAnswerDto[];
}

@ApiTags('questions')
@Controller('questions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('templates')
  @ApiOperation({ summary: 'Get all question templates' })
  @ApiResponse({
    status: 200,
    description: 'List of all question templates',
    type: [QuestionTemplate],
  })
  findAllTemplates(): Promise<QuestionTemplate[]> {
    return this.questionsService.findAllTemplates();
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'Get a question template by ID' })
  @ApiParam({ name: 'id', description: 'ID of the question template' })
  @ApiResponse({
    status: 200,
    description: 'The question template',
    type: QuestionTemplate,
  })
  @ApiResponse({ status: 404, description: 'Template not found' })
  findTemplateById(@Param('id') id: string): Promise<QuestionTemplate> {
    return this.questionsService.findTemplateById(id);
  }

  @Post('templates')
  @ApiOperation({ summary: 'Create a new question template' })
  @ApiBody({ type: CreateTemplateDto })
  @ApiResponse({
    status: 201,
    description: 'The question template has been created',
    type: QuestionTemplate,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  createTemplate(
    @Body() data: CreateTemplateDto,
    @Request() req,
  ): Promise<QuestionTemplate> {
    return this.questionsService.createTemplate(data, req.user.id);
  }

  @Post('templates/:id/generate')
  @ApiOperation({ summary: 'Generate an actual question from a template' })
  @ApiParam({ name: 'id', description: 'ID of the question template' })
  @ApiBody({ type: GenerateActualDto })
  @ApiResponse({
    status: 201,
    description: 'The actual question has been generated',
    type: QuestionActual,
  })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  generateActual(
    @Param('id') id: string,
    @Body() data: GenerateActualDto,
  ): Promise<QuestionActual> {
    return this.questionsService.generateActual(
      id,
      data.examType,
      data.sectionPosition,
    );
  }

  @Get('actuals/:id')
  @ApiOperation({ summary: 'Get an actual question by ID' })
  @ApiParam({ name: 'id', description: 'ID of the actual question' })
  @ApiResponse({
    status: 200,
    description: 'The actual question',
    type: QuestionActual,
  })
  @ApiResponse({ status: 404, description: 'Question not found' })
  findActualById(@Param('id') id: string): Promise<QuestionActual> {
    return this.questionsService.findActualById(id);
  }

  @Patch('templates/:id')
  @ApiOperation({ summary: 'Update a question template' })
  @ApiParam({
    name: 'id',
    description: 'ID of the question template to update',
  })
  @ApiBody({ type: UpdateTemplateDto })
  @ApiResponse({
    status: 200,
    description: 'The question template has been updated',
    type: QuestionTemplate,
  })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  updateTemplate(
    @Param('id') id: string,
    @Body() data: UpdateTemplateDto,
    @Request() req,
  ): Promise<QuestionTemplate> {
    return this.questionsService.updateTemplate(id, data, req.user.id);
  }
}
