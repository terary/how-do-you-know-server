import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExamInstances1709000000005 implements MigrationInterface {
  name = 'CreateExamInstances1709000000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types
    await queryRunner.query(`
      CREATE TYPE "exam_instance_type_enum" AS ENUM (
        'exam',
        'practice-exam',
        'study-guide'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "exam_instance_status_enum" AS ENUM (
        'scheduled',
        'in-progress',
        'completed',
        'expired'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "section_status_enum" AS ENUM (
        'not-started',
        'in-progress',
        'completed',
        'timed-out'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "question_status_enum" AS ENUM (
        'unanswered',
        'answered',
        'flagged',
        'skipped'
      )
    `);

    // Create exam_instances table
    await queryRunner.query(`
      CREATE TABLE "exam_instances" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "type" "exam_instance_type_enum" NOT NULL,
        "status" "exam_instance_status_enum" NOT NULL DEFAULT 'scheduled',
        "template_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "course_id" uuid NOT NULL,
        "start_date" TIMESTAMP NOT NULL,
        "end_date" TIMESTAMP NOT NULL,
        "started_at" TIMESTAMP,
        "completed_at" TIMESTAMP,
        "user_notes" jsonb,
        "user_defined_tags" text NOT NULL DEFAULT '',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "fk_exam_instance_template" FOREIGN KEY ("template_id") 
          REFERENCES "exam_templates"("id") ON DELETE CASCADE
      )
    `);

    // Create exam_instance_sections table
    await queryRunner.query(`
      CREATE TABLE "exam_instance_sections" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "exam_instance_id" uuid NOT NULL,
        "template_section_id" uuid NOT NULL,
        "status" "section_status_enum" NOT NULL DEFAULT 'not-started',
        "position" integer NOT NULL,
        "started_at" TIMESTAMP,
        "completed_at" TIMESTAMP,
        "time_limit_seconds" integer NOT NULL,
        "time_spent_seconds" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "fk_instance_section_exam" FOREIGN KEY ("exam_instance_id") 
          REFERENCES "exam_instances"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_instance_section_template" FOREIGN KEY ("template_section_id") 
          REFERENCES "exam_template_sections"("id") ON DELETE CASCADE
      )
    `);

    // Create exam_instance_questions table
    await queryRunner.query(`
      CREATE TABLE "exam_instance_questions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "section_id" uuid NOT NULL,
        "template_question_id" uuid NOT NULL,
        "status" "question_status_enum" NOT NULL DEFAULT 'unanswered',
        "position" integer NOT NULL,
        "student_answer" jsonb,
        "is_correct" boolean NOT NULL DEFAULT false,
        "score" float,
        "feedback" text,
        "answered_at" TIMESTAMP,
        "user_defined_tags" text NOT NULL DEFAULT '',
        "user_notes" jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "fk_instance_question_section" FOREIGN KEY ("section_id") 
          REFERENCES "exam_instance_sections"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_instance_question_template" FOREIGN KEY ("template_question_id") 
          REFERENCES "exam_template_section_questions"("id") ON DELETE CASCADE
      )
    `);

    // Add indexes
    await queryRunner.query(`
      CREATE INDEX "idx_exam_instance_user" ON "exam_instances" ("user_id");
      CREATE INDEX "idx_exam_instance_course" ON "exam_instances" ("course_id");
      CREATE INDEX "idx_exam_instance_template" ON "exam_instances" ("template_id");
      CREATE INDEX "idx_exam_instance_dates" ON "exam_instances" ("start_date", "end_date");
      CREATE INDEX "idx_instance_section_exam" ON "exam_instance_sections" ("exam_instance_id");
      CREATE INDEX "idx_instance_section_template" ON "exam_instance_sections" ("template_section_id");
      CREATE INDEX "idx_instance_question_section" ON "exam_instance_questions" ("section_id");
      CREATE INDEX "idx_instance_question_template" ON "exam_instance_questions" ("template_question_id");
      CREATE INDEX "idx_exam_instance_tags" ON "exam_instances" USING gin (to_tsvector('english', user_defined_tags));
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS "exam_instance_questions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "exam_instance_sections"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "exam_instances"`);

    // Drop enums
    await queryRunner.query(`DROP TYPE IF EXISTS "question_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "section_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "exam_instance_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "exam_instance_type_enum"`);
  }
}
