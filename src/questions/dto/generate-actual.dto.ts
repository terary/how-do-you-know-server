import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';

export class GenerateActualDto {
  @ApiProperty({ enum: ['practice', 'live'], description: 'Type of exam' })
  @IsEnum(['practice', 'live'])
  examType: 'practice' | 'live';

  @ApiProperty({ description: 'Position in the section' })
  @IsNumber()
  sectionPosition: number;
}
