import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateProjectsAndProjectCategories1762159000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'project_categories',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'name', type: 'varchar', length: '255', isNullable: false },
          {
            name: 'slug',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'order', type: 'int', default: 0 },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
          { name: 'deleted_at', type: 'timestamp', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'projects',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'category_id', type: 'uuid', isNullable: false },
          { name: 'name', type: 'varchar', length: '255', isNullable: false },
          {
            name: 'slug',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'content', type: 'text', isNullable: true },
          {
            name: 'location',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          { name: 'completion_date', type: 'date', isNullable: true },
          { name: 'image', type: 'varchar', length: '512', isNullable: true },
          { name: 'gallery', type: 'jsonb', isNullable: true },
          { name: 'is_featured', type: 'boolean', default: false },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'projects',
      new TableIndex({
        name: 'IDX_PROJECTS_CATEGORY',
        columnNames: ['category_id'],
      }),
    );

    await queryRunner.createForeignKey(
      'projects',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedTableName: 'project_categories',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
        name: 'FK_PROJECTS_CATEGORY',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('projects');
    const fk = table?.foreignKeys.find(
      (f) => f.name === 'FK_PROJECTS_CATEGORY',
    );
    if (fk) await queryRunner.dropForeignKey('projects', fk);
    await queryRunner.dropIndex('projects', 'IDX_PROJECTS_CATEGORY');
    await queryRunner.dropTable('projects');
    await queryRunner.dropTable('project_categories');
  }
}
