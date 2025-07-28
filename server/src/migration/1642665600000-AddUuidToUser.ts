import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddUuidToUser1642665600000 implements MigrationInterface {
  name = "AddUuidToUser1642665600000"

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. User 테이블에 uuid 컬럼 추가 (먼저 nullable로 추가)
    await queryRunner.addColumn(
      "user",
      new TableColumn({
        name: "uuid",
        type: "varchar",
        length: "36",
        isNullable: true,
      })
    )

    // 2. 기존 사용자들에게 UUID 생성
    await queryRunner.query(`
      UPDATE user SET uuid = UUID() WHERE uuid IS NULL
    `)

    // 3. uuid 컬럼을 NOT NULL로 변경하고 UNIQUE 제약조건 추가
    await queryRunner.query(`
      ALTER TABLE user MODIFY COLUMN uuid VARCHAR(36) NOT NULL
    `)

    await queryRunner.query(`
      ALTER TABLE user ADD UNIQUE INDEX IDX_USER_UUID (uuid)
    `)

    // 4. Permission 테이블에 userUuid 컬럼 추가
    await queryRunner.addColumn(
      "permission",
      new TableColumn({
        name: "userUuid",
        type: "varchar",
        length: "36",
        isNullable: true,
      })
    )

    // 5. Permission 테이블의 userUuid에 기존 user의 uuid 매핑
    await queryRunner.query(`
      UPDATE permission p 
      INNER JOIN user u ON p.userId = u.id 
      SET p.userUuid = u.uuid
    `)

    // 6. RetreatAttend 테이블에 userUuid 컬럼 추가
    await queryRunner.addColumn(
      "retreat_attend",
      new TableColumn({
        name: "userUuid",
        type: "varchar",
        length: "36",
        isNullable: true,
      })
    )

    // 7. RetreatAttend 테이블의 userUuid에 기존 user의 uuid 매핑
    await queryRunner.query(`
      UPDATE retreat_attend ra 
      INNER JOIN user u ON ra.userId = u.id 
      SET ra.userUuid = u.uuid
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // RetreatAttend 테이블에서 userUuid 컬럼 제거
    await queryRunner.dropColumn("retreat_attend", "userUuid")

    // Permission 테이블에서 userUuid 컬럼 제거
    await queryRunner.dropColumn("permission", "userUuid")

    // User 테이블에서 UNIQUE 인덱스 제거
    await queryRunner.query(`
      ALTER TABLE user DROP INDEX IDX_USER_UUID
    `)

    // User 테이블에서 uuid 컬럼 제거
    await queryRunner.dropColumn("user", "uuid")
  }
}
