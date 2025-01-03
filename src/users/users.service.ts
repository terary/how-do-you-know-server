import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TAuthenticatedUser } from './types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    // Create test user if it doesn't exist
    const testUser = await this.findByUsername('test@example.com');
    if (!testUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await this.create({
        username: 'test@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        roles: ['admin:exams', 'admin:users'],
      });
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create({
      ...createUserDto,
      roles: ['user', 'public'],
    });
    console.log({ userSave: user });
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async updateUserProfile(
    username: string,
    updates: Partial<User>,
  ): Promise<User> {
    const user = await this.findOne(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Filter allowed properties
    const allowedUpdates = ['firstName', 'lastName', 'email'];

    allowedUpdates.forEach((prop) => {
      if (prop in updates) {
        user[prop] = updates[prop];
      }
    });

    return this.usersRepository.save(user);
  }

  async update(username: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(username: string): Promise<void> {
    const user = await this.findOne(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.remove(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }
}
