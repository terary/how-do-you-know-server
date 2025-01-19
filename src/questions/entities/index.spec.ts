import * as entities from './index';
import { FodderPool } from './fodder-pool.entity';
import { FodderItem } from './fodder-item.entity';
import { QuestionTemplate } from './question-template.entity';
import { QuestionTemplateMedia } from './question-template-media.entity';
import { QuestionTemplateValidAnswer } from './question-template-valid-answer.entity';
import { QuestionActual } from './question-actual.entity';
import { QuestionActualChoice } from './question-actual-choice.entity';
import { QuestionActualValidAnswer } from './question-actual-valid-answer.entity';

describe('entities/index.ts', () => {
  it('should export all entity classes', () => {
    expect(entities.FodderPool).toBe(FodderPool);
    expect(entities.FodderItem).toBe(FodderItem);
    expect(entities.QuestionTemplate).toBe(QuestionTemplate);
    expect(entities.QuestionTemplateMedia).toBe(QuestionTemplateMedia);
    expect(entities.QuestionTemplateValidAnswer).toBe(
      QuestionTemplateValidAnswer,
    );
    expect(entities.QuestionActual).toBe(QuestionActual);
    expect(entities.QuestionActualChoice).toBe(QuestionActualChoice);
    expect(entities.QuestionActualValidAnswer).toBe(QuestionActualValidAnswer);
  });
});
