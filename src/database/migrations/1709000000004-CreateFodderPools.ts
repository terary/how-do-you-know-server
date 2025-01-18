import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFodderPools1709000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "fodder_pools" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" text,
        "created_by" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_fodder_pools" PRIMARY KEY ("id"),
        CONSTRAINT "FK_fodder_pools_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "fodder_pool_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "pool_id" uuid NOT NULL,
        "content" text NOT NULL,
        "created_by" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_fodder_pool_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_fodder_pool_items_pool" FOREIGN KEY ("pool_id") REFERENCES "fodder_pools"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_fodder_pool_items_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "fodder_pool_items"`);
    await queryRunner.query(`DROP TABLE "fodder_pools"`);
  }
}
