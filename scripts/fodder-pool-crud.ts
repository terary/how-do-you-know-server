import axios from 'axios';
import { config } from 'dotenv';

config();

console.log('Environment Variables:', {
  CRUD_TEST_SCRIPT_USERNAME:
    process.env.CRUD_TEST_SCRIPT_USERNAME || 'test@example.com',
  API_URL: process.env.API_URL || 'http://localhost:3001',
});

const API_URL = process.env.API_URL || 'http://localhost:3001';
let authToken: string;
let userId: string;

async function login() {
  console.log('\nAttempting login...');
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username: process.env.CRUD_TEST_SCRIPT_USERNAME || 'test@example.com',
      password: process.env.CRUD_TEST_SCRIPT_PASSWORD || 'password123',
    });
    authToken = response.data.access_token;

    // Get user info
    const userResponse = await axios.get(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    userId = userResponse.data.id;

    console.log('Login successful');
    console.log('User ID:', userId);
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function createFodderPool() {
  console.log('\nCreating fodder pool...');
  const response = await axios.post(
    `${API_URL}/fodder-pools`,
    {
      name: 'Historical Events',
      description: 'Important dates in history',
      items: [{ text: 'July 4, 1776' }, { text: 'December 7, 1941' }],
    },
    {
      headers: { Authorization: `Bearer ${authToken}` },
    },
  );
  console.log('Created fodder pool:', response.data);
  return response.data;
}

async function getFodderPool(id: string) {
  console.log('\nGetting fodder pool...');
  const response = await axios.get(`${API_URL}/fodder-pools/${id}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  console.log('Retrieved fodder pool:', response.data);
  return response.data;
}

async function addFodderItems(poolId: string) {
  console.log('\nAdding items to fodder pool...');
  const response = await axios.post(
    `${API_URL}/fodder-pools/${poolId}/items`,
    [{ text: 'November 9, 1989' }, { text: 'October 29, 1929' }],
    {
      headers: { Authorization: `Bearer ${authToken}` },
    },
  );
  console.log('Added items:', response.data);
  return response.data;
}

async function removeFodderItems(poolId: string, itemIds: string[]) {
  console.log('\nRemoving items from fodder pool...');
  await axios.delete(`${API_URL}/fodder-pools/${poolId}/items`, {
    headers: { Authorization: `Bearer ${authToken}` },
    data: { itemIds },
  });
  console.log('Items removed');
}

async function deleteFodderPool(id: string) {
  console.log('\nDeleting fodder pool...');
  await axios.delete(`${API_URL}/fodder-pools/${id}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  console.log('Fodder pool deleted');
}

async function main() {
  try {
    await login();

    // Create and test fodder pool
    const pool = await createFodderPool();
    await getFodderPool(pool.id);

    // Test items management
    const items = await addFodderItems(pool.id);
    await removeFodderItems(
      pool.id,
      items.map((item) => item.id),
    );

    // Cleanup
    await deleteFodderPool(pool.id);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
