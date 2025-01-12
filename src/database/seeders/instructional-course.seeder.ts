import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  InstructionalCourse,
  DayOfWeek,
} from '../../learning/entities/instructional-course.entity';
import { LearningInstitution } from '../../learning/entities/learning-institution.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class InstructionalCourseSeeder {
  private readonly logger = new Logger(InstructionalCourseSeeder.name);

  constructor(
    @InjectRepository(InstructionalCourse)
    private readonly courseRepository: Repository<InstructionalCourse>,
    @InjectRepository(LearningInstitution)
    private readonly institutionRepository: Repository<LearningInstitution>,
  ) {}

  async seed() {
    this.logger.log('Starting instructional course seeding...');

    const institutions = await this.institutionRepository.find();
    if (institutions.length === 0) {
      this.logger.warn(
        'No institutions found. Please run institution seeder first.',
      );
      return;
    }

    const courses = [
      {
        name: 'Introduction to Programming',
        description: 'Fundamentals of programming using Python',
        start_date: new Date('2024-02-01'),
        finish_date: new Date('2024-05-30'),
        start_time_utc: '14:00',
        duration_minutes: 90,
        days_of_week: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY],
        institution: institutions[0], // University of Technology
        created_by: 'f390d9c3-0f0e-49e0-9bac-22bcb3730968', // admin user id
        instructor_id: 'f390d9c3-0f0e-49e0-9bac-22bcb3730968', // admin user as instructor
      },
      {
        name: 'Advanced Medical Research',
        description: 'Research methodologies in medical science',
        start_date: new Date('2024-02-01'),
        finish_date: new Date('2024-06-15'),
        start_time_utc: '15:30',
        duration_minutes: 120,
        days_of_week: [DayOfWeek.TUESDAY, DayOfWeek.THURSDAY],
        institution: institutions[1], // Medical Sciences Academy
        created_by: 'f390d9c3-0f0e-49e0-9bac-22bcb3730968',
        instructor_id: 'f390d9c3-0f0e-49e0-9bac-22bcb3730968',
      },
      {
        name: 'Business Strategy',
        description: 'Strategic management and business planning',
        start_date: new Date('2024-02-15'),
        finish_date: new Date('2024-05-15'),
        start_time_utc: '13:00',
        duration_minutes: 90,
        days_of_week: [DayOfWeek.MONDAY, DayOfWeek.FRIDAY],
        institution: institutions[2], // Business School International
        created_by: 'f390d9c3-0f0e-49e0-9bac-22bcb3730968',
        instructor_id: 'f390d9c3-0f0e-49e0-9bac-22bcb3730968',
      },
    ];

    for (const courseData of courses) {
      const existingCourse = await this.courseRepository.findOne({
        where: {
          name: courseData.name,
          institution: { id: courseData.institution.id },
        },
        relations: ['institution'],
      });

      if (!existingCourse) {
        const course = this.courseRepository.create(courseData);
        await this.courseRepository.save(course);
        this.logger.log(
          `Created course: ${course.name} at ${courseData.institution.name}`,
        );
      } else {
        this.logger.log(
          `Course already exists: ${existingCourse.name} at ${existingCourse.institution.name}`,
        );
      }
    }

    this.logger.log('Instructional course seeding completed');
  }
}
