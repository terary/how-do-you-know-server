import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstructionalCourse } from '../entities/instructional-course.entity';
import { CreateInstructionalCourseDto } from '../dto/create-instructional-course.dto';
import { UpdateInstructionalCourseDto } from '../dto/update-instructional-course.dto';
import { InstructionalCourseDto } from '../dto/instructional-course.dto';
import { LearningInstitutionDto } from '../dto/learning-institution.dto';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class InstructionalCoursesService {
  constructor(
    @InjectRepository(InstructionalCourse)
    private readonly courseRepository: Repository<InstructionalCourse>,
  ) {}

  async create(
    data: CreateInstructionalCourseDto & { created_by: string },
  ): Promise<InstructionalCourseDto> {
    const course = this.courseRepository.create(data);
    const saved = await this.courseRepository.save(course);
    return this.toDto(saved);
  }

  async findAll(): Promise<InstructionalCourseDto[]> {
    const courses = await this.courseRepository.find({
      relations: ['institution', 'instructor'],
    });
    return courses.map((course) => this.toDto(course));
  }

  async findOne(id: string): Promise<InstructionalCourseDto | null> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['institution', 'instructor'],
    });
    return course ? this.toDto(course) : null;
  }

  async update(
    id: string,
    data: UpdateInstructionalCourseDto,
  ): Promise<InstructionalCourseDto | null> {
    await this.courseRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.courseRepository.delete(id);
  }

  private toDto(entity: InstructionalCourse): InstructionalCourseDto {
    const dto: InstructionalCourseDto = {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      start_date: entity.start_date,
      finish_date: entity.finish_date,
      start_time_utc: entity.start_time_utc,
      duration_minutes: entity.duration_minutes,
      days_of_week: entity.days_of_week,
      institution_id: entity.institution_id,
      instructor_id: entity.instructor_id,
      proctor_ids: entity.proctor_ids,
      created_by: entity.created_by,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      institution: entity.institution
        ? {
            id: entity.institution.id,
            name: entity.institution.name,
            description: entity.institution.description,
            website: entity.institution.website,
            email: entity.institution.email,
            phone: entity.institution.phone,
            address: entity.institution.address || '',
            created_by: entity.institution.created_by,
            created_at: entity.institution.created_at,
            updated_at: entity.institution.updated_at,
            courses: [],
          }
        : undefined,
      instructor: entity.instructor
        ? {
            id: entity.instructor.id,
            username: entity.instructor.username,
            firstName: entity.instructor.firstName,
            lastName: entity.instructor.lastName,
            email: entity.instructor.email,
            password: entity.instructor.password,
            roles: entity.instructor.roles,
            createdAt: entity.instructor.createdAt,
            updatedAt: entity.instructor.updatedAt,
          }
        : undefined,
    };

    return dto;
  }
}
