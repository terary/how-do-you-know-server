type UserResponseText = {
  text: string;
};

type UserResponseMultiSelect = {
  selectedOptions: string[];
};

class DevDebugUpdateQuestionGenericDto<T = UserResponseText> {
  examId?: string; // optional at this time because A) examine id is part of questionId, B) Not really sure where we're going with this
  questionId: string;
  userResponse: T;
}

export class DevDebugUpdateQuestionTextDto extends DevDebugUpdateQuestionGenericDto<UserResponseText> {}
export class DevDebugUpdateQuestionMultiSelectDto extends DevDebugUpdateQuestionGenericDto<UserResponseMultiSelect> {}
