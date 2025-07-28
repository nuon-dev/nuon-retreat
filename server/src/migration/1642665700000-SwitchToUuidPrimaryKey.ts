import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm"

export class SwitchToUuidPrimaryKey1642665700000 implements MigrationInterface {
  name = "SwitchToUuidPrimaryKey1642665700000"

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. 기존 외래 키 제약 조건 제거
    const permissionTable = await queryRunner.getTable("permission")
    const permissionForeignKey = permissionTable?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("userId") !== -1
    )
    if (permissionForeignKey) {
      await queryRunner.dropForeignKey("permission", permissionForeignKey)
    }

    const retreatAttendTable = await queryRunner.getTable("retreat_attend")
    const retreatAttendForeignKey = retreatAttendTable?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("userId") !== -1
    )
    if (retreatAttendForeignKey) {
      await queryRunner.dropForeignKey(
        "retreat_attend",
        retreatAttendForeignKey
      )
    }

    // 2. 기존 userId 컬럼들 제거
    await queryRunner.dropColumn("permission", "userId")
    await queryRunner.dropColumn("retreat_attend", "userId")

    // 3. User 테이블의 기존 id 컬럼 제거 (PK 제약 조건도 함께 제거됨)
    await queryRunner.dropPrimaryKey("user")
    await queryRunner.dropColumn("user", "id")

    // 4. uuid 컬럼을 id로 이름 변경
    await queryRunner.renameColumn("user", "uuid", "id")

    // 5. 새로운 id 컬럼을 Primary Key로 설정
    await queryRunner.createPrimaryKey("user", ["id"])

    // 6. Permission 테이블의 userUuid를 userId로 이름 변경
    await queryRunner.renameColumn("permission", "userUuid", "userId")

    // 7. RetreatAttend 테이블의 userUuid를 userId로 이름 변경
    await queryRunner.renameColumn("retreat_attend", "userUuid", "userId")

    // 8. 새로운 외래 키 제약 조건 추가
    await queryRunner.createForeignKey(
      "permission",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user",
        onDelete: "CASCADE",
      })
    )

    await queryRunner.createForeignKey(
      "retreat_attend",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user",
        onDelete: "CASCADE",
      })
    )

    // 9. userId 컬럼들을 NOT NULL로 변경
    await queryRunner.query(`
      ALTER TABLE permission MODIFY COLUMN userId VARCHAR(36) NOT NULL
    `)

    await queryRunner.query(`
      ALTER TABLE retreat_attend MODIFY COLUMN userId VARCHAR(36) NOT NULL
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 이 마이그레이션은 되돌리기가 복잡하므로 백업에서 복구하는 것을 권장
    throw new Error(
      "This migration cannot be reverted automatically. Please restore from backup."
    )
  }
}
