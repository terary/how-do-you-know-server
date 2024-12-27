import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DevDebugService } from './dev-debug.service';
import { CreateDevDebugDto } from './dto/create-dev-debug.dto';
import { UpdateDevDebugDto } from './dto/update-dev-debug.dto';
import { AuthGuard } from '../auth/auth.guard';

import {
  DevDebugUpdateQuestionTextDto,
  DevDebugUpdateQuestionMultiSelectDto,
} from './dto/dev-debug-update-question.dto';

import * as questionsJson from './data/questions.json';
const cachedUserResponse: any[] = [];

@Controller('dev-debug')
export class DevDebugController {
  private readonly logger = new Logger(DevDebugController.name);

  constructor(private readonly devDebugService: DevDebugService) {}

  @Post()
  create(@Body() createDevDebugDto: CreateDevDebugDto) {
    return this.devDebugService.create(createDevDebugDto);
  }

  @Get()
  findAll() {
    return this.devDebugService.findAll();
  }

  @Get('/questions')
  getQuestions() {
    return questionsJson;
  }

  @Get('/user-answers')
  getUserAnswers() {
    this.logger.log(
      JSON.stringify({
        getUserAnswers: {
          cachedUserResponse,
          questionsJson,
          // updateDto: JSON.stringify(updateDto),
        },
      }),
    );

    return [];
  }

  @Get('/auth/user-answers/questionnaire')
  @UseGuards(AuthGuard)
  getQuestionnaireAuth() {
    const questionnaire = this.devDebugService.createNewQuestionnaire(
      'questionTemplateId',
      'userId',
    );

    this.logger.log({
      getQuestionnaire: {
        cachedUserResponse,
        questionsJson,
        // updateDto: JSON.stringify(updateDto),
      },
    });
    // return questionsJson;

    return questionnaire;
  }

  @Get('/user-answers/questionnaire')
  getQuestionnaire() {
    const questionnaire = this.devDebugService.createNewQuestionnaire(
      'questionTemplateId',
      'userId',
    );

    this.logger.log({
      getQuestionnaire: {
        cachedUserResponse,
        questionsJson,
        // updateDto: JSON.stringify(updateDto),
      },
    });
    // return questionsJson;

    return questionnaire;
  }

  @Post('/user-answers')
  async setUserAnswers(
    @Body()
    updateDto:
      | DevDebugUpdateQuestionTextDto
      | DevDebugUpdateQuestionMultiSelectDto,
  ) {
    // async setUserAnswers(@Req() request: Request) {
    this.logger.log({ 'user-answers': 'hello world', updateDto: updateDto });
    const { userResponse, questionId } = updateDto;
    const examId = updateDto?.examId || questionId.split(':')[0];

    // const returnValue = {
    //   systemUserResponseId: new Date().getTime(),
    //   systemAcceptTime: new Date().getTime(),
    //   questionId,
    //   userResponse: userResponse,
    //   // userResponses: [],
    //   // UserResponses: [{ one: 'two' }],
    //   // userResponses: [{ three: 'two' }],
    // };

    const returnValue = this.devDebugService.updateUserResponse(
      questionId,
      userResponse as any,
    );

    this.logger.log({
      setUserAnswers: {
        cachedUserResponse,
        updateDto: JSON.stringify(updateDto),
      },
    });
    // return { returnValue, UserResponses: cachedUserResponse };
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
    return returnValue;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devDebugService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDevDebugDto: UpdateDevDebugDto,
  ) {
    return this.devDebugService.update(+id, updateDevDebugDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.devDebugService.remove(+id);
  }
}
