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

    const totalCourses = 10;
    const coursesWithTags = Math.floor(totalCourses * 0.8); // 80% will have tags

    const courses = [];
    for (let i = 0; i < totalCourses; i++) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 7); // Start in a week

      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 4); // 4-month course

      const course = this.instructionalCourseRepository.create({
        name: `Course ${i + 1}`,
        description: `Description for Course ${i + 1}`,
        start_date: startDate,
        finish_date: endDate,
        start_time_utc: '09:00',
        duration_minutes: 50,
        days_of_week: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY],
        institution_id: institutions[0].id,
        instructor_id: adminUser.id,
        proctor_ids: [],
        created_by: adminUser.id,
        user_defined_tags:
          i < coursesWithTags ? `courses:tag${i + 1} courses:common` : '',
      });
      courses.push(course);
    }

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
        await this.instructionalCourseRepository.save(courseData);
        this.logger.log(
          `Created course: ${courseData.name} at institution ${courseData.institution_id}`,
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
