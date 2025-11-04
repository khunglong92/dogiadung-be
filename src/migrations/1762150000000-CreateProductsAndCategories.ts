import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateProductsAndCategories1762150000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          { name: 'description', type: 'text', isNullable: true },
          {
            name: 'slug',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', length: '255', isNullable: false },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'price', type: 'bigint', isNullable: true },
          { name: 'images', type: 'text', isArray: true, isNullable: true },
          { name: 'categoryId', type: 'int', isNullable: false },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'products',
      new TableIndex({
        name: 'IDX_PRODUCTS_CATEGORY',
        columnNames: ['categoryId'],
      }),
    );

    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        columnNames: ['categoryId'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
        name: 'FK_PRODUCTS_CATEGORY',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('products');
    const fk = table?.foreignKeys.find(
      (f) => f.name === 'FK_PRODUCTS_CATEGORY',
    );
    if (fk) {
      await queryRunner.dropForeignKey('products', fk);
    }
    await queryRunner.dropIndex('products', 'IDX_PRODUCTS_CATEGORY');
    await queryRunner.dropTable('products');
    await queryRunner.dropTable('categories');
  }
}
