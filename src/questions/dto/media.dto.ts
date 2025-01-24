import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { TMediaContentType } from '../types';

export class MediaDto {
  @ApiProperty({
    enum: [
      'application/octet-stream',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/*',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/aac',
      'audio/webm',
      'audio/*',
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/avi',
      'video/quicktime',
      'video/*',
    ],
    description: 'Content type of the media',
  })
  @IsEnum([
    'application/octet-stream',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/*',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/aac',
    'audio/webm',
    'audio/*',
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/avi',
    'video/quicktime',
    'video/*',
  ])
  mediaContentType: TMediaContentType;

  @ApiProperty({ description: 'Height of the media in pixels' })
  @IsNumber()
  height: number;

  @ApiProperty({ description: 'Width of the media in pixels' })
  @IsNumber()
  width: number;

  @ApiProperty({ description: 'URL of the media content' })
  @IsUrl()
  url: string;

  @ApiProperty({
    description: 'Special instructions for the media',
    required: false,
  })
  @IsString()
  @IsOptional()
  specialInstructionText?: string;

  @ApiProperty({ description: 'Duration in seconds', required: false })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiProperty({ description: 'File size in bytes', required: false })
  @IsNumber()
  @IsOptional()
  fileSize?: number;

  @ApiProperty({
    description: 'Thumbnail URL for video content',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  thumbnailUrl?: string;
}
