import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum PreviewFormat {
  HTML = 'html',
  PDF = 'pdf',
  JSON = 'json',
}

export class PreviewTemplateDto {
  @ApiProperty({ enum: PreviewFormat })
  @IsEnum(PreviewFormat)
  format: PreviewFormat;
}

export interface PreviewResponse {
  format: PreviewFormat;
  content: string; // HTML content, PDF base64, or JSON string
  metadata: {
    totalQuestions: number;
    totalSections: number;
    totalTime: number;
    difficultyBreakdown: {
      [key: string]: number;
    };
    topicBreakdown: {
      [key: string]: number;
    };
  };
}
