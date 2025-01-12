import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearningInstitution } from '../../learning/entities/learning-institution.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class LearningInstitutionSeeder {
  private readonly logger = new Logger(LearningInstitutionSeeder.name);

  constructor(
    @InjectRepository(LearningInstitution)
    private readonly learningInstitutionRepository: Repository<LearningInstitution>,
  ) {}

  async seed() {
    this.logger.log('Starting learning institution seeding...');

    const institutions = [
      {
        name: 'University of Technology',
        description: 'A leading institution in technology and innovation',
        address: '123 Tech Avenue, Silicon Valley, CA',
        email: 'contact@uot.edu',
        phone: '+1-555-0123',
        website: 'https://uot.edu',
        created_by: 'f390d9c3-0f0e-49e0-9bac-22bcb3730968',
      },
      {
        name: 'Medical Sciences Academy',
        description: 'Premier institution for medical education and research',
        address: '456 Health Drive, Boston, MA',
        email: 'info@medacademy.edu',
        phone: '+1-555-0124',
        website: 'https://medacademy.edu',
        created_by: 'f390d9c3-0f0e-49e0-9bac-22bcb3730968',
      },
      {
        name: 'Business School International',
        description: 'Global leader in business education',
        address: '789 Commerce Street, New York, NY',
        email: 'admissions@bsi.edu',
        phone: '+1-555-0125',
        website: 'https://bsi.edu',
        created_by: 'f390d9c3-0f0e-49e0-9bac-22bcb3730968',
      },
    ];

    for (const institutionData of institutions) {
      const existingInstitution =
        await this.learningInstitutionRepository.findOne({
          where: { name: institutionData.name },
        });

      if (!existingInstitution) {
        const institution =
          this.learningInstitutionRepository.create(institutionData);
        await this.learningInstitutionRepository.save(institution);
        this.logger.log(`Created learning institution: ${institution.name}`);
      } else {
        this.logger.log(
          `Learning institution already exists: ${existingInstitution.name}`,
        );
      }
    }

    this.logger.log('Learning institution seeding completed');
  }
}
