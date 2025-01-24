import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeTopicsNullable1710000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question_templates" ALTER COLUMN "topics" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question_templates" ALTER COLUMN "topics" SET NOT NULL`,
    );
  }
}
