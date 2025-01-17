import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateExamTemplates1710000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, add the new name column allowing nulls temporarily
    await queryRunner.query(`
      ALTER TABLE exam_templates 
      ADD COLUMN name VARCHAR(255)
    `);

    // Copy data from title to name
    await queryRunner.query(`
      UPDATE exam_templates 
      SET name = title 
      WHERE title IS NOT NULL
    `);

    // Make name NOT NULL after data is copied
    await queryRunner.query(`
      ALTER TABLE exam_templates 
      ALTER COLUMN name SET NOT NULL
    `);

    // Drop the old title column
    await queryRunner.query(`
      ALTER TABLE exam_templates 
      DROP COLUMN title
    `);

    // Add the examExclusivityType column
    await queryRunner.query(`
      ALTER TABLE exam_templates
      ADD COLUMN exam_exclusivity_type TEXT NOT NULL DEFAULT 'exam-practice-both'
      CHECK (exam_exclusivity_type IN ('exam-only', 'practice-only', 'exam-practice-both'))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the examExclusivityType column
    await queryRunner.query(`
      ALTER TABLE exam_templates
      DROP COLUMN exam_exclusivity_type
    `);

    // Add back the title column
    await queryRunner.query(`
      ALTER TABLE exam_templates 
      ADD COLUMN title VARCHAR(255)
    `);

    // Copy data from name to title
    await queryRunner.query(`
      UPDATE exam_templates 
      SET title = name 
      WHERE name IS NOT NULL
    `);

    // Make title NOT NULL
    await queryRunner.query(`
      ALTER TABLE exam_templates 
      ALTER COLUMN title SET NOT NULL
    `);

    // Drop the name column
    await queryRunner.query(`
      ALTER TABLE exam_templates 
      DROP COLUMN name
    `);
  }
}
