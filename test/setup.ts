import '@jest/globals';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load test environment variables
config({ path: resolve(__dirname, '../.env.test') });

// Clear database before running tests
beforeAll(async () => {
  // Database cleanup will be handled by individual test files
});
