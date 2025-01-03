import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuestionsService } from './questions.service';
import { QuestionTemplate, QuestionActual } from './entities';
import { TUserPromptType, TUserResponseType } from './types';

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('templates')
  findAllTemplates(): Promise<QuestionTemplate[]> {
    return this.questionsService.findAllTemplates();
  }

  @Get('templates/:id')
  findTemplateById(@Param('id') id: string): Promise<QuestionTemplate> {
    return this.questionsService.findTemplateById(id);
  }

  @Post('templates')
  createTemplate(
    @Body()
    data: {
      userPromptType: TUserPromptType;
      userResponseType: TUserResponseType;
      exclusivityType: 'exam-only' | 'practice-only' | 'exam-practice-both';
      userPromptText?: string;
      instructionText?: string;
      media?: {
        mediaContentType: 'audio/mpeg' | 'video/mp4';
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
    },
    @Request() req,
  ): Promise<QuestionTemplate> {
    return this.questionsService.createTemplate(data, req.user.id);
  }

  @Post('templates/:id/generate')
  generateActual(
    @Param('id') id: string,
    @Body()
    data: {
      examType: 'practice' | 'live';
      sectionPosition: number;
    },
  ): Promise<QuestionActual> {
    return this.questionsService.generateActual(
      id,
      data.examType,
      data.sectionPosition,
    );
  }

  @Get('actuals/:id')
  findActualById(@Param('id') id: string): Promise<QuestionActual> {
    return this.questionsService.findActualById(id);
  }
}
