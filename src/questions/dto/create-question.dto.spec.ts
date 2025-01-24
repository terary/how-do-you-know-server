import { CreateQuestionDto } from './create-question.dto';

describe('CreateQuestionDto', () => {
  it('should be defined', () => {
    const dto = new CreateQuestionDto();
    expect(dto).toBeDefined();
  });
});
