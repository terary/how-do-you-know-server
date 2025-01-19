import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ValidAnswerDto {
  @ApiProperty({ description: 'Text answer', required: false })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiProperty({ description: 'Boolean answer', required: false })
  @IsOptional()
  booleanValue?: boolean;

  @ApiProperty({ description: 'ID of the fodder pool', required: false })
  @IsString()
  @IsOptional()
  fodderPoolId?: string;
}
