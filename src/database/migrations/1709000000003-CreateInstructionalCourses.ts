import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInstructionalCourses1709000000003
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "instructional_courses" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" text,
        "institution_id" uuid NOT NULL,
        "created_by" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_instructional_courses" PRIMARY KEY ("id"),
        CONSTRAINT "FK_instructional_courses_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id"),
        CONSTRAINT "FK_instructional_courses_institution" FOREIGN KEY ("institution_id") REFERENCES "learning_institutions"("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "instructional_courses"`);
  }
}
