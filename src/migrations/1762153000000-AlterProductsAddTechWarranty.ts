import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterProductsAddTechWarranty1762153000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('products', [
      new TableColumn({
        name: 'technical_specs',
        type: 'text',
        isNullable: true,
      }),
      new TableColumn({
        name: 'warranty_policy',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('products', 'warranty_policy');
    await queryRunner.dropColumn('products', 'technical_specs');
  }
}
