import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateTagsDto {
  @ApiProperty({
    description: 'Space-separated list of user-defined tags',
    example: 'important review difficult chapter1',
  })
  @IsString()
  tags: string;
}
