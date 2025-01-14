`
  Naming convention:
    TQuestion[UserPromptType][UserResponseType]

    User Prompt is the CTA for the question, can be video, audio, text, etc.
       Will include text for the question 'what is in the image' or 'what is the sound'

    User Response is the expected data type to be received from the Front-end/user.
      - maybe text, a list of items (check all that apply), a value within a range (one of the following options)

`;
// "fodder" is a term used to describe people or things that are useful for a specific purpose.
// such as "fodder for a comedian's routine"
// - so there is no confusion with the word 'folder' ... AI is weird about this.
// fodder are the options that is use to generate false options to multiple choice questions, for randomization purposes

type TUserPromptType = 'text' | 'multimedia';
type TUserResponseType = 'free-text-255' | 'multiple-choice-4' | 'true-false';
type TTextItem = { text: string };
type TBooleanItem = { value: boolean };
type TMultipleMediaProperties = {
  mediaContentType: 'audio/mpeg' | 'video/mp4';
  height: number;
  width: number;
  url: string;
  specialInstructionText: string;
};

type TQuestionGeneric<
  // maybe these types shouldn't have default values
  UPromptType extends TUserPromptType = 'text',
  UResponseType extends TUserResponseType = 'free-text-255',
> = {
  userPromptType: UPromptType;
  userResponseType: UResponseType;
  questionId: string;
};

type TQuestionTextText = TQuestionGeneric<'text', 'free-text-255'> & {
  userPromptText: string;
};
type TQuestionTextMultipleChoice4 = TQuestionGeneric<
  'text',
  'multiple-choice-4'
> & {
  userPromptText: string;
  choices: { text: string }[];
  validAnswers: TTextItem[]; // sometimes submitting image or sound file - in which case it wont be multiple guess
  answerFodderId: string;
};
type TQuestionTextTrueFalse = TQuestionGeneric<'text', 'true-false'> & {
  userPromptText: string;
  validAnswers: TBooleanItem[]; // sometimes submitting image or sound file - in which case it wont be multiple guess
};

// --------------

type TQuestionMultimediaText = TQuestionGeneric<
  'multimedia',
  'free-text-255'
> & {
  links: TMultipleMediaProperties[];
  instructionText: string;
};

type TQuestionMultimediaMultipleChoice4 = TQuestionGeneric<
  'multimedia',
  'multiple-choice-4'
> & {
  links: TMultipleMediaProperties[];
  instructionText: string;
  choices: { text: string }[];
  validAnswers: TTextItem[]; // sometimes submitting image or sound file - in which case it wont be multiple guess
  answerFodderId: string;
};

type TQuestionMultimediaTrueFalse = TQuestionGeneric<
  'multimedia',
  'true-false'
> & {
  links: TMultipleMediaProperties[];
  instructionText: string;
  validAnswers: TBooleanItem[]; // sometimes submitting image or sound file - in which case it wont be multiple guess
};

type TQuestionAny =
  | TQuestionTextMultipleChoice4
  | TQuestionTextText
  | TQuestionTextTrueFalse
  | TQuestionMultimediaMultipleChoice4
  | TQuestionMultimediaText
  | TQuestionMultimediaTrueFalse;

export type {
  // TAnswerType,
  TQuestionAny,
  TQuestionTextMultipleChoice4,
  // TQuestionTrueFalse,
};
