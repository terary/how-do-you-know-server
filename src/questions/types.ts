/** Type definitions for the question and answer system */

`
  Naming convention:
    TQuestion[UserPromptType][UserResponseType]

    User Prompt is the CTA for the question, can be video, audio, text, etc.
       Will include text for the question 'what is in the image' or 'what is the sound'

    User Response is the expected data type to be received from the Front-end/user.
      - maybe text, a list of items (check all that apply), a value within a range (one of the following options)



The main differences between Template and Actual are now clearly defined:
Templates have fodder pools, Actual's have concrete choices
Templates always have answers, Actual's only have answers for practice exams
Actual's track their source template and position in section
Templates specify their exclusivity settings
Would you like me to explain any part of these changes in more detail?      

`;
// "fodder" is a term used to describe people or things that are useful for a specific purpose.
// such as "fodder for a comedian's routine"
// - so there is no confusion with the word 'folder' ... AI is weird about this.
// fodder are the options that is use to generate false options to multiple choice questions, for randomization purposes

/** Supported types of user prompts */
type TUserPromptType = 'text' | 'multimedia';

/** Supported types of user responses */
type TUserResponseType = 'free-text-255' | 'multiple-choice-4' | 'true-false';

/** Represents a text-based item with validation */
type TTextItem = { readonly text: string & { length: 1 } };

/** Represents a boolean-based answer */
type TBooleanItem = { readonly value: boolean };

/** Exact tuple type for multiple choice options */
type TMultipleChoiceOptions = readonly [
  { text: string },
  { text: string },
  { text: string },
  { text: string },
];

/** Media content type */
type TMediaContentType =
  | 'application/octet-stream'
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'image/webp'
  | 'image/svg+xml'
  | 'image/*'
  | 'audio/mpeg'
  | 'audio/wav'
  | 'audio/ogg'
  | 'audio/aac'
  | 'audio/webm'
  | 'audio/*'
  | 'video/mp4'
  | 'video/webm'
  | 'video/ogg'
  | 'video/avi'
  | 'video/quicktime'
  | 'video/*';

/** Properties for multimedia content with enhanced validation */
type TMultipleMediaProperties = {
  readonly mediaContentType: TMediaContentType;
  readonly height: number & { readonly _brand: 'PositiveNumber' };
  readonly width: number & { readonly _brand: 'PositiveNumber' };
  readonly url: string;
  readonly specialInstructionText: string;
  readonly duration?: number; // Duration in seconds for audio/video
  readonly fileSize?: number; // File size in bytes
  readonly thumbnailUrl?: string; // Optional preview image for video
};

/** Base question type with common properties */
type TQuestionGeneric<
  UPromptType extends TUserPromptType = 'text',
  UResponseType extends TUserResponseType = 'free-text-255',
> = {
  readonly userPromptType: UPromptType;
  readonly userResponseType: UResponseType;
  readonly questionId: string;
};

/** Text-based question with free text response */
type TQuestionTextText = TQuestionGeneric<'text', 'free-text-255'> & {
  readonly userPromptText: string;
};

/** Text-based multiple choice question */
type TQuestionTextMultipleChoice4 = TQuestionGeneric<
  'text',
  'multiple-choice-4'
> & {
  readonly userPromptText: string;
  readonly choices: TMultipleChoiceOptions;
  readonly validAnswers: readonly TTextItem[];
  readonly answerFodderId: string;
};

/** Text-based true/false question */
type TQuestionTextTrueFalse = TQuestionGeneric<'text', 'true-false'> & {
  readonly userPromptText: string;
  readonly validAnswers: readonly [TBooleanItem];
};

// --------------

/** Multimedia question with free text response */
type TQuestionMultimediaText = TQuestionGeneric<
  'multimedia',
  'free-text-255'
> & {
  readonly links: readonly TMultipleMediaProperties[];
  readonly instructionText: string;
};

/** Multimedia multiple choice question */
type TQuestionMultimediaMultipleChoice4 = TQuestionGeneric<
  'multimedia',
  'multiple-choice-4'
> & {
  readonly links: readonly TMultipleMediaProperties[];
  readonly instructionText: string;
  readonly choices: TMultipleChoiceOptions;
  readonly validAnswers: readonly TTextItem[];
  readonly answerFodderId: string;
};

/** Multimedia true/false question */
type TQuestionMultimediaTrueFalse = TQuestionGeneric<
  'multimedia',
  'true-false'
> & {
  readonly links: readonly TMultipleMediaProperties[];
  readonly instructionText: string;
  readonly validAnswers: readonly [TBooleanItem];
};

/** Union type of all possible question types */
type TQuestionAny =
  | TQuestionTextMultipleChoice4
  | TQuestionTextText
  | TQuestionTextTrueFalse
  | TQuestionMultimediaMultipleChoice4
  | TQuestionMultimediaText
  | TQuestionMultimediaTrueFalse;

/** Question exclusivity settings */
type TQuestionExclusivity =
  | 'exam-only'
  | 'practice-only'
  | 'exam-practice-both';

/** Exam types */
type TExamType = 'practice' | 'live';

/** Base template type with common properties */
type TQuestionTemplateGeneric<
  UPromptType extends TUserPromptType = 'text',
  UResponseType extends TUserResponseType = 'free-text-255',
> = {
  readonly userPromptType: UPromptType;
  readonly userResponseType: UResponseType;
  readonly questionId: string;
  readonly exclusivityType: TQuestionExclusivity;
};

/** Base actual type with common properties */
type TQuestionActualGeneric<
  UPromptType extends TUserPromptType = 'text',
  UResponseType extends TUserResponseType = 'free-text-255',
> = {
  readonly userPromptType: UPromptType;
  readonly userResponseType: UResponseType;
  readonly questionId: string;
  readonly templateId: string;
  readonly examType: TExamType;
  readonly sectionPosition: number;
};

/** Text-based template with free text response */
type TQuestionTemplateTextText = TQuestionTemplateGeneric<
  'text',
  'free-text-255'
> & {
  readonly userPromptText: string;
  readonly validAnswers: readonly TTextItem[];
};

/** Text-based actual with free text response */
type TQuestionActualTextText = TQuestionActualGeneric<
  'text',
  'free-text-255'
> & {
  readonly userPromptText: string;
  readonly validAnswers?: readonly TTextItem[]; // Only present for practice exams
};

/** Text-based multiple choice template */
type TQuestionTemplateTextMultipleChoice4 = TQuestionTemplateGeneric<
  'text',
  'multiple-choice-4'
> & {
  readonly userPromptText: string;
  readonly validAnswers: readonly TTextItem[];
  readonly fodderPoolId: string;
};

/** Text-based multiple choice actual */
type TQuestionActualTextMultipleChoice4 = TQuestionActualGeneric<
  'text',
  'multiple-choice-4'
> & {
  readonly userPromptText: string;
  readonly choices: TMultipleChoiceOptions;
  readonly validAnswers?: readonly TTextItem[]; // Only present for practice exams
};

/** Text-based true/false template */
type TQuestionTemplateTextTrueFalse = TQuestionTemplateGeneric<
  'text',
  'true-false'
> & {
  readonly userPromptText: string;
  readonly validAnswers: readonly [TBooleanItem];
};

/** Text-based true/false actual */
type TQuestionActualTextTrueFalse = TQuestionActualGeneric<
  'text',
  'true-false'
> & {
  readonly userPromptText: string;
  readonly choices: readonly [{ text: 'True' }, { text: 'False' }];
  readonly validAnswers?: readonly [TBooleanItem]; // Only present for practice exams
};

// Multimedia templates
type TQuestionTemplateMultimediaText = TQuestionTemplateGeneric<
  'multimedia',
  'free-text-255'
> & {
  readonly links: readonly TMultipleMediaProperties[];
  readonly instructionText: string;
  readonly validAnswers: readonly TTextItem[];
};

type TQuestionTemplateMultimediaMultipleChoice4 = TQuestionTemplateGeneric<
  'multimedia',
  'multiple-choice-4'
> & {
  readonly links: readonly TMultipleMediaProperties[];
  readonly instructionText: string;
  readonly validAnswers: readonly TTextItem[];
  readonly fodderPoolId: string;
};

type TQuestionTemplateMultimediaTrueFalse = TQuestionTemplateGeneric<
  'multimedia',
  'true-false'
> & {
  readonly links: readonly TMultipleMediaProperties[];
  readonly instructionText: string;
  readonly validAnswers: readonly [TBooleanItem];
};

// Multimedia actuals
type TQuestionActualMultimediaText = TQuestionActualGeneric<
  'multimedia',
  'free-text-255'
> & {
  readonly links: readonly TMultipleMediaProperties[];
  readonly instructionText: string;
  readonly validAnswers?: readonly TTextItem[]; // Only present for practice exams
};

type TQuestionActualMultimediaMultipleChoice4 = TQuestionActualGeneric<
  'multimedia',
  'multiple-choice-4'
> & {
  readonly links: readonly TMultipleMediaProperties[];
  readonly instructionText: string;
  readonly choices: TMultipleChoiceOptions;
  readonly validAnswers?: readonly TTextItem[]; // Only present for practice exams
};

type TQuestionActualMultimediaTrueFalse = TQuestionActualGeneric<
  'multimedia',
  'true-false'
> & {
  readonly links: readonly TMultipleMediaProperties[];
  readonly instructionText: string;
  readonly choices: readonly [{ text: 'True' }, { text: 'False' }];
  readonly validAnswers?: readonly [TBooleanItem]; // Only present for practice exams
};

/** Union type of all possible template types */
type TQuestionTemplateAny =
  | TQuestionTemplateTextMultipleChoice4
  | TQuestionTemplateTextText
  | TQuestionTemplateTextTrueFalse
  | TQuestionTemplateMultimediaMultipleChoice4
  | TQuestionTemplateMultimediaText
  | TQuestionTemplateMultimediaTrueFalse;

/** Union type of all possible actual types */
type TQuestionActualAny =
  | TQuestionActualTextMultipleChoice4
  | TQuestionActualTextText
  | TQuestionActualTextTrueFalse
  | TQuestionActualMultimediaMultipleChoice4
  | TQuestionActualMultimediaText
  | TQuestionActualMultimediaTrueFalse;

export type {
  TQuestionTemplateAny,
  TQuestionActualAny,
  TQuestionTemplateTextMultipleChoice4,
  TQuestionActualTextMultipleChoice4,
  TUserPromptType,
  TUserResponseType,
  TMediaContentType,
};
