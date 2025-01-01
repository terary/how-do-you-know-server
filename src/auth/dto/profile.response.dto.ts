import { ApiProperty } from '@nestjs/swagger';
import { TUserRole } from '../../users/types';

export class ProfileResponseDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [String] })
  roles: TUserRole[];
}
