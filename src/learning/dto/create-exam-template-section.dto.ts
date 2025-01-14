import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateExamTemplateSectionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  instructions: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  position: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  timeLimitSeconds: number;
}
