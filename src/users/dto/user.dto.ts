import { ApiProperty } from '@nestjs/swagger';
import { TUserRole } from '../types';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty({
    type: [String],
    enum: ['admin:exams', 'admin:users', 'user', 'public'],
  })
  roles: TUserRole[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
