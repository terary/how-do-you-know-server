import { Test, TestingModule } from '@nestjs/testing';
import { LearningInstitutionsController } from './learning-institutions.controller';
import { LearningInstitutionsService } from '../services/learning-institutions.service';
import { CreateLearningInstitutionDto } from '../dto/create-learning-institution.dto';
import { UpdateLearningInstitutionDto } from '../dto/update-learning-institution.dto';
import { LearningInstitutionDto } from '../dto/learning-institution.dto';

describe('LearningInstitutionsController', () => {
  let controller: LearningInstitutionsController;
  let service: LearningInstitutionsService;

  const mockInstitution: LearningInstitutionDto = {
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

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    username: 'testuser',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LearningInstitutionsController],
      providers: [
        {
          provide: LearningInstitutionsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockInstitution),
            findAll: jest.fn().mockResolvedValue([mockInstitution]),
            findOne: jest.fn().mockResolvedValue(mockInstitution),
            update: jest.fn().mockResolvedValue(mockInstitution),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<LearningInstitutionsController>(
      LearningInstitutionsController,
    );
    service = module.get<LearningInstitutionsService>(
      LearningInstitutionsService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new learning institution', async () => {
      const createDto: CreateLearningInstitutionDto = {
        name: 'Test University',
        description: 'A test university',
        website: 'https://test.edu',
        email: 'test@test.edu',
        phone: '123-456-7890',
        address: '123 Test St',
      };

      const req = { user: mockUser };

      const result = await controller.create(createDto, req);

      expect(service.create).toHaveBeenCalledWith({
        ...createDto,
        created_by: mockUser.id,
      });
      expect(result).toEqual(mockInstitution);
    });
  });

  describe('findAll', () => {
    it('should return an array of learning institutions', async () => {
      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockInstitution]);
    });
  });

  describe('findOne', () => {
    it('should return a learning institution by id', async () => {
      const result = await controller.findOne(mockInstitution.id);

      expect(service.findOne).toHaveBeenCalledWith(mockInstitution.id);
      expect(result).toEqual(mockInstitution);
    });

    it('should return null for non-existent institution', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
      const result = await controller.findOne('non-existent-id');

      expect(service.findOne).toHaveBeenCalledWith('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a learning institution', async () => {
      const updateDto: UpdateLearningInstitutionDto = {
        name: 'Updated University',
        description: 'Updated description',
      };

      const result = await controller.update(mockInstitution.id, updateDto);

      expect(service.update).toHaveBeenCalledWith(
        mockInstitution.id,
        updateDto,
      );
      expect(result).toEqual(mockInstitution);
    });
  });

  describe('remove', () => {
    it('should remove a learning institution', async () => {
      await controller.remove(mockInstitution.id);

      expect(service.remove).toHaveBeenCalledWith(mockInstitution.id);
    });
  });
});
