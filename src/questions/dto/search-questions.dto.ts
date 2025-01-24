import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsArray, IsString } from 'class-validator';
import { QuestionDifficulty } from '../entities/question-template.entity';
import { TUserPromptType, TUserResponseType } from '../types';

export class SearchQuestionsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiProperty({ enum: QuestionDifficulty, required: false })
  @IsOptional()
  @IsEnum(QuestionDifficulty)
  difficulty?: QuestionDifficulty;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  topics?: string[];

  @ApiProperty({ enum: ['text', 'multimedia'], required: false })
  @IsOptional()
  @IsEnum(['text', 'multimedia'])
  userPromptType?: TUserPromptType;

  @ApiProperty({
    enum: ['free-text-255', 'multiple-choice-4', 'true-false'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['free-text-255', 'multiple-choice-4', 'true-false'])
  userResponseType?: TUserResponseType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  courseId?: string;
}
