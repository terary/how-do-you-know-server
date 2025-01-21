import { QuestionsModule } from './questions.module';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import {
  FodderPool,
  FodderItem,
  QuestionTemplate,
  QuestionTemplateMedia,
  QuestionTemplateValidAnswer,
  QuestionActual,
  QuestionActualChoice,
  QuestionActualValidAnswer,
} from './entities';
import { ModuleTestFactory } from '../common/test/module-test.factory';

describe('QuestionsModule', () => {
  const testFactory = new ModuleTestFactory({
    module: QuestionsModule,
    imports: [QuestionsModule],
    providers: [QuestionsService],
    controllers: [QuestionsController],
    exports: [QuestionsService],
    entities: [
      FodderPool,
      FodderItem,
      QuestionActualChoice,
      QuestionActualValidAnswer,
      QuestionTemplate,
      QuestionTemplateValidAnswer,
      QuestionTemplateMedia,
      QuestionActual,
    ],
  });

  // Run common module tests
  testFactory.createTestCases(describe);

  // Add module-specific tests here if needed
});
