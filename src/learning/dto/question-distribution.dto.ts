import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionDifficulty } from '../../questions/entities/question-template.entity';

export class DifficultyDistributionRule {
  @ApiProperty({ enum: QuestionDifficulty })
  @IsEnum(QuestionDifficulty)
  difficulty: QuestionDifficulty;

  @ApiProperty({ minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;
}

export class TopicDistributionRule {
  @ApiProperty()
  @IsArray()
  topics: string[];

  @ApiProperty({ minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;
}

export class QuestionDistributionRulesDto {
  @ApiProperty({ type: [DifficultyDistributionRule], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DifficultyDistributionRule)
  difficultyRules?: DifficultyDistributionRule[];

  @ApiProperty({ type: [TopicDistributionRule], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TopicDistributionRule)
  topicRules?: TopicDistributionRule[];
}
