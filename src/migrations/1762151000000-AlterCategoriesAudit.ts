import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterCategoriesAudit1762151000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop slug column if exists
    const table = await queryRunner.getTable('categories');
    const slug = table?.findColumnByName('slug');
    if (slug) {
      await queryRunner.dropColumn('categories', 'slug');
    }

    // Add audit columns
    await queryRunner.addColumns('categories', [
      new TableColumn({
        name: 'updated_by_user_id',
        type: 'int',
        isNullable: true,
      }),
      new TableColumn({
        name: 'updated_by_name',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove audit columns
    await queryRunner.dropColumn('categories', 'updated_by_name');
    await queryRunner.dropColumn('categories', 'updated_by_user_id');

    // Re-add slug (nullable) to allow rollback
    await queryRunner.addColumn(
      'categories',
      new TableColumn({
        name: 'slug',
        type: 'varchar',
        length: '255',
        isNullable: true,
        isUnique: false,
      }),
    );
  }
}
