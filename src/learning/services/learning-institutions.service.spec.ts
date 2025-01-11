import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearningInstitutionsService } from './learning-institutions.service';
import { LearningInstitution } from '../entities/learning-institution.entity';
import { CreateLearningInstitutionDto } from '../dto/create-learning-institution.dto';
import { UpdateLearningInstitutionDto } from '../dto/update-learning-institution.dto';

describe('LearningInstitutionsService', () => {
  let service: LearningInstitutionsService;
  let repository: Repository<LearningInstitution>;

  const mockInstitution = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test University',
    description: 'A test university for unit testing',
    website: 'https://test-university.edu',
    email: 'contact@test-university.edu',
    phone: '+1-234-567-8900',
    address: '123 Test St, Test City, TC 12345',
    created_by: '123e4567-e89b-12d3-a456-426614174001',
    created_at: new Date(),
    updated_at: new Date(),
    courses: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LearningInstitutionsService,
        {
          provide: getRepositoryToken(LearningInstitution),
          useValue: {
            create: jest.fn().mockReturnValue(mockInstitution),
            save: jest.fn().mockResolvedValue(mockInstitution),
            find: jest.fn().mockResolvedValue([mockInstitution]),
            findOne: jest.fn().mockResolvedValue(mockInstitution),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<LearningInstitutionsService>(
      LearningInstitutionsService,
    );
    repository = module.get<Repository<LearningInstitution>>(
      getRepositoryToken(LearningInstitution),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new learning institution', async () => {
      const createDto: CreateLearningInstitutionDto & { created_by: string } = {
        name: 'Test University',
        description: 'A test university for unit testing',
        website: 'https://test-university.edu',
        email: 'contact@test-university.edu',
        phone: '+1-234-567-8900',
        address: '123 Test St, Test City, TC 12345',
        created_by: '123e4567-e89b-12d3-a456-426614174001',
      };

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockInstitution);
    });
  });

  describe('findAll', () => {
    it('should return an array of learning institutions', async () => {
      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        relations: ['courses'],
      });
      expect(result).toEqual([mockInstitution]);
    });
  });

  describe('findOne', () => {
    it('should return a learning institution by id', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const result = await service.findOne(id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['courses'],
      });
      expect(result).toEqual(mockInstitution);
    });

    it('should return null if institution is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      const id = 'non-existent-id';
      const result = await service.findOne(id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['courses'],
      });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a learning institution', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateLearningInstitutionDto = {
        name: 'Updated University',
        description: 'Updated description',
      };

      const result = await service.update(id, updateDto);

      expect(repository.update).toHaveBeenCalledWith(id, updateDto);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['courses'],
      });
      expect(result).toEqual(mockInstitution);
    });
  });

  describe('remove', () => {
    it('should remove a learning institution', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      await service.remove(id);

      expect(repository.delete).toHaveBeenCalledWith(id);
    });
  });
});
