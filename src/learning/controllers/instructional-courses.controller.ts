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
import { InstructionalCoursesService } from '../services/instructional-courses.service';
import { CreateInstructionalCourseDto } from '../dto/create-instructional-course.dto';
import { UpdateInstructionalCourseDto } from '../dto/update-instructional-course.dto';
import { InstructionalCourseDto } from '../dto/instructional-course.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('instructional-courses')
@Controller('instructional-courses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InstructionalCoursesController {
  constructor(private readonly coursesService: InstructionalCoursesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new instructional course' })
  @ApiResponse({
    status: 201,
    description: 'The instructional course has been created',
    type: InstructionalCourseDto,
  })
  create(
    @Body() createDto: CreateInstructionalCourseDto,
    @Request() req,
  ): Promise<InstructionalCourseDto> {
    return this.coursesService.create({
      ...createDto,
      created_by: req.user.id,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all instructional courses' })
  @ApiResponse({
    status: 200,
    description: 'List of all instructional courses',
    type: [InstructionalCourseDto],
  })
  findAll(): Promise<InstructionalCourseDto[]> {
    return this.coursesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific instructional course' })
  @ApiResponse({
    status: 200,
    description: 'The instructional course',
    type: InstructionalCourseDto,
  })
  findOne(@Param('id') id: string): Promise<InstructionalCourseDto> {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an instructional course' })
  @ApiResponse({
    status: 200,
    description: 'The instructional course has been updated',
    type: InstructionalCourseDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateInstructionalCourseDto,
  ): Promise<InstructionalCourseDto> {
    return this.coursesService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an instructional course' })
  @ApiResponse({
    status: 200,
    description: 'The instructional course has been deleted',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.coursesService.remove(id);
  }
}
