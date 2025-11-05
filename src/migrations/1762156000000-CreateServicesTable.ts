import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateServicesTable1762156000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'services',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isNullable: false, default: 'gen_random_uuid()' },
          { name: 'name', type: 'varchar', length: '255', isNullable: false },
          { name: 'slug', type: 'varchar', length: '255', isNullable: false, isUnique: true },
          { name: 'parent_id', type: 'uuid', isNullable: true },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'content', type: 'text', isNullable: true },
          { name: 'image', type: 'varchar', length: '512', isNullable: true },
          { name: 'order', type: 'int', isNullable: false, default: 0 },
          { name: 'is_active', type: 'boolean', isNullable: false, default: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'services',
      new TableIndex({ name: 'IDX_SERVICES_PARENT', columnNames: ['parent_id'] }),
    );

    await queryRunner.createForeignKey(
      'services',
      new TableForeignKey({
        columnNames: ['parent_id'],
        referencedTableName: 'services',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        name: 'FK_SERVICES_PARENT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('services');
    const fk = table?.foreignKeys.find((f) => f.name === 'FK_SERVICES_PARENT');
    if (fk) await queryRunner.dropForeignKey('services', fk);
    await queryRunner.dropIndex('services', 'IDX_SERVICES_PARENT');
    await queryRunner.dropTable('services');
  }
}


