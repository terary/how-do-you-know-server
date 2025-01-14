import axios from 'axios';
import * as bcrypt from 'bcrypt';

const randomInt = (min = 0, max = 1000) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const API_URL = 'http://localhost:3001';

interface User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[];
}

async function createUser(userData: User) {
  try {
    // Hash the password before sending to server
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userDataWithHashedPassword = {
      ...userData,
      password: hashedPassword,
    };

    const response = await axios.post(
      `${API_URL}/users`,
      userDataWithHashedPassword,
    );
    console.log('User created:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error creating user:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function fetchUser(username: string) {
  try {
    const response = await axios.get(`${API_URL}/users/${username}`);
    console.log('User fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching user:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function updateUser(username: string, updateData: Partial<User>) {
  try {
    const response = await axios.patch(
      `${API_URL}/users/${username}`,
      updateData,
    );
    console.log('User updated:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error updating user:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function deleteUser(username: string) {
  try {
    const response = await axios.delete(`${API_URL}/users/${username}`);
    console.log('User deleted:', username);
    return response.data;
  } catch (error) {
    console.error(
      'Error deleting user:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function main() {
  try {
    // Test user data
    const randomSuffix = randomInt();
    const testUser: User = {
      username: 'testuser-' + randomSuffix,
      firstName: 'Test',
      lastName: 'User',
      email: `test.user.${randomSuffix}@example.com`,
      password: 'test123',
      roles: ['user', 'public'],
    };

    // Create user
    console.log('\n--- Creating user ---');
    await createUser(testUser);

    // Fetch user
    console.log('\n--- Fetching user ---');
    await fetchUser(testUser.username);

    // Update user
    console.log('\n--- Updating user ---');
    await updateUser(testUser.username, {
      firstName: 'Updated',
      lastName: 'Name',
    });

    // Fetch updated user
    console.log('\n--- Fetching updated user ---');
    await fetchUser(testUser.username);

    // Delete user
    // console.log('\n--- Deleting user ---');
    await deleteUser(testUser.username);
  } catch (error) {
    console.error('Script failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
