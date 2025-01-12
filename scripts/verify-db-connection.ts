`
    Need to working out seeder for new entities.

    Then need to work out seeder for testing?

    probably each test should insert each entity it requires
    then remove them when it no longer needs them.

    any/all get should avoid record count
    post/put/patch endpoints should return a record id
    to verify the operation completed successfully (maybe not delete)

`;

import { Client } from 'pg';

async function testConnection() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  });

  try {
    await client.connect();
    console.log('✅ Connection successful');
    const result = await client.query('SELECT version()');
    console.log('Connected to:', result.rows[0].version);
    await client.end();
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
  }
}

// Using TypeORM DataSource
import { DataSource } from 'typeorm';

async function verifyConnection() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    // Additional options from your config
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
  });

  try {
    await dataSource.initialize();
    console.log('✅ Successfully connected to PostgreSQL');
    console.log('Connection parameters used:', {
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      user: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_DB,
    });
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

// For psql command line:
console.log(`
You can also test using psql:
psql -h ${process.env.POSTGRES_HOST} -p ${process.env.POSTGRES_PORT} -U ${process.env.POSTGRES_USER} -d ${process.env.POSTGRES_DB}
`);

// Run tests
require('dotenv').config(); // Make sure to load environment variables
verifyConnection();
testConnection();
