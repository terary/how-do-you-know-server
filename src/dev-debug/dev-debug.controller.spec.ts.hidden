import { Test, TestingModule } from '@nestjs/testing';
import { DevDebugController } from './dev-debug.controller';
import { DevDebugService } from './dev-debug.service';

describe('DevDebugController', () => {
  let controller: DevDebugController;
  let service: DevDebugService; // Add service variable

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevDebugController],
      providers: [DevDebugService],
    }).compile();

    controller = module.get<DevDebugController>(DevDebugController);
    service = module.get<DevDebugService>(DevDebugService); // Get service instance
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('setUserAnswers', () => {
    it('Should call call devDebugService.updateUserResponse with the provided questionId and userResponse', async () => {
      const mockUpdateUserResponse = jest.spyOn(service, 'updateUserResponse'); // Use service instance
      const questionnaire = service.createNewQuestionnaire(
        '_QUESTIONNAIRE_ID_',
        '_USER_ID_',
      );

      const question = Object.values(questionnaire.questions).pop();
      const testQuestionId = question.questionId; // 'test-exam-id:test-question-id';
      const testUserResponse = {
        text: 'test response',
      };

      const updateDto = {
        questionId: testQuestionId,
        userResponse: testUserResponse,
      };

      await controller.setUserAnswers(updateDto);

      expect(mockUpdateUserResponse).toHaveBeenCalledWith(
        testQuestionId,
        expect.objectContaining({
          questionId: testQuestionId,
          userResponse: testUserResponse,
        }),
      );
    });
  });
});
