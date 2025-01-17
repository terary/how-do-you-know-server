import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVersioningToExamTemplate1710000000001
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE exam_templates
      ADD COLUMN version integer NOT NULL DEFAULT 1,
      ADD COLUMN parent_template_id uuid,
      ADD COLUMN is_published boolean NOT NULL DEFAULT false,
      ADD CONSTRAINT fk_parent_template 
        FOREIGN KEY (parent_template_id) 
        REFERENCES exam_templates(id)
        ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE exam_templates
      DROP CONSTRAINT fk_parent_template,
      DROP COLUMN version,
      DROP COLUMN parent_template_id,
      DROP COLUMN is_published
    `);
  }
}
