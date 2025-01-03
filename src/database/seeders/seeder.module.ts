import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';
import { QuestionTemplate } from '../../questions/entities/question-template.entity';
import { QuestionTemplateMedia } from '../../questions/entities/question-template-media.entity';
import { QuestionTemplateValidAnswer } from '../../questions/entities/question-template-valid-answer.entity';
import { FodderPool } from '../../questions/entities/fodder-pool.entity';
import { FodderItem } from '../../questions/entities/fodder-item.entity';
import { UserSeeder } from './user.seeder';
import { QuestionTemplateSeeder } from './question-template.seeder';
import { SeederService } from './seeder.service';
import { getDatabaseConfig } from '../../config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      QuestionTemplate,
      QuestionTemplateMedia,
      QuestionTemplateValidAnswer,
      FodderPool,
      FodderItem,
    ]),
  ],
  providers: [UserSeeder, QuestionTemplateSeeder, SeederService],
  exports: [SeederService],
})
export class SeederModule {}
