import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

// Load test environment variables
config({ path: resolve(__dirname, '../.env.test') });

export const testDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
  synchronize: true,
  dropSchema: true,
});

export async function setupTestDatabase() {
  try {
    // Initialize the connection
    if (!testDataSource.isInitialized) {
      await testDataSource.initialize();
    }
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
}

export async function cleanupTestDatabase() {
  try {
    if (testDataSource.isInitialized) {
      await testDataSource.destroy();
    }
  } catch (error) {
    console.error('Error cleaning up test database:', error);
    throw error;
  }
}

export async function createTestingModule(): Promise<{
  app: INestApplication;
  moduleFixture: TestingModule;
}> {
  await setupTestDatabase();

  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  return { app, moduleFixture };
}
