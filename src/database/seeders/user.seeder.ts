import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TUserRole } from '../../users/types';
import * as userDataJson from '../../dev-debug/data/users.json';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    // First, seed the admin and test users
    const adminUsers: Array<{
      username: string;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      roles: TUserRole[];
    }> = [
      {
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'admin123',
        roles: ['admin:exams', 'admin:users', 'user', 'public'],
      },
      {
        username: 'user1',
        firstName: 'Regular',
        lastName: 'User',
        email: 'user1@example.com',
        password: 'user123',
        roles: ['user', 'public'],
      },
      {
        username: 'user2',
        firstName: 'Test',
        lastName: 'User',
        email: 'user2@example.com',
        password: 'test123',
        roles: ['user', 'public'],
      },
    ];

    // Then add the users from the JSON file
    const jsonUsers = userDataJson.userList.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      roles: ['user', 'public'] as TUserRole[], // Default roles for imported users
    }));

    // Combine both sets of users
    const allUsers = [...adminUsers, ...jsonUsers];

    // Seed all users
    for (const userData of allUsers) {
      const existingUser = await this.userRepository.findOne({
        where: { username: userData.username },
      });

      if (!existingUser) {
        const user = this.userRepository.create(userData);
        await this.userRepository.save(user);
      }
    }
  }
}
