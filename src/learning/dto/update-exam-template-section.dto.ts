import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';

export class UpdateExamTemplateSectionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  instructions?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  position?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  timeLimitSeconds?: number;
}
