import { Test, TestingModule } from '@nestjs/testing';
import { DevDebugService } from './dev-debug.service';
`
Back-end looks good.  Need unbreak FE - then move forward with something significant (mono repo? yuck)


`;

describe('DevDebugService', () => {
  let service: DevDebugService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevDebugService],
    }).compile();

    service = module.get<DevDebugService>(DevDebugService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('.createNewQuestionnaire(...)', () => {
    it('Should be awesome', () => {
      service.createNewQuestionnaire('questionnaireId', 'userId');
      const allQuestions = service.getAllActiveQuestions();
      // const allExams = service.getAllActiveExams();
    });
  });
  describe('.updateUserResponse(...)', () => {
    it.only('Should update the _allActiveExamQuestions[questionId] with provided userResponse.', () => {
      const questionnaire = service.createNewQuestionnaire(
        '_QUESTIONNAIRE_ID_',
        '_USER_ID_',
      );

      const question = Object.values(questionnaire.questions).pop() as any; // *tmc* debug use of "any"
      const testQuestionId = question.questionId;
      const testUserResponse = {
        systemUserResponseId: Date.now() + '',
        systemAcceptTime: Date.now(),
        questionId: testQuestionId,
        userResponse: { text: 'test response' },
      };

      // exercise
      service.updateUserResponse(testQuestionId, testUserResponse);

      const updatedQuestion = service.getAllActiveQuestions()[testQuestionId];
      expect(updatedQuestion.userResponseHistory[0]).toEqual(
        expect.objectContaining({
          systemUserResponseId: expect.any(String), // uuid
          systemAcceptTimeUtc: expect.any(Number),
          questionId: expect.any(String), // uuid,
          userResponse: expect.objectContaining({
            systemUserResponseId: expect.any(String),
            systemAcceptTime: expect.any(Number),
            questionId: expect.any(String), // uuid
            userResponse: {
              text: 'test response',
            },
          }),
        }),
      );
    });
  });
});
