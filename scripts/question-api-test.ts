import axios from 'axios';

const API_URL = 'http://localhost:3001';
let authToken: string;

`
   Want to understand the newly creates scripts a little better.

   Then do stuff with them.

   Once they run without error, commit



`;

async function login() {
  const response = await axios.post(`${API_URL}/auth/login`, {
    // username: 'testuser',
    // password: 'test123',
    username: 'test@example.com',
    password: 'password123',
  });
  authToken = response.data.access_token;
}

async function createFodderPool() {
  const response = await axios.post(
    `${API_URL}/fodder-pools`,
    {
      name: 'Historical Events',
      description: 'Important dates in history',
      items: [
        { text: 'July 4, 1776' },
        { text: 'December 7, 1941' },
        { text: 'November 9, 1989' },
      ],
    },
    {
      headers: { Authorization: `Bearer ${authToken}` },
    },
  );
  return response.data;
}

async function createQuestionTemplate(fodderPoolId: string) {
  const response = await axios.post(
    `${API_URL}/questions/templates`,
    {
      userPromptType: 'text',
      userResponseType: 'multiple-choice-4',
      exclusivityType: 'exam-practice-both',
      userPromptText: 'When did the Berlin Wall fall?',
      validAnswers: [
        {
          text: 'November 9, 1989',
          fodderPoolId,
        },
      ],
    },
    {
      headers: { Authorization: `Bearer ${authToken}` },
    },
  );
  return response.data;
}

async function generateQuestionActual(templateId: string) {
  const response = await axios.post(
    `${API_URL}/questions/templates/${templateId}/generate`,
    {
      examType: 'practice',
      sectionPosition: 1,
    },
    {
      headers: { Authorization: `Bearer ${authToken}` },
    },
  );
  return response.data;
}

async function main() {
  try {
    console.log('Logging in...');
    await login();

    console.log('Creating fodder pool...');
    const fodderPool = await createFodderPool();
    console.log('Fodder pool created:', fodderPool);

    console.log('Creating question template...');
    const template = await createQuestionTemplate(fodderPool.id);
    console.log('Question template created:', template);

    console.log('Generating question actual...');
    const actual = await generateQuestionActual(template.id);
    console.log('Question actual generated:', actual);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
