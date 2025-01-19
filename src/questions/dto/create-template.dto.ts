import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TUserPromptType, TUserResponseType } from '../types';
import { MediaDto } from './media.dto';
import { ValidAnswerDto } from './valid-answer.dto';

export class CreateTemplateDto {
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
  @ArrayNotEmpty()
  validAnswers: ValidAnswerDto[];
}
