import { Injectable } from '@nestjs/common';
import { CreateDevDebugDto } from './dto/create-dev-debug.dto';
import { UpdateDevDebugDto } from './dto/update-dev-debug.dto';
import * as questionsJson from './data/questions.json';

import { v4 as uuidv4 } from 'uuid';
type TQuestionAny = {
  userResponseHistory: TUserResponseWrapper[]; // "history" would imply chronological order, which this is not.
} & any;
type TUserResponseWrapper<T = any> = {
  systemUserResponseId: string;
  systemAcceptTimeUtc: number;
  questionId: string; // this creates a redundancy, in-that, ResponseWrapper will only be used in a question (which will have it's own questionId)
  userResponse: T;
};

`

  TQuestionAny should be TQuestionWrapper (or something)
    we should not add dynamic properties
    the wrapper should include 'examId' and other meta data

`;

type TQuestionnaire = {
  questionnaireId: string;
  questions: TQuestionAny;
};

@Injectable()
export class DevDebugService {
  private _activeExams: { [questionnaireId: string]: any } = {};
  private _allActiveExamQuestions: { [questionId: string]: TQuestionAny } = {};

  create(createDevDebugDto: CreateDevDebugDto) {
    return 'This action adds a new devDebug';
  }

  findAll() {
    return `This action returns all devDebug`;
  }

  findOne(id: number) {
    return `This action returns a #${id} devDebug`;
  }

  update(id: number, updateDevDebugDto: UpdateDevDebugDto) {
    return `This action updates a #${id} devDebug`;
  }

  remove(id: number) {
    return `This action removes a #${id} devDebug`;
  }

  getAllActiveQuestions() {
    return this._allActiveExamQuestions;
  }

  // getAllActiveExams() {
  //   return this._activeExams;
  // }

  private getQuestionById(questionId: string): TQuestionAny {
    return this._allActiveExamQuestions[questionId];
  }

  updateUserResponse(
    questionId: string,
    userResponse: { userResponse: any },
  ): TUserResponseWrapper {
    const question = this.getQuestionById(questionId);
    const userResponseWrapper: TUserResponseWrapper = {
      systemUserResponseId: uuidv4(),
      systemAcceptTimeUtc: new Date().getTime(),
      questionId,
      // userResponse,
      userResponse, // make sure to avoid {userResponse:{userResponse:...}}
    };
    // TUserResponseWrapper
    question.userResponseHistory.push(userResponseWrapper);
    return userResponseWrapper;
  }

  createNewQuestionnaire(
    questionnaireTemplateId: string,
    userId: string,
  ): TQuestionnaire {
    const examId = uuidv4();
    const templateQuestions = structuredClone(questionsJson); // in real life we would be doing something like getTemplateById(...)

    const questionDictionary = templateQuestions.questions.reduce(
      (acc, questionTemplate) => {
        const questionId = [examId, questionTemplate.questionId].join(':');
        questionTemplate.questionId = questionId;
        // @ts-ignore 'examId' not property of questionAny
        questionTemplate.examId = examId;

        questionTemplate.userResponseHistory =
          questionTemplate.userResponseHistory || [];

        this._allActiveExamQuestions[questionId] = questionTemplate;
        // theQuestions.questions[questionId] = questionTemplate;
        acc[questionId] = this._allActiveExamQuestions[questionId];
        return acc;
      },
      {},
    );

    this._activeExams[examId] = {
      questions: questionDictionary,
      // answers: [],
      examId,
      userId,
      questionnaireTemplateId:
        questionnaireTemplateId || './data/questions.json', // *tmc* debug
    };

    return {
      questionnaireId: this._activeExams[examId].questionnaireId,
      questions: Object.values(this._activeExams[examId].questions),
    };
  }
}
