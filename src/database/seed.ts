import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeders/seeder.module';
import { SeederService } from './seeders/seeder.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  const logger = new Logger('Seeder');

  try {
    logger.log('Starting seeder...');
    const seederService = appContext.get(SeederService);
    await seederService.seed();
    logger.log('Seeding completed');
  } catch (error) {
    logger.error('Seeding failed');
    logger.error(error);
    process.exit(1);
  } finally {
    await appContext.close();
  }
}

bootstrap();
