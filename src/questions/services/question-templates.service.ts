import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionTemplate } from '../entities/question-template.entity';
import { TaggableService } from '../../common/services/taggable.service';

@Injectable()
export class QuestionTemplatesService extends TaggableService<QuestionTemplate> {
  constructor(
    @InjectRepository(QuestionTemplate)
    private questionTemplateRepository: Repository<QuestionTemplate>,
  ) {
    super(questionTemplateRepository);
  }

  // ... existing methods ...
}
