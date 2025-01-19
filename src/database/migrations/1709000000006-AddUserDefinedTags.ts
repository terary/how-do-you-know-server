import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserDefinedTags1709000000006 implements MigrationInterface {
  name = 'AddUserDefinedTags1709000000006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add user_defined_tags to all relevant tables
    const tables = [
      'users',
      'exam_templates',
      'exam_template_sections',
      'exam_instances',
      'exam_instance_sections',
      'questions',
      'courses',
    ];

    // Add the column to each table
    for (const table of tables) {
      await queryRunner.query(`
        ALTER TABLE "${table}"
        ADD COLUMN IF NOT EXISTS "user_defined_tags" text NOT NULL DEFAULT ''
      `);
    }

    // Add GIN indexes for efficient text search
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_users_tags" 
        ON "users" USING gin (to_tsvector('english', user_defined_tags));
      
      CREATE INDEX IF NOT EXISTS "idx_exam_templates_tags" 
        ON "exam_templates" USING gin (to_tsvector('english', user_defined_tags));
      
      CREATE INDEX IF NOT EXISTS "idx_exam_template_sections_tags" 
        ON "exam_template_sections" USING gin (to_tsvector('english', user_defined_tags));
      
      CREATE INDEX IF NOT EXISTS "idx_exam_instances_tags" 
        ON "exam_instances" USING gin (to_tsvector('english', user_defined_tags));
      
      CREATE INDEX IF NOT EXISTS "idx_exam_instance_sections_tags" 
        ON "exam_instance_sections" USING gin (to_tsvector('english', user_defined_tags));
      
      CREATE INDEX IF NOT EXISTS "idx_questions_tags" 
        ON "questions" USING gin (to_tsvector('english', user_defined_tags));
      
      CREATE INDEX IF NOT EXISTS "idx_courses_tags" 
        ON "courses" USING gin (to_tsvector('english', user_defined_tags));
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    const indexes = [
      'idx_users_tags',
      'idx_exam_templates_tags',
      'idx_exam_template_sections_tags',
      'idx_exam_instances_tags',
      'idx_exam_instance_sections_tags',
      'idx_questions_tags',
      'idx_courses_tags',
    ];

    for (const index of indexes) {
      await queryRunner.query(`DROP INDEX IF EXISTS "${index}"`);
    }

    // Drop columns from all tables
    const tables = [
      'users',
      'exam_templates',
      'exam_template_sections',
      'exam_instances',
      'exam_instance_sections',
      'questions',
      'courses',
    ];

    for (const table of tables) {
      await queryRunner.query(`
        ALTER TABLE "${table}" DROP COLUMN IF EXISTS "user_defined_tags"
      `);
    }
  }
}
