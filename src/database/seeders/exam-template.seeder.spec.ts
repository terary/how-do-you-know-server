import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamTemplateSeeder } from './exam-template.seeder';
import {
  ExamTemplate,
  ExamExclusivityType,
} from '../../learning/entities/exam-template.entity';
import { ExamTemplateSection } from '../../learning/entities/exam-template-section.entity';
import { ExamTemplateSectionQuestion } from '../../learning/entities/exam-template-section-question.entity';
import { InstructionalCourse } from '../../learning/entities/instructional-course.entity';
import { QuestionTemplate } from '../../questions/entities/question-template.entity';

describe('ExamTemplateSeeder', () => {
  let seeder: ExamTemplateSeeder;
  let examTemplateRepository: Repository<ExamTemplate>;

  const mockExamTemplateRepository = {
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockSectionRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockSectionQuestionRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCourseRepository = {
    find: jest.fn(),
  };

  const mockQuestionTemplateRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamTemplateSeeder,
        {
          provide: getRepositoryToken(ExamTemplate),
          useValue: mockExamTemplateRepository,
        },
        {
          provide: getRepositoryToken(ExamTemplateSection),
          useValue: mockSectionRepository,
        },
        {
          provide: getRepositoryToken(ExamTemplateSectionQuestion),
          useValue: mockSectionQuestionRepository,
        },
        {
          provide: getRepositoryToken(InstructionalCourse),
          useValue: mockCourseRepository,
        },
        {
          provide: getRepositoryToken(QuestionTemplate),
          useValue: mockQuestionTemplateRepository,
        },
      ],
    }).compile();

    seeder = module.get<ExamTemplateSeeder>(ExamTemplateSeeder);
    examTemplateRepository = module.get<Repository<ExamTemplate>>(
      getRepositoryToken(ExamTemplate),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  describe('seed', () => {
    beforeEach(() => {
      mockExamTemplateRepository.count.mockResolvedValue(0);
      mockExamTemplateRepository.create.mockImplementation((dto) => dto);
      mockExamTemplateRepository.save.mockImplementation((templates) =>
        Array.isArray(templates)
          ? templates.map((t) => ({ id: 'template-id', ...t }))
          : { id: 'template-id', ...templates },
      );
    });

    it('should create exam templates with correct tags (80% rule)', async () => {
      await seeder.seed();

      const createCalls = mockExamTemplateRepository.create.mock.calls;
      const templatesWithTags = createCalls.filter(
        ([template]) => template.user_defined_tags !== '',
      );

      // Verify 80% of templates have tags
      expect(templatesWithTags.length).toBe(8); // 80% of 10 templates

      // Verify first template tags
      expect(createCalls[0][0]).toHaveProperty(
        'user_defined_tags',
        'exams:tag1 exams:common',
      );

      // Verify last tagged template
      expect(createCalls[7][0]).toHaveProperty(
        'user_defined_tags',
        'exams:tag8 exams:common',
      );

      // Verify untagged template
      expect(createCalls[8][0]).toHaveProperty('user_defined_tags', '');
    });

    it('should not create templates if they already exist', async () => {
      mockExamTemplateRepository.count.mockResolvedValue(5);

      await seeder.seed();

      expect(mockExamTemplateRepository.create).not.toHaveBeenCalled();
      expect(mockExamTemplateRepository.save).not.toHaveBeenCalled();
    });

    it('should create templates with correct exclusivity type', async () => {
      await seeder.seed();

      const createCalls = mockExamTemplateRepository.create.mock.calls;
      createCalls.forEach(([template]) => {
        expect(template.examExclusivityType).toBe(
          ExamExclusivityType.EXAM_PRACTICE_BOTH,
        );
      });
    });

    it('should save all created templates', async () => {
      await seeder.seed();

      const saveCalls = mockExamTemplateRepository.save.mock.calls;
      expect(saveCalls[0][0]).toHaveLength(10); // All templates saved at once
    });
  });
});
