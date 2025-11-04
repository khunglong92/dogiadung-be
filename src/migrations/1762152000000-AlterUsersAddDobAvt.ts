import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterUsersAddDobAvt1762152000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({ name: 'dateOfBirth', type: 'date', isNullable: true }),
      new TableColumn({
        name: 'avtUrl',
        type: 'varchar',
        length: '512',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'avtUrl');
    await queryRunner.dropColumn('users', 'dateOfBirth');
  }
}


