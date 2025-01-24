import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedAdminUser1709000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await queryRunner.query(
      `
      INSERT INTO "users" (
        "username",
        "email",
        "password",
        "roles",
        "firstName",
        "lastName"
      ) VALUES (
        'admin',
        'admin@example.com',
        $1,
        '{admin}',
        'Admin',
        'User'
      )
    `,
      [hashedPassword],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "users" WHERE username = 'admin'
    `);
  }
}
