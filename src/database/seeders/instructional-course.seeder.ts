import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  InstructionalCourse,
  DayOfWeek,
} from '../../learning/entities/instructional-course.entity';
import { LearningInstitution } from '../../learning/entities/learning-institution.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class InstructionalCourseSeeder {
  private readonly logger = new Logger(InstructionalCourseSeeder.name);

  constructor(
    @InjectRepository(InstructionalCourse)
    private readonly instructionalCourseRepository: Repository<InstructionalCourse>,
    @InjectRepository(LearningInstitution)
    private readonly learningInstitutionRepository: Repository<LearningInstitution>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    this.logger.log('Starting instructional course seeding...');

    // Get admin user
    const adminUser = await this.userRepository.findOne({
      where: { username: 'admin' },
    });

    if (!adminUser) {
      this.logger.error('Admin user not found. Please run user seeder first.');
      return;
    }

    const institutions = await this.learningInstitutionRepository.find();
    if (institutions.length === 0) {
      this.logger.warn(
        'No learning institutions found. Please run learning institution seeder first.',
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
        institution_id: institutions[0].id,
        instructor_id: adminUser.id,
        created_by: adminUser.id,
      },
      {
        name: 'Medical Research Methods',
        description: 'Introduction to medical research methodologies',
        start_date: new Date('2024-03-01'),
        finish_date: new Date('2024-06-30'),
        start_time_utc: '15:30',
        duration_minutes: 120,
        days_of_week: [DayOfWeek.TUESDAY, DayOfWeek.THURSDAY],
        institution_id: institutions[1].id,
        instructor_id: adminUser.id,
        created_by: adminUser.id,
      },
      {
        name: 'Business Analytics',
        description: 'Data-driven decision making in business',
        start_date: new Date('2024-04-01'),
        finish_date: new Date('2024-07-31'),
        start_time_utc: '13:00',
        duration_minutes: 90,
        days_of_week: [DayOfWeek.MONDAY, DayOfWeek.FRIDAY],
        institution_id: institutions[2].id,
        instructor_id: adminUser.id,
        created_by: adminUser.id,
      },
    ];

    for (const courseData of courses) {
      const existingCourse = await this.instructionalCourseRepository
        .createQueryBuilder('course')
        .leftJoinAndSelect('course.institution', 'institution')
        .where('course.name = :name', { name: courseData.name })
        .andWhere('institution.id = :institutionId', {
          institutionId: courseData.institution_id,
        })
        .getOne();

      if (!existingCourse) {
        const course = this.instructionalCourseRepository.create(courseData);
        await this.instructionalCourseRepository.save(course);
        this.logger.log(
          `Created course: ${course.name} at institution ${courseData.institution_id}`,
        );
      } else {
        this.logger.log(
          `Course already exists: ${existingCourse.name} at institution ${courseData.institution_id}`,
        );
      }
    }

    this.logger.log('Instructional course seeding completed');
  }
}
