import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSoftDeleteToUser1737963200000 implements MigrationInterface {
    name = 'AddSoftDeleteToUser1737963200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` 
            ADD COLUMN \`deletedAt\` timestamp(6) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` 
            DROP COLUMN \`deletedAt\`
        `);
    }
}
