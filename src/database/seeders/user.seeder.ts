import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TUserRole } from '../../users/types';
import * as bcrypt from 'bcrypt';
import * as userDataJson from '../../dev-debug/data/users.json';

interface ImportedUser {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  password: string;
  tags?: string;
}

interface UserData {
  userList: ImportedUser[];
}

@Injectable()
export class UserSeeder {
  private readonly logger = new Logger(UserSeeder.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    this.logger.log('Starting user seeding...');

    // First, seed the admin and test users
    const adminUsers: Array<{
      username: string;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      roles: TUserRole[];
      user_defined_tags: string;
    }> = [
      {
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        roles: ['admin:exams', 'admin:users', 'user', 'public'],
        user_defined_tags: 'users:tag1 users:common',
      },
      {
        username: 'user1',
        firstName: 'Regular',
        lastName: 'User',
        email: 'user1@example.com',
        password: await bcrypt.hash('user123', 10),
        roles: ['user', 'public'],
        user_defined_tags: 'users:tag2 users:common',
      },
      {
        username: 'user2',
        firstName: 'Test',
        lastName: 'User',
        email: 'user2@example.com',
        password: await bcrypt.hash('test123', 10),
        roles: ['user', 'public'],
        user_defined_tags: 'users:tag3 users:common',
      },
    ];

    // Then add the users from the JSON file
    const jsonData = userDataJson as UserData;
    const jsonUsers = jsonData.userList.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      roles: ['user', 'public'] as TUserRole[], // Default roles for imported users
      user_defined_tags: user.tags || 'users:common',
    }));

    // Combine both sets of users
    const allUsers = [...adminUsers, ...jsonUsers];

    // Seed all users
    for (const userData of allUsers) {
      try {
        const existingUser = await this.userRepository.findOne({
          where: { username: userData.username },
        });

        if (!existingUser) {
          const user = this.userRepository.create(userData);
          await this.userRepository.save(user);
          this.logger.log(
            `Created user: ${userData.username} with roles: ${userData.roles.join(', ')} and password starting with: ${userData.password.substring(0, 10)}`,
          );
        } else {
          // Update roles if it's the admin user to ensure correct roles
          if (userData.username === 'admin') {
            existingUser.roles = userData.roles;
            existingUser.password = userData.password; // Update password too
            existingUser.user_defined_tags = userData.user_defined_tags;
            await this.userRepository.save(existingUser);
            this.logger.log(
              `Updated admin user roles: ${userData.roles.join(', ')} and password starting with: ${userData.password.substring(0, 10)}`,
            );
          }
        }
      } catch (error) {
        this.logger.error(
          `Failed to create/update user ${userData.username}:`,
          error,
        );
      }
    }

    // Verify admin user exists
    const adminUser = await this.userRepository.findOne({
      where: { username: 'admin' },
    });

    if (adminUser) {
      this.logger.log(
        `Admin user exists with roles: ${adminUser.roles.join(', ')} and password starting with: ${adminUser.password.substring(0, 10)}`,
      );
    } else {
      this.logger.error('Admin user was not created!');
    }

    this.logger.log('User seeding completed');
  }
}
