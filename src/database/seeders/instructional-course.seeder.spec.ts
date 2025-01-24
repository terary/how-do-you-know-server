import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstructionalCourseSeeder } from './instructional-course.seeder';
import { InstructionalCourse } from '../../learning/entities/instructional-course.entity';
import { LearningInstitution } from '../../learning/entities/learning-institution.entity';
import { User } from '../../users/entities/user.entity';

describe('InstructionalCourseSeeder', () => {
  let seeder: InstructionalCourseSeeder;
  let courseRepository: Repository<InstructionalCourse>;
  let institutionRepository: Repository<LearningInstitution>;
  let userRepository: Repository<User>;

  const mockCourseRepository = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockInstitutionRepository = {
    find: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstructionalCourseSeeder,
        {
          provide: getRepositoryToken(InstructionalCourse),
          useValue: mockCourseRepository,
        },
        {
          provide: getRepositoryToken(LearningInstitution),
          useValue: mockInstitutionRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    seeder = module.get<InstructionalCourseSeeder>(InstructionalCourseSeeder);
    courseRepository = module.get<Repository<InstructionalCourse>>(
      getRepositoryToken(InstructionalCourse),
    );
    institutionRepository = module.get<Repository<LearningInstitution>>(
      getRepositoryToken(LearningInstitution),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  describe('seed', () => {
    const mockAdminUser = {
      id: 'admin-id',
      username: 'admin',
    };

    const mockInstitution = {
      id: 'institution-id',
      name: 'Test Institution',
    };

    beforeEach(() => {
      mockUserRepository.findOne.mockResolvedValue(mockAdminUser);
      mockInstitutionRepository.find.mockResolvedValue([mockInstitution]);

      // Set up the query builder chain
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      mockCourseRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      mockCourseRepository.create.mockImplementation((dto) => dto);
      mockCourseRepository.save.mockImplementation((course) =>
        Promise.resolve({ id: 'course-id', ...course }),
      );
    });

    it('should create courses with correct tags (80% rule)', async () => {
      await seeder.seed();

      const createCalls = mockCourseRepository.create.mock.calls;
      const coursesWithTags = createCalls.filter(
        ([course]) => course.user_defined_tags !== '',
      );

      // Verify 80% of courses have tags
      expect(coursesWithTags.length).toBe(8); // 80% of 10 courses

      // Verify first course tags
      expect(createCalls[0][0]).toHaveProperty(
        'user_defined_tags',
        'courses:tag1 courses:common',
      );

      // Verify last tagged course
      expect(createCalls[7][0]).toHaveProperty(
        'user_defined_tags',
        'courses:tag8 courses:common',
      );

      // Verify untagged course
      expect(createCalls[8][0]).toHaveProperty('user_defined_tags', '');
    });

    it('should not create duplicate courses', async () => {
      // Mock that all courses already exist
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({
          id: 'existing-id',
          name: 'Existing Course',
        }),
      };
      mockCourseRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      await seeder.seed();

      // Since all courses exist, save should not be called
      expect(mockCourseRepository.save).not.toHaveBeenCalled();
    });

    it('should handle missing admin user', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await seeder.seed();

      expect(mockCourseRepository.create).not.toHaveBeenCalled();
    });

    it('should handle missing institutions', async () => {
      mockInstitutionRepository.find.mockResolvedValue([]);

      await seeder.seed();

      expect(mockCourseRepository.create).not.toHaveBeenCalled();
    });
  });
});
