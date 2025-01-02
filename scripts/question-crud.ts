import axios from 'axios';

const API_URL = 'http://localhost:3001';

interface Question {
  title: string;
  content: string;
  tags: string[];
  type: 'text' | 'multiple-choice' | 'true-false';
  options?: string[];
  correctAnswer: string;
  isActive?: boolean;
}

async function createQuestion(questionData: Question) {
  try {
    const response = await axios.post(`${API_URL}/questions`, questionData);
    console.log('Question created:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error creating question:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function fetchQuestion(id: string) {
  try {
    const response = await axios.get(`${API_URL}/questions/${id}`);
    console.log('Question fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching question:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function fetchAllQuestions() {
  try {
    const response = await axios.get(`${API_URL}/questions`);
    console.log('All questions fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching questions:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function updateQuestion(id: string, updateData: Partial<Question>) {
  try {
    const response = await axios.patch(
      `${API_URL}/questions/${id}`,
      updateData,
    );
    console.log('Question updated:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error updating question:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function deleteQuestion(id: string) {
  try {
    const response = await axios.delete(`${API_URL}/questions/${id}`);
    console.log('Question deleted:', id);
    return response.data;
  } catch (error) {
    console.error(
      'Error deleting question:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function main() {
  try {
    // Test question data
    const testQuestion: Question = {
      title: 'Test Question',
      content: 'What is the capital of France?',
      tags: ['geography', 'europe'],
      type: 'text',
      correctAnswer: 'Paris',
    };

    // Create question
    console.log('\n--- Creating question ---');
    const createdQuestion = await createQuestion(testQuestion);

    // Fetch all questions
    console.log('\n--- Fetching all questions ---');
    await fetchAllQuestions();

    // Fetch specific question
    console.log('\n--- Fetching specific question ---');
    await fetchQuestion(createdQuestion.id);

    // Update question
    console.log('\n--- Updating question ---');
    await updateQuestion(createdQuestion.id, {
      content: 'What is the capital of France? (Updated)',
      tags: [...testQuestion.tags, 'updated'],
    });

    // Fetch updated question
    console.log('\n--- Fetching updated question ---');
    await fetchQuestion(createdQuestion.id);

    // Delete question
    console.log('\n--- Deleting question ---');
    await deleteQuestion(createdQuestion.id);
  } catch (error) {
    console.error('Script failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
