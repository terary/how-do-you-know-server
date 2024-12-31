import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import type { SignInDto, SignOutDto } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { TAuthenticatedUser } from 'src/users/types';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileResponseDto } from './dto/profile.response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign in to get access token' })
  @ApiResponse({
    status: 200,
    description: 'Returns JWT access token',
    schema: {
      properties: {
        access_token: { type: 'string' },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sign out' })
  @ApiResponse({ status: 200, description: 'Successfully signed out' })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  signOut(@Body() signOutDto: SignOutDto) {
    return this.authService.signOut(signOutDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user profile',
    description: "Retrieves the authenticated user's profile information",
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the user profile',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(
    @Request() req,
    @Body() profileResponseDto: ProfileResponseDto,
  ): Promise<TAuthenticatedUser> {
    const userProfiles = await this.authService.getProfile(req.user.username);
    return userProfiles;
  }
  //   signIn(@Body() signInDto: SignInDto) {

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user profile',
    description: "Updates the authenticated user's profile information",
  })
  @ApiBody({
    type: UpdateProfileDto,
    description: 'Profile update data',
    examples: {
      example1: {
        summary: 'Profile Update Example',
        description: 'A sample profile update request',
        value: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          // Add other fields from UpdateProfileDto
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated user profile',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @UseGuards(AuthGuard)
  @Post('profile')
  async updateUserProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<TAuthenticatedUser> {
    const updatedUser = await this.authService.updateUserProfile(
      req.user.username,
      // @ts-ignore - dto is not proper type
      updateProfileDto,
    );
    return updatedUser;
  }
  // --- I believe this is reading user information from jwt token
}
