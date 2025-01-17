import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsUUID,
  IsNumber,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QuestionPositionDto {
  @ApiProperty()
  @IsUUID()
  questionId: string;

  @ApiProperty()
  @IsNumber()
  position: number;
}

export class BulkAddQuestionsDto {
  @ApiProperty()
  @IsUUID()
  sectionId: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  questionIds: string[];
}

export class BulkRemoveQuestionsDto {
  @ApiProperty()
  @IsUUID()
  sectionId: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  questionIds: string[];
}

export class ReorderQuestionsDto {
  @ApiProperty()
  @IsUUID()
  sectionId: string;

  @ApiProperty({ type: [QuestionPositionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionPositionDto)
  @ArrayMinSize(1)
  questionPositions: QuestionPositionDto[];
}
