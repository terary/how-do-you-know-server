import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateQuestionTables1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Fodder pools for multiple choice questions
    await queryRunner.query(`
      CREATE TABLE fodder_pools (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_by UUID NOT NULL
      );

      CREATE TABLE fodder_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        pool_id UUID NOT NULL REFERENCES fodder_pools(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_by UUID NOT NULL
      );

      -- Question Templates
      CREATE TABLE question_templates (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_prompt_type TEXT NOT NULL CHECK (user_prompt_type IN ('text', 'multimedia')),
        user_response_type TEXT NOT NULL CHECK (user_response_type IN ('free-text-255', 'multiple-choice-4', 'true-false')),
        exclusivity_type TEXT NOT NULL CHECK (exclusivity_type IN ('exam-only', 'practice-only', 'exam-practice-both')),
        user_prompt_text TEXT,
        instruction_text TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_by UUID NOT NULL
      );

      -- Template Media (for multimedia questions)
      CREATE TABLE question_template_media (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        template_id UUID NOT NULL REFERENCES question_templates(id) ON DELETE CASCADE,
        media_content_type TEXT NOT NULL CHECK (media_content_type IN ('audio/mpeg', 'video/mp4')),
        height INTEGER CHECK (height > 0),
        width INTEGER CHECK (width > 0),
        url TEXT NOT NULL,
        special_instruction_text TEXT,
        duration INTEGER,
        file_size INTEGER,
        thumbnail_url TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Template Valid Answers
      CREATE TABLE question_template_valid_answers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        template_id UUID NOT NULL REFERENCES question_templates(id) ON DELETE CASCADE,
        text TEXT,
        boolean_value BOOLEAN,
        fodder_pool_id UUID REFERENCES fodder_pools(id),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT valid_answer_type_check CHECK (
          (text IS NOT NULL AND boolean_value IS NULL) OR
          (text IS NULL AND boolean_value IS NOT NULL)
        )
      );

      -- Question Actuals
      CREATE TABLE question_actuals (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        template_id UUID NOT NULL REFERENCES question_templates(id),
        exam_type TEXT NOT NULL CHECK (exam_type IN ('practice', 'live')),
        section_position INTEGER NOT NULL,
        user_prompt_text TEXT,
        instruction_text TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Multiple choice options for actual questions
      CREATE TABLE question_actual_choices (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        question_actual_id UUID NOT NULL REFERENCES question_actuals(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        is_correct BOOLEAN NOT NULL DEFAULT false,
        position INTEGER NOT NULL CHECK (position BETWEEN 0 AND 3),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (question_actual_id, position)
      );

      -- Practice exam answers (only for practice exams)
      CREATE TABLE question_actual_valid_answers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        question_actual_id UUID NOT NULL REFERENCES question_actuals(id) ON DELETE CASCADE,
        text TEXT,
        boolean_value BOOLEAN,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT valid_answer_type_check CHECK (
          (text IS NOT NULL AND boolean_value IS NULL) OR
          (text IS NULL AND boolean_value IS NOT NULL)
        )
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS question_actual_valid_answers;
      DROP TABLE IF EXISTS question_actual_choices;
      DROP TABLE IF EXISTS question_actuals;
      DROP TABLE IF EXISTS question_template_valid_answers;
      DROP TABLE IF EXISTS question_template_media;
      DROP TABLE IF EXISTS question_templates;
      DROP TABLE IF EXISTS fodder_items;
      DROP TABLE IF EXISTS fodder_pools;
    `);
  }
}
