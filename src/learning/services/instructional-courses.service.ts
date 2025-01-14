import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstructionalCourse } from '../entities/instructional-course.entity';
import { CreateInstructionalCourseDto } from '../dto/create-instructional-course.dto';
import { UpdateInstructionalCourseDto } from '../dto/update-instructional-course.dto';
import { InstructionalCourseDto } from '../dto/instructional-course.dto';
import { LearningInstitution } from '../entities/learning-institution.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class InstructionalCoursesService {
  constructor(
    @InjectRepository(InstructionalCourse)
    private readonly courseRepository: Repository<InstructionalCourse>,
    @InjectRepository(LearningInstitution)
    private readonly institutionRepository: Repository<LearningInstitution>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    data: CreateInstructionalCourseDto & { created_by: string },
  ): Promise<InstructionalCourseDto> {
    // Find the institution
    const institution = await this.institutionRepository.findOne({
      where: { id: data.institution_id },
    });
    if (!institution) {
      throw new NotFoundException(
        `Institution with ID "${data.institution_id}" not found`,
      );
    }

    // Find the instructor
    const instructor = await this.userRepository.findOne({
      where: { id: data.instructor_id },
    });
    if (!instructor) {
      throw new NotFoundException(
        `Instructor with ID "${data.instructor_id}" not found`,
      );
    }

    const course = this.courseRepository.create({
      ...data,
      institution,
      instructor,
    });
    const saved = await this.courseRepository.save(course);
    return this.toDto(saved);
  }

  async findAll(): Promise<InstructionalCourseDto[]> {
    const courses = await this.courseRepository.find({
      relations: ['institution', 'instructor'],
    });
    return courses.map((course) => this.toDto(course));
  }

  async findOne(id: string): Promise<InstructionalCourseDto> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['institution', 'instructor'],
    });
    if (!course) {
      throw new NotFoundException(
        `Instructional course with ID "${id}" not found`,
      );
    }
    return this.toDto(course);
  }

  async update(
    id: string,
    data: UpdateInstructionalCourseDto,
  ): Promise<InstructionalCourseDto> {
    const course = await this.findOne(id);
    await this.courseRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const course = await this.findOne(id);
    await this.courseRepository.delete(id);
  }

  private toDto(entity: InstructionalCourse): InstructionalCourseDto {
    const dto = new InstructionalCourseDto();
    Object.assign(dto, {
      ...entity,
      institution: entity.institution || undefined,
      instructor: entity.instructor || undefined,
    });
    return dto;
  }
}
