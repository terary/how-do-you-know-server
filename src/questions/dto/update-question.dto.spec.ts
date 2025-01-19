import { UpdateQuestionDto } from './update-question.dto';

describe('UpdateQuestionDto', () => {
  it('should be defined', () => {
    const dto = new UpdateQuestionDto();
    expect(dto).toBeDefined();
  });

  it('should extend CreateQuestionDto', () => {
    const dto = new UpdateQuestionDto();
    expect(dto).toBeInstanceOf(UpdateQuestionDto);
  });
});
