import { TUserRole } from '../types';

export class UpdateUserProfileDto {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  roles: TUserRole[];
  //   password: string;
}
