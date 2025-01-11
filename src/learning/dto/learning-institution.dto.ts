import { ApiProperty } from '@nestjs/swagger';
import { InstructionalCourse } from '../entities/instructional-course.entity';

export class LearningInstitutionDto {
  @ApiProperty({
    description: 'The unique identifier of the learning institution',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the learning institution',
    example: 'University of Example',
  })
  name: string;

  @ApiProperty({
    description: 'A detailed description of the learning institution',
    example: 'A leading institution in computer science education...',
  })
  description: string;

  @ApiProperty({
    description: 'The website URL of the learning institution',
    example: 'https://www.example-university.edu',
  })
  website: string;

  @ApiProperty({
    description: 'The contact email for the learning institution',
    example: 'contact@example-university.edu',
  })
  email: string;

  @ApiProperty({
    description: 'The contact phone number for the learning institution',
    example: '+1-234-567-8900',
  })
  phone: string;

  @ApiProperty({
    description: 'The physical address of the learning institution',
    example: '123 University Ave, Example City, EX 12345',
    required: false,
  })
  address?: string;

  @ApiProperty({
    description: 'The ID of the user who created this institution',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  created_by: string;

  @ApiProperty({
    description: 'The timestamp when this institution was created',
    example: '2024-01-20T12:00:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'The timestamp when this institution was last updated',
    example: '2024-01-20T12:00:00Z',
  })
  updated_at: Date;

  @ApiProperty({
    description: 'The courses associated with this institution',
    type: [InstructionalCourse],
  })
  courses: InstructionalCourse[];
}
