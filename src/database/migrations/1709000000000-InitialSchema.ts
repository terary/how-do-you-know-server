import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1709000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table first
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "username" character varying NOT NULL UNIQUE,
        "firstName" character varying,
        "lastName" character varying,
        "email" character varying NOT NULL UNIQUE,
        "password" character varying NOT NULL,
        "roles" text[] NOT NULL DEFAULT '{}',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Create question_templates table
    await queryRunner.query(`
      CREATE TABLE "question_templates" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_prompt_text" text NOT NULL,
        "instruction_text" text,
        "difficulty" character varying NOT NULL,
        "topics" text[] NOT NULL,
        "created_by" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_question_templates" PRIMARY KEY ("id"),
        CONSTRAINT "FK_question_templates_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id")
      )
    `);

    // Create exam_templates table
    await queryRunner.query(`
      CREATE TABLE "exam_templates" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" text NOT NULL,
        "course_id" uuid NOT NULL,
        "created_by" uuid NOT NULL,
        "availability_start_date" TIMESTAMP NOT NULL,
        "availability_end_date" TIMESTAMP NOT NULL,
        "version" integer NOT NULL DEFAULT 1,
        "parent_template_id" uuid,
        "is_published" boolean NOT NULL DEFAULT false,
        "examExclusivityType" character varying NOT NULL DEFAULT 'exam-practice-both',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_exam_templates" PRIMARY KEY ("id"),
        CONSTRAINT "FK_exam_templates_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id")
      )
    `);

    // Create exam_template_sections table
    await queryRunner.query(`
      CREATE TABLE "exam_template_sections" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "exam_template_id" uuid NOT NULL,
        "title" character varying NOT NULL,
        "instructions" text,
        "time_limit_seconds" integer NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_exam_template_sections" PRIMARY KEY ("id"),
        CONSTRAINT "FK_exam_template_sections_template" FOREIGN KEY ("exam_template_id") REFERENCES "exam_templates"("id") ON DELETE CASCADE
      )
    `);

    // Create exam_template_section_questions table
    await queryRunner.query(`
      CREATE TABLE "exam_template_section_questions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "section_id" uuid NOT NULL,
        "question_template_id" uuid NOT NULL,
        "position" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_exam_template_section_questions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_exam_template_section_questions_section" FOREIGN KEY ("section_id") REFERENCES "exam_template_sections"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_exam_template_section_questions_template" FOREIGN KEY ("question_template_id") REFERENCES "question_templates"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "exam_template_section_questions"`);
    await queryRunner.query(`DROP TABLE "exam_template_sections"`);
    await queryRunner.query(`DROP TABLE "exam_templates"`);
    await queryRunner.query(`DROP TABLE "question_templates"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
