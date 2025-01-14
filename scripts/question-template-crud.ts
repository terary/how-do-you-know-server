import axios from 'axios';
import { config } from 'dotenv';
import { TUserPromptType, TUserResponseType } from '../src/questions/types';

config();

const API_URL = process.env.API_URL || 'http://localhost:3001';
let authToken: string;

interface QuestionTemplate {
  id: string;
  userPromptType: TUserPromptType;
  userResponseType: TUserResponseType;
  exclusivityType: 'exam-only' | 'practice-only' | 'exam-practice-both';
  userPromptText: string | null;
  instructionText: string | null;
  created_by: string;
  created_at: Date;
  media?: {
    mediaContentType: 'audio/mpeg' | 'video/mp4';
    height: number;
    width: number;
    url: string;
    specialInstructionText?: string;
    duration?: number;
    fileSize?: number;
    thumbnailUrl?: string;
  }[];
  validAnswers?: {
    text?: string;
    booleanValue?: boolean;
    fodderPoolId?: string;
  }[];
}

async function login() {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username: 'test@example.com',
      password: 'password123',
    });
    authToken = response.data.access_token;
    console.log('Login successful');
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function createQuestionTemplate(data: Partial<QuestionTemplate>) {
  try {
    const response = await axios.post(`${API_URL}/questions/templates`, data, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Question template created:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error creating question template:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function getQuestionTemplate(id: string) {
  try {
    const response = await axios.get(`${API_URL}/questions/templates/${id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Question template fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching question template:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function generateQuestionActual(
  templateId: string,
  examType: 'practice' | 'live',
  sectionPosition: number,
) {
  try {
    const response = await axios.post(
      `${API_URL}/questions/templates/${templateId}/generate`,
      {
        examType,
        sectionPosition,
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    );
    console.log('Question actual generated:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error generating question actual:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function getQuestionActual(id: string) {
  try {
    const response = await axios.get(`${API_URL}/questions/actuals/${id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Question actual fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching question actual:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function main() {
  try {
    // First, login to get the auth token
    console.log('\n--- Logging in ---');
    await login();

    // Create a question template
    console.log('\n--- Creating question template ---');
    const templateData = {
      userPromptType: 'text' as TUserPromptType,
      userResponseType: 'multiple-choice-4' as TUserResponseType,
      exclusivityType: 'exam-practice-both' as const,
      userPromptText: 'What is the capital of France?',
      validAnswers: [
        {
          text: 'Paris',
        },
      ],
    };
    const template = await createQuestionTemplate(templateData);

    // Fetch the created template
    console.log('\n--- Fetching question template ---');
    await getQuestionTemplate(template.id);

    // Generate a practice question from the template
    console.log('\n--- Generating practice question ---');
    const actual = await generateQuestionActual(template.id, 'practice', 1);

    // Fetch the generated question
    console.log('\n--- Fetching generated question ---');
    await getQuestionActual(actual.id);
  } catch (error) {
    console.error('Script failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
