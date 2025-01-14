import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearningInstitution } from '../entities/learning-institution.entity';
import { CreateLearningInstitutionDto } from '../dto/create-learning-institution.dto';
import { UpdateLearningInstitutionDto } from '../dto/update-learning-institution.dto';
import { LearningInstitutionDto } from '../dto/learning-institution.dto';

@Injectable()
export class LearningInstitutionsService {
  constructor(
    @InjectRepository(LearningInstitution)
    private readonly institutionRepository: Repository<LearningInstitution>,
  ) {}

  async create(
    data: CreateLearningInstitutionDto & { created_by: string },
  ): Promise<LearningInstitutionDto> {
    const institution = this.institutionRepository.create(data);
    const saved = await this.institutionRepository.save(institution);
    return this.toDto(saved);
  }

  async findAll(): Promise<LearningInstitutionDto[]> {
    const institutions = await this.institutionRepository.find({
      relations: ['courses'],
    });
    return institutions.map((institution) => this.toDto(institution));
  }

  async findOne(id: string): Promise<LearningInstitutionDto> {
    const institution = await this.institutionRepository.findOne({
      where: { id },
      relations: ['courses'],
    });
    if (!institution) {
      throw new NotFoundException(
        `Learning institution with ID "${id}" not found`,
      );
    }
    return this.toDto(institution);
  }

  async update(
    id: string,
    data: UpdateLearningInstitutionDto,
  ): Promise<LearningInstitutionDto> {
    const institution = await this.findOne(id);
    await this.institutionRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const institution = await this.findOne(id);
    await this.institutionRepository.delete(id);
  }

  private toDto(entity: LearningInstitution): LearningInstitutionDto {
    const dto = new LearningInstitutionDto();
    Object.assign(dto, entity);
    return dto;
  }
}
