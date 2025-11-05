import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDeletedAtServicesAndProductCategories1762158000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'services',
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'product_categories',
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('product_categories', 'deleted_at');
    await queryRunner.dropColumn('services', 'deleted_at');
  }
}
