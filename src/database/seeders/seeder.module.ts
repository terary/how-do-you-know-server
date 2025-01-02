import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';
import { Question } from '../../questions/entities/question.entity';
import { UserSeeder } from './user.seeder';
import { QuestionSeeder } from './question.seeder';
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
    TypeOrmModule.forFeature([User, Question]),
  ],
  providers: [UserSeeder, QuestionSeeder, SeederService],
  exports: [SeederService],
})
export class SeederModule {}

`
    Everything looks good so far.

    Need to consider question's complex typing.

    A) Create a types directory in the dev-debug folder.
    B) Ask Cursor for it's opinion on the question's complex typing.
       Explain that we don't need entities for each sub types. (eg no UserResponseEntity)
    
    Then work with cursor to redefine the current question type 
    
    You're going to have to lay-out a minimum flow and consider extending, for exams, practice exams, etc.

    An exam will have sections so there will need to be section id 
    An exam will not send the correct answers
    We may want a questionNotes feature to update practice questions with student notes
    So the examiner will create a section? add questions?  Simply add questions as single process
    that create exam, sections, add questions?.. Then when the student is assigned an exam 
    they are given their own instance?  Or because practice exam question pool will contain
    actual exam questions, when student is assigned exam they get one generated and remains 
    on disk?? 

`;
