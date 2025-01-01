import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TAuthenticatedUser } from './types';
import * as userDataJson from '../dev-debug/data/users.json';

@Injectable()
export class UsersService {
  private readonly users = userDataJson.userList.map((user) => ({
    ...user,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
    roles: ['user', 'public'],
  })) as TAuthenticatedUser[];
  // private readonly users = [
  //   {
  //     userId: 1,
  //     username: 'john',
  //     password: 'changeme',
  //   },
  //   {
  //     userId: 2,
  //     username: 'maria',
  //     password: 'guess',
  //   },
  //   {
  //     userId: 3,
  //     username: 'username',
  //     password: 'password',
  //   },
  // ];

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(username: string): Promise<TAuthenticatedUser | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async updateUserProfile(
    username: string,
    updates: Partial<TAuthenticatedUser>,
  ): Promise<TAuthenticatedUser | undefined> {
    const user = this.users.find((user) => user.username === username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // const updatedUser = { ...user, ...updates };
    // this.users = this.users.map((user) =>
    //   user.username === username ? updatedUser : user,
    // );
    [
      'username',
      'firstName',
      'lastName',
      'email',
      'createdAt',
      // 'updatedAt',
      'roles',
    ].forEach((propertyName) => {
      if (propertyName in updates) {
        user[propertyName] = updates[propertyName];
      }
    });
    user.updatedAt = new Date();
    return this.users.find((user) => user.username === username);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
