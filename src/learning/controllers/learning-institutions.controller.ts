import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { LearningInstitutionsService } from '../services/learning-institutions.service';
import { CreateLearningInstitutionDto } from '../dto/create-learning-institution.dto';
import { UpdateLearningInstitutionDto } from '../dto/update-learning-institution.dto';
import { LearningInstitutionDto } from '../dto/learning-institution.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('learning-institutions')
@Controller('learning-institutions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LearningInstitutionsController {
  constructor(
    private readonly institutionsService: LearningInstitutionsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new learning institution' })
  @ApiResponse({
    status: 201,
    description: 'The learning institution has been created',
    type: LearningInstitutionDto,
  })
  create(
    @Body() createDto: CreateLearningInstitutionDto,
    @Request() req,
  ): Promise<LearningInstitutionDto> {
    return this.institutionsService.create({
      ...createDto,
      created_by: req.user.id,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all learning institutions' })
  @ApiResponse({
    status: 200,
    description: 'List of all learning institutions',
    type: [LearningInstitutionDto],
  })
  findAll(): Promise<LearningInstitutionDto[]> {
    return this.institutionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a learning institution by ID' })
  @ApiResponse({
    status: 200,
    description: 'The learning institution',
    type: LearningInstitutionDto,
  })
  findOne(@Param('id') id: string): Promise<LearningInstitutionDto> {
    return this.institutionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a learning institution' })
  @ApiResponse({
    status: 200,
    description: 'The learning institution has been updated',
    type: LearningInstitutionDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateLearningInstitutionDto,
  ): Promise<LearningInstitutionDto> {
    return this.institutionsService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a learning institution' })
  @ApiResponse({
    status: 200,
    description: 'The learning institution has been deleted',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.institutionsService.remove(id);
  }
}
