type TUserRole = 'admin:exams' | 'admin:users' | 'user' | 'public';
type TUserBase = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};
type TAuthenticatedUser = TUserBase & { roles: TUserRole[]; password: string };
export type { TAuthenticatedUser, TUserRole };
