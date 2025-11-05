import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterProductsDescriptionSpecsJson1762154000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // description: text -> jsonb (safe convert any existing text to JSON string)
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "description" TYPE jsonb USING CASE WHEN description IS NULL THEN NULL ELSE to_jsonb(description) END;`,
    );
    // technical_specs: text -> jsonb (safe convert any existing text to JSON string)
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "technical_specs" TYPE jsonb USING CASE WHEN technical_specs IS NULL THEN NULL ELSE to_jsonb(technical_specs) END;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // jsonb -> text
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "technical_specs" TYPE text USING CASE WHEN technical_specs IS NULL THEN NULL ELSE technical_specs::text END;`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "description" TYPE text USING CASE WHEN description IS NULL THEN NULL ELSE description::text END;`,
    );
  }
}
