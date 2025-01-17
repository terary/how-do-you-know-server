import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameTitleToName1710000000004 implements MigrationInterface {
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
