import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AddQuestionToSectionDto {
  @ApiProperty({
    description: 'The ID of the question template to add to the section',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  question_template_id: string;
}

export class RemoveQuestionFromSectionDto {
  @ApiProperty({
    description: 'The ID of the question template to remove from the section',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  question_template_id: string;
}
