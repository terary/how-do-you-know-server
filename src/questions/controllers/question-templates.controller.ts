import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { QuestionTemplatesService } from '../services/question-templates.service';
import { QuestionTemplate } from '../entities/question-template.entity';
import { TaggableController } from '../../common/controllers/taggable.controller';

@ApiTags('question-templates')
@Controller('question-templates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class QuestionTemplatesController extends TaggableController<QuestionTemplate> {
  constructor(
    private readonly questionTemplatesService: QuestionTemplatesService,
  ) {
    super(questionTemplatesService);
  }

  // ... existing methods ...
}
