import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { InstructionalCoursesService } from './instructional-courses.service';
import {
  InstructionalCourse,
  DayOfWeek,
} from '../entities/instructional-course.entity';
import { LearningInstitution } from '../entities/learning-institution.entity';
import { User } from '../../users/entities/user.entity';
import { TUserRole } from '../../users/types';
import { NotFoundException } from '@nestjs/common';

describe('InstructionalCoursesService', () => {
  let service: InstructionalCoursesService;
  let repository: Repository<InstructionalCourse>;

  const mockInstitution: LearningInstitution = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test University',
    description: 'A test university',
    website: 'https://test.edu',
    email: 'test@test.edu',
    phone: '123-456-7890',
    address: '123 Test St',
    created_by: '123e4567-e89b-12d3-a456-426614174001',
    created_at: new Date(),
    updated_at: new Date(),
    courses: [],
  };

  const mockInstructor: User = {
    id: 'instructor-id',
    username: 'instructor',
    firstName: 'Test',
    lastName: 'Instructor',
    email: 'instructor@test.com',
    password: 'password',
    roles: ['admin:exams' as TUserRole],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCourse: InstructionalCourse = {
    id: '123e4567-e89b-12d3-a456-426614174003',
    name: 'Test Course',
    description: 'A test course',
    start_date: new Date('2024-02-01'),
    finish_date: new Date('2024-05-31'),
    start_time_utc: '14:00',
    duration_minutes: 90,
    days_of_week: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY],
    institution_id: mockInstitution.id,
    institution: mockInstitution,
    instructor_id: mockInstructor.id,
    instructor: mockInstructor,
    proctor_ids: ['123e4567-e89b-12d3-a456-426614174004'],
    created_by: '123e4567-e89b-12d3-a456-426614174001',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstructionalCoursesService,
        {
          provide: getRepositoryToken(InstructionalCourse),
          useValue: {
            create: jest.fn().mockReturnValue(mockCourse),
            save: jest.fn().mockResolvedValue(mockCourse),
            find: jest.fn().mockResolvedValue([mockCourse]),
            findOne: jest.fn().mockResolvedValue(mockCourse),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
        {
          provide: getRepositoryToken(LearningInstitution),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockInstitution),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockInstructor),
          },
        },
      ],
    }).compile();

    service = module.get<InstructionalCoursesService>(
      InstructionalCoursesService,
    );
    repository = module.get<Repository<InstructionalCourse>>(
      getRepositoryToken(InstructionalCourse),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new course', async () => {
      const createDto = {
        name: mockCourse.name,
        description: mockCourse.description,
        start_date: mockCourse.start_date,
        finish_date: mockCourse.finish_date,
        start_time_utc: mockCourse.start_time_utc,
        duration_minutes: mockCourse.duration_minutes,
        days_of_week: mockCourse.days_of_week,
        institution_id: mockCourse.institution_id,
        instructor_id: mockCourse.instructor_id,
        proctor_ids: mockCourse.proctor_ids,
        created_by: mockCourse.created_by,
      };

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        institution: mockInstitution,
        instructor: mockInstructor,
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockCourse);
    });
  });

  describe('findAll', () => {
    it('should return an array of courses', async () => {
      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        relations: ['institution', 'instructor'],
      });
      expect(result).toEqual([mockCourse]);
    });

    it('should return an empty array when no courses exist', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });

    it('should return courses with related entities', async () => {
      const result = await service.findAll();
      expect(repository.find).toHaveBeenCalledWith({
        relations: ['institution', 'instructor'],
      });
      expect(result[0].institution).toBeDefined();
      expect(result[0].instructor).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should return a course by id', async () => {
      const result = await service.findOne(mockCourse.id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockCourse.id },
        relations: ['institution', 'instructor'],
      });
      expect(result).toEqual(mockCourse);
    });

    it('should throw NotFoundException if course is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return course with related entities', async () => {
      const result = await service.findOne(mockCourse.id);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockCourse.id },
        relations: ['institution', 'instructor'],
      });
      expect(result.institution).toBeDefined();
      expect(result.instructor).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update a course', async () => {
      const updateDto = {
        name: 'Updated Course Name',
        description: 'Updated description',
      };

      const updatedCourse = {
        ...mockCourse,
        ...updateDto,
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(mockCourse)
        .mockResolvedValueOnce(updatedCourse);

      const result = await service.update(mockCourse.id, updateDto);

      expect(repository.update).toHaveBeenCalledWith(mockCourse.id, updateDto);
      expect(result).toEqual(updatedCourse);
    });

    it('should throw NotFoundException when updating non-existent course', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      const updateDto = {
        name: 'Updated Course Name',
      };

      await expect(
        service.update('non-existent-id', updateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update course with new instructor', async () => {
      const newInstructor: User = {
        id: 'new-instructor-id',
        username: 'new_instructor',
        firstName: 'New',
        lastName: 'Instructor',
        email: 'new.instructor@test.com',
        password: 'password',
        roles: ['admin:exams' as TUserRole],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateDto = {
        instructor_id: newInstructor.id,
      };

      const updatedMockCourse = {
        ...mockCourse,
        instructor_id: newInstructor.id,
        instructor: newInstructor,
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(mockCourse)
        .mockResolvedValueOnce(updatedMockCourse);

      const result = await service.update(mockCourse.id, updateDto);

      expect(repository.update).toHaveBeenCalledWith(mockCourse.id, updateDto);
      expect(result.instructor_id).toBe(newInstructor.id);
      expect(result.instructor).toEqual(newInstructor);
    });
  });

  describe('remove', () => {
    it('should remove a course', async () => {
      const mockDeleteResult: DeleteResult = {
        affected: 1,
        raw: [],
      };
      jest.spyOn(repository, 'delete').mockResolvedValueOnce(mockDeleteResult);
      await service.remove(mockCourse.id);
      expect(repository.delete).toHaveBeenCalledWith(mockCourse.id);
    });

    it('should throw NotFoundException when removing non-existent course', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('toDto conversion', () => {
    it('should convert entity to DTO with all properties', async () => {
      const result = await service.findOne(mockCourse.id);

      expect(result).toEqual({
        id: mockCourse.id,
        name: mockCourse.name,
        description: mockCourse.description,
        start_date: mockCourse.start_date,
        finish_date: mockCourse.finish_date,
        start_time_utc: mockCourse.start_time_utc,
        duration_minutes: mockCourse.duration_minutes,
        days_of_week: mockCourse.days_of_week,
        institution_id: mockCourse.institution_id,
        instructor_id: mockCourse.instructor_id,
        proctor_ids: mockCourse.proctor_ids,
        created_by: mockCourse.created_by,
        created_at: mockCourse.created_at,
        updated_at: mockCourse.updated_at,
        institution: {
          id: mockCourse.institution.id,
          name: mockCourse.institution.name,
          description: mockCourse.institution.description,
          website: mockCourse.institution.website,
          email: mockCourse.institution.email,
          phone: mockCourse.institution.phone,
          address: mockCourse.institution.address,
          created_by: mockCourse.institution.created_by,
          created_at: mockCourse.institution.created_at,
          updated_at: mockCourse.institution.updated_at,
          courses: [],
        },
        instructor: {
          id: mockCourse.instructor.id,
          username: mockCourse.instructor.username,
          firstName: mockCourse.instructor.firstName,
          lastName: mockCourse.instructor.lastName,
          email: mockCourse.instructor.email,
          password: mockCourse.instructor.password,
          roles: mockCourse.instructor.roles,
          createdAt: mockCourse.instructor.createdAt,
          updatedAt: mockCourse.instructor.updatedAt,
        },
      });
    });

    it('should handle null relations in DTO conversion', async () => {
      const courseWithoutRelations = {
        ...mockCourse,
        institution: null,
        instructor: null,
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(courseWithoutRelations);
      const result = await service.findOne(mockCourse.id);

      expect(result.institution).toBeUndefined();
      expect(result.instructor).toBeUndefined();
    });
  });
});
