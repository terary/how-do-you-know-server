import { DataSource } from 'typeorm';
import {
  FodderPool,
  FodderItem,
  QuestionTemplate,
  QuestionTemplateMedia,
  QuestionTemplateValidAnswer,
  QuestionActual,
  QuestionActualChoice,
  QuestionActualValidAnswer,
} from '../src/questions/entities';

async function createFodderPools(
  dataSource: DataSource,
  testUserId: string,
): Promise<FodderPool[]> {
  const pools = await dataSource
    .createQueryBuilder()
    .insert()
    .into(FodderPool)
    .values([
      {
        name: 'Historical Dates',
        description: 'Important dates in history for multiple choice questions',
        created_by: testUserId,
      },
      {
        name: 'Famous Birthdays',
        description: 'Birth dates of famous people',
        created_by: testUserId,
      },
      {
        name: 'Mathematical Constants',
        description: 'Common mathematical constants and their values',
        created_by: testUserId,
      },
    ])
    .execute();

  return pools.identifiers as FodderPool[];
}

async function createFodderItems(
  dataSource: DataSource,
  pools: FodderPool[],
  testUserId: string,
): Promise<void> {
  const [historicalDates, famousBirthdays, mathConstants] = pools;

  await dataSource
    .createQueryBuilder()
    .insert()
    .into(FodderItem)
    .values([
      // Historical Dates
      {
        pool_id: historicalDates.id,
        text: 'July 4, 1776',
        created_by: testUserId,
      },
      {
        pool_id: historicalDates.id,
        text: 'December 7, 1941',
        created_by: testUserId,
      },
      {
        pool_id: historicalDates.id,
        text: 'November 9, 1989',
        created_by: testUserId,
      },
      {
        pool_id: historicalDates.id,
        text: 'October 29, 1929',
        created_by: testUserId,
      },
      // Famous Birthdays
      {
        pool_id: famousBirthdays.id,
        text: 'January 27, 1756',
        created_by: testUserId,
      },
      {
        pool_id: famousBirthdays.id,
        text: 'December 16, 1770',
        created_by: testUserId,
      },
      {
        pool_id: famousBirthdays.id,
        text: 'May 7, 1840',
        created_by: testUserId,
      },
      {
        pool_id: famousBirthdays.id,
        text: 'March 28, 1986',
        created_by: testUserId,
      },
      // Math Constants
      {
        pool_id: mathConstants.id,
        text: '3.14159',
        created_by: testUserId,
      },
      {
        pool_id: mathConstants.id,
        text: '2.71828',
        created_by: testUserId,
      },
      {
        pool_id: mathConstants.id,
        text: '1.41421',
        created_by: testUserId,
      },
      {
        pool_id: mathConstants.id,
        text: '1.61803',
        created_by: testUserId,
      },
    ])
    .execute();
}

async function createQuestionTemplates(
  dataSource: DataSource,
  pools: FodderPool[],
  testUserId: string,
): Promise<QuestionTemplate[]> {
  const [historicalDates, famousBirthdays, mathConstants] = pools;

  const templates = await dataSource
    .createQueryBuilder()
    .insert()
    .into(QuestionTemplate)
    .values([
      // Text Multiple Choice
      {
        userPromptType: 'text',
        userResponseType: 'multiple-choice-4',
        exclusivityType: 'exam-practice-both',
        userPromptText: 'When was Mozart born?',
        created_by: testUserId,
      },
      // Text True/False
      {
        userPromptType: 'text',
        userResponseType: 'true-false',
        exclusivityType: 'practice-only',
        userPromptText: 'Mozart was born in the 18th century.',
        created_by: testUserId,
      },
      // Multimedia Multiple Choice
      {
        userPromptType: 'multimedia',
        userResponseType: 'multiple-choice-4',
        exclusivityType: 'exam-only',
        instructionText:
          'Watch the video and identify when this historical event occurred.',
        created_by: testUserId,
      },
    ])
    .execute();

  const questionTemplates = templates.identifiers as QuestionTemplate[];
  const [mozartBirthday, mozartCentury, historicalVideo] = questionTemplates;

  // Create valid answers
  await dataSource
    .createQueryBuilder()
    .insert()
    .into(QuestionTemplateValidAnswer)
    .values([
      {
        template_id: mozartBirthday.id,
        text: 'January 27, 1756',
        fodderPoolId: famousBirthdays.id,
      },
      {
        template_id: mozartCentury.id,
        booleanValue: true,
      },
      {
        template_id: historicalVideo.id,
        text: 'November 9, 1989',
        fodderPoolId: historicalDates.id,
      },
    ])
    .execute();

  // Create media for multimedia question
  await dataSource
    .createQueryBuilder()
    .insert()
    .into(QuestionTemplateMedia)
    .values([
      {
        template_id: historicalVideo.id,
        mediaContentType: 'video/mp4',
        height: 720,
        width: 1280,
        url: 'https://example.com/berlin-wall-fall.mp4',
        specialInstructionText:
          'Pay attention to the date shown in the news footage.',
        duration: 120,
        fileSize: 15000000,
        thumbnailUrl: 'https://example.com/berlin-wall-thumbnail.jpg',
      },
    ])
    .execute();

  return questionTemplates;
}

async function createQuestionActuals(
  dataSource: DataSource,
  templates: QuestionTemplate[],
): Promise<void> {
  const [mozartBirthday, mozartCentury, historicalVideo] = templates;

  // Create practice question from Mozart birthday template
  const practiceActual = await dataSource
    .createQueryBuilder()
    .insert()
    .into(QuestionActual)
    .values([
      {
        template_id: mozartBirthday.id,
        examType: 'practice',
        sectionPosition: 1,
        userPromptText: 'When was Mozart born?',
      },
    ])
    .execute();

  const [practiceQuestion] = practiceActual.identifiers as QuestionActual[];

  // Create choices for practice question
  await dataSource
    .createQueryBuilder()
    .insert()
    .into(QuestionActualChoice)
    .values([
      {
        question_actual_id: practiceQuestion.id,
        text: 'January 27, 1756',
        isCorrect: true,
        position: 0,
      },
      {
        question_actual_id: practiceQuestion.id,
        text: 'December 16, 1770',
        isCorrect: false,
        position: 1,
      },
      {
        question_actual_id: practiceQuestion.id,
        text: 'May 7, 1840',
        isCorrect: false,
        position: 2,
      },
      {
        question_actual_id: practiceQuestion.id,
        text: 'March 28, 1986',
        isCorrect: false,
        position: 3,
      },
    ])
    .execute();

  // Add valid answer for practice question
  await dataSource
    .createQueryBuilder()
    .insert()
    .into(QuestionActualValidAnswer)
    .values([
      {
        question_actual_id: practiceQuestion.id,
        text: 'January 27, 1756',
      },
    ])
    .execute();
}

async function main() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'wdyk',
    entities: ['src/**/*.entity.ts'],
    synchronize: false,
  });

  await dataSource.initialize();

  try {
    const testUserId = '00000000-0000-0000-0000-000000000000'; // Replace with actual test user ID

    console.log('Creating fodder pools...');
    const pools = await createFodderPools(dataSource, testUserId);

    console.log('Creating fodder items...');
    await createFodderItems(dataSource, pools, testUserId);

    console.log('Creating question templates...');
    const templates = await createQuestionTemplates(
      dataSource,
      pools,
      testUserId,
    );

    console.log('Creating question actuals...');
    await createQuestionActuals(dataSource, templates);

    console.log('Test data generation complete!');
  } catch (error) {
    console.error('Error generating test data:', error);
  } finally {
    await dataSource.destroy();
  }
}

if (require.main === module) {
  main().catch(console.error);
}
