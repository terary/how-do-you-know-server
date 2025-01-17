import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPositionToSectionQuestion1710000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE exam_template_section_questions
      ADD COLUMN position integer NOT NULL DEFAULT 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE exam_template_section_questions
      DROP COLUMN position
    `);
  }
}
