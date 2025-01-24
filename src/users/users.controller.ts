import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UpdateTagsDto } from '../common/dto/update-tags.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data.' })
  create(@Body() createUserDto: CreateUserDto) {
    console.log({ createUserDto });
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users.',
    type: [CreateUserDto],
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':username')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user by username' })
  @ApiParam({ name: 'username', description: 'Username of the user to find' })
  @ApiResponse({
    status: 200,
    description: 'The found user.',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Patch(':username')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'username', description: 'Username of the user to update' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  update(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(username, updateUserDto);
  }

  @Delete(':username')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'username', description: 'Username of the user to delete' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param('username') username: string) {
    return this.usersService.remove(username);
  }

  @Put(':id/tags')
  @ApiOperation({ summary: 'Update user tags' })
  @ApiResponse({
    status: 200,
    description: 'The user tags have been updated',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateTags(
    @Param('id') id: string,
    @Body() updateTagsDto: UpdateTagsDto,
  ): Promise<User> {
    return this.usersService.updateTags(id, updateTagsDto);
  }

  @Get('search/tags')
  @ApiOperation({ summary: 'Search users by tags' })
  @ApiResponse({
    status: 200,
    description: 'List of users matching the tags',
    type: [User],
  })
  @ApiQuery({
    name: 'tags',
    description: 'Space-separated list of tags to search for',
    required: true,
    type: String,
  })
  async findByTags(@Query('tags') tags: string): Promise<User[]> {
    return this.usersService.findByTags(tags);
  }
}
