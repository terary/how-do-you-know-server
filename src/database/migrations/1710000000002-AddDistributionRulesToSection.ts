import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDistributionRulesToSection1710000000002
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE exam_template_sections
      ADD COLUMN difficulty_distribution jsonb,
      ADD COLUMN topic_distribution jsonb
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE exam_template_sections
      DROP COLUMN difficulty_distribution,
      DROP COLUMN topic_distribution
    `);
  }
}
