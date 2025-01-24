import { Test, TestingModule } from '@nestjs/testing';
import { InstructionalCoursesController } from './instructional-courses.controller';
import { InstructionalCoursesService } from '../services/instructional-courses.service';
import { CreateInstructionalCourseDto } from '../dto/create-instructional-course.dto';
import { UpdateInstructionalCourseDto } from '../dto/update-instructional-course.dto';
import { InstructionalCourseDto } from '../dto/instructional-course.dto';
import {
  InstructionalCourse,
  DayOfWeek,
} from '../entities/instructional-course.entity';

describe('InstructionalCoursesController', () => {
  let controller: InstructionalCoursesController;
  let service: jest.Mocked<InstructionalCoursesService>;

  const mockUser = { id: 'user-123' };
  const mockDate = new Date();

  const mockInstructionalCourse: Partial<InstructionalCourse> = {
    id: 'course-123',
    name: 'Test Course',
    description: 'Test Course Description',
    start_date: mockDate,
    finish_date: new Date(mockDate.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days later
    start_time_utc: '09:00',
    duration_minutes: 60,
    days_of_week: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY],
    institution_id: 'institution-123',
    instructor_id: 'instructor-123',
    proctor_ids: ['proctor-123'],
    created_by: mockUser.id,
    created_at: mockDate,
    updated_at: mockDate,
    user_defined_tags: '',
  };

  beforeEach(async () => {
    const mockInstructionalCoursesService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      updateTags: jest.fn(), // From TaggableController
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstructionalCoursesController],
      providers: [
        {
          provide: InstructionalCoursesService,
          useValue: mockInstructionalCoursesService,
        },
      ],
    }).compile();

    controller = module.get<InstructionalCoursesController>(
      InstructionalCoursesController,
    );
    service = module.get(InstructionalCoursesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an instructional course', async () => {
      const dto: CreateInstructionalCourseDto = {
        name: 'Test Course',
        description: 'Test Course Description',
        start_date: mockDate,
        finish_date: new Date(mockDate.getTime() + 30 * 24 * 60 * 60 * 1000),
        start_time_utc: '09:00',
        duration_minutes: 60,
        days_of_week: [DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY],
        institution_id: 'institution-123',
        instructor_id: 'instructor-123',
        proctor_ids: ['proctor-123'],
      };

      const expectedResponse: InstructionalCourseDto =
        mockInstructionalCourse as InstructionalCourseDto;
      service.create.mockResolvedValue(expectedResponse);

      const result = await controller.create(dto, { user: mockUser });

      expect(result).toBe(expectedResponse);
      expect(service.create).toHaveBeenCalledWith({
        ...dto,
        created_by: mockUser.id,
      });
    });
  });

  describe('findAll', () => {
    it('should return all instructional courses', async () => {
      const expectedResponse: InstructionalCourseDto[] = [
        mockInstructionalCourse as InstructionalCourseDto,
      ];
      service.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll();

      expect(result).toBe(expectedResponse);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a specific instructional course', async () => {
      const expectedResponse: InstructionalCourseDto =
        mockInstructionalCourse as InstructionalCourseDto;
      service.findOne.mockResolvedValue(expectedResponse);

      const result = await controller.findOne(mockInstructionalCourse.id);

      expect(result).toBe(expectedResponse);
      expect(service.findOne).toHaveBeenCalledWith(mockInstructionalCourse.id);
    });
  });

  describe('update', () => {
    it('should update an instructional course', async () => {
      const dto: UpdateInstructionalCourseDto = {
        name: 'Updated Course',
      };
      const expectedResponse: InstructionalCourseDto = {
        ...mockInstructionalCourse,
        name: 'Updated Course',
      } as InstructionalCourseDto;
      service.update.mockResolvedValue(expectedResponse);

      const result = await controller.update(mockInstructionalCourse.id, dto);

      expect(result).toBe(expectedResponse);
      expect(service.update).toHaveBeenCalledWith(
        mockInstructionalCourse.id,
        dto,
      );
    });
  });

  describe('remove', () => {
    it('should remove an instructional course', async () => {
      await controller.remove(mockInstructionalCourse.id);

      expect(service.remove).toHaveBeenCalledWith(mockInstructionalCourse.id);
    });
  });
});
