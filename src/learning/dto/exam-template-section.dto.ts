import { ApiProperty } from '@nestjs/swagger';

export class ExamTemplateSectionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  instructions: string;

  @ApiProperty()
  position: number;

  @ApiProperty()
  timeLimitSeconds: number;

  @ApiProperty()
  exam_template_id: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
