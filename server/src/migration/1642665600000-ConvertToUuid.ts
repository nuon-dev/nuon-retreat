import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm"

export class ConvertToUuid1642665600000 implements MigrationInterface {
  name = "ConvertToUuid1642665600000"

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log("🚀 UUID 변환 마이그레이션 시작...")

    // 1. 모든 외래 키 제약 조건 제거
    console.log("1. 외래 키 제약 조건 제거 중...")
    const foreignKeyTables = [
      { table: "permission", column: "userId" },
      { table: "retreat_attend", column: "userId" },
      { table: "attend_data", column: "userId" },
      { table: "chat_log", column: "userId" },
      { table: "community", column: "leaderId" },
      { table: "community", column: "deputyLeaderId" },
      { table: "sharing_image", column: "writerId" },
      { table: "sharing_text", column: "writerId" },
      { table: "sharing_video", column: "writerId" },
    ]

    for (const { table: tableName, column } of foreignKeyTables) {
      const table = await queryRunner.getTable(tableName)
      const foreignKey = table?.foreignKeys.find(
        (fk) => fk.columnNames.indexOf(column) !== -1
      )
      if (foreignKey) {
        await queryRunner.dropForeignKey(tableName, foreignKey)
        console.log(`   ✓ ${tableName}.${column} 외래 키 제거됨`)
      }
    }

    // 2. User 테이블에 UUID 컬럼 추가
    console.log("2. User 테이블에 UUID 컬럼 추가 중...")
    await queryRunner.addColumn(
      "user",
      new TableColumn({
        name: "uuid",
        type: "varchar",
        length: "36",
        isNullable: true,
      })
    )

    // 3. 기존 사용자들에게 UUID 생성 (완전 무작위 UUID 생성)
    console.log("3. 기존 사용자들에게 UUID 할당 중...")
    const users = await queryRunner.query(
      "SELECT id FROM user WHERE uuid IS NULL"
    )

    console.log(`   총 ${users.length}명의 사용자에게 UUID 할당...`)

    for (let i = 0; i < users.length; i++) {
      const user = users[i]

      // 무작위 지연 시간 (50-500ms)
      const delay = Math.floor(Math.random() * 450) + 50
      await new Promise((resolve) => setTimeout(resolve, delay))

      // 더 무작위적인 UUID 생성을 위해 RAND() 함수와 함께 사용
      await queryRunner.query(`
        UPDATE user 
        SET uuid = CONCAT(
          LPAD(HEX(FLOOR(RAND() * 4294967295)), 8, '0'), '-',
          LPAD(HEX(FLOOR(RAND() * 65535)), 4, '0'), '-',
          '4', LPAD(HEX(FLOOR(RAND() * 4095)), 3, '0'), '-',
          CONCAT(CASE WHEN FLOOR(RAND() * 4) < 2 THEN '8' ELSE 'a' END, LPAD(HEX(FLOOR(RAND() * 4095)), 3, '0')), '-',
          LPAD(HEX(FLOOR(RAND() * 281474976710655)), 12, '0')
        )
        WHERE id = ?
      `, [user.id])

      // 진행률 표시 (10% 단위)
      if ((i + 1) % Math.ceil(users.length / 10) === 0) {
        const progress = Math.floor(((i + 1) / users.length) * 100)
        console.log(`   진행률: ${progress}% (${i + 1}/${users.length})`)
      }
    }

    // 4. 외래 키 테이블들에 UUID 컬럼 추가하고 데이터 매핑
    console.log("4. 외래 키 테이블들에 UUID 컬럼 추가 및 데이터 매핑 중...")

    // permission 테이블
    await queryRunner.addColumn(
      "permission",
      new TableColumn({
        name: "userUuid",
        type: "varchar",
        length: "36",
        isNullable: true,
      })
    )
    await queryRunner.query(`
      UPDATE permission p 
      JOIN user u ON p.userId = u.id COLLATE utf8mb4_general_ci
      SET p.userUuid = u.uuid
    `)

    // retreat_attend 테이블
    await queryRunner.addColumn(
      "retreat_attend",
      new TableColumn({
        name: "userUuid",
        type: "varchar",
        length: "36",
        isNullable: true,
      })
    )
    await queryRunner.query(`
      UPDATE retreat_attend ra 
      JOIN user u ON ra.userId = u.id COLLATE utf8mb4_general_ci
      SET ra.userUuid = u.uuid
    `)

    // attend_data 테이블
    await queryRunner.addColumn(
      "attend_data",
      new TableColumn({
        name: "userUuid",
        type: "varchar",
        length: "36",
        isNullable: true,
      })
    )
    await queryRunner.query(`
      UPDATE attend_data ad 
      JOIN user u ON ad.userId = u.id COLLATE utf8mb4_general_ci
      SET ad.userUuid = u.uuid
    `)

    // chat_log 테이블
    await queryRunner.addColumn(
      "chat_log",
      new TableColumn({
        name: "userUuid",
        type: "varchar",
        length: "36",
        isNullable: true,
      })
    )
    await queryRunner.query(`
      UPDATE chat_log cl 
      JOIN user u ON cl.userId = u.id COLLATE utf8mb4_general_ci
      SET cl.userUuid = u.uuid
    `)

    // community 테이블 (leaderId)
    await queryRunner.addColumn(
      "community",
      new TableColumn({
        name: "leaderUuid",
        type: "varchar",
        length: "36",
        isNullable: true,
      })
    )
    await queryRunner.query(`
      UPDATE community c 
      JOIN user u ON c.leaderId = u.id COLLATE utf8mb4_general_ci
      SET c.leaderUuid = u.uuid
    `)

    // community 테이블 (deputyLeaderId)
    await queryRunner.addColumn(
      "community",
      new TableColumn({
        name: "deputyLeaderUuid",
        type: "varchar",
        length: "36",
        isNullable: true,
      })
    )
    await queryRunner.query(`
      UPDATE community c 
      JOIN user u ON c.deputyLeaderId = u.id COLLATE utf8mb4_general_ci
      SET c.deputyLeaderUuid = u.uuid
    `)

    // sharing_image 테이블
    await queryRunner.addColumn(
      "sharing_image",
      new TableColumn({
        name: "writerUuid",
        type: "varchar",
        length: "36",
        isNullable: true,
      })
    )
    await queryRunner.query(`
      UPDATE sharing_image si 
      JOIN user u ON si.writerId = u.id COLLATE utf8mb4_general_ci
      SET si.writerUuid = u.uuid
    `)

    // sharing_text 테이블
    await queryRunner.addColumn(
      "sharing_text",
      new TableColumn({
        name: "writerUuid",
        type: "varchar",
        length: "36",
        isNullable: true,
      })
    )
    await queryRunner.query(`
      UPDATE sharing_text st 
      JOIN user u ON st.writerId = u.id COLLATE utf8mb4_general_ci
      SET st.writerUuid = u.uuid
    `)

    // sharing_video 테이블
    await queryRunner.addColumn(
      "sharing_video",
      new TableColumn({
        name: "writerUuid",
        type: "varchar",
        length: "36",
        isNullable: true,
      })
    )
    await queryRunner.query(`
      UPDATE sharing_video sv 
      JOIN user u ON sv.writerId = u.id COLLATE utf8mb4_general_ci
      SET sv.writerUuid = u.uuid
    `)

    // 5. User 테이블의 primary key를 UUID로 변경
    console.log("5. User 테이블 primary key를 UUID로 변경 중...")

    // AUTO_INCREMENT 제거
    await queryRunner.query(`
      ALTER TABLE user MODIFY COLUMN id INT NOT NULL
    `)

    // Primary Key 제거
    await queryRunner.dropPrimaryKey("user")

    // 기존 id 컬럼 제거
    await queryRunner.dropColumn("user", "id")

    // uuid 컬럼을 id로 이름 변경
    await queryRunner.renameColumn("user", "uuid", "id")

    // 새로운 id 컬럼을 Primary Key로 설정
    await queryRunner.createPrimaryKey("user", ["id"])

    // 6. 외래 키 컬럼들 이름 변경 및 정리
    console.log("6. 외래 키 컬럼들 정리 중...")

    // 기존 정수 컬럼들 제거하고 UUID 컬럼들을 원래 이름으로 변경
    await queryRunner.dropColumn("permission", "userId")
    await queryRunner.renameColumn("permission", "userUuid", "userId")

    await queryRunner.dropColumn("retreat_attend", "userId")
    await queryRunner.renameColumn("retreat_attend", "userUuid", "userId")

    await queryRunner.dropColumn("attend_data", "userId")
    await queryRunner.renameColumn("attend_data", "userUuid", "userId")

    await queryRunner.dropColumn("chat_log", "userId")
    await queryRunner.renameColumn("chat_log", "userUuid", "userId")

    await queryRunner.dropColumn("community", "leaderId")
    await queryRunner.renameColumn("community", "leaderUuid", "leaderId")

    await queryRunner.dropColumn("community", "deputyLeaderId")
    await queryRunner.renameColumn(
      "community",
      "deputyLeaderUuid",
      "deputyLeaderId"
    )

    await queryRunner.dropColumn("sharing_image", "writerId")
    await queryRunner.renameColumn("sharing_image", "writerUuid", "writerId")

    await queryRunner.dropColumn("sharing_text", "writerId")
    await queryRunner.renameColumn("sharing_text", "writerUuid", "writerId")

    await queryRunner.dropColumn("sharing_video", "writerId")
    await queryRunner.renameColumn("sharing_video", "writerUuid", "writerId")

    // 7. UUID 컬럼들을 NOT NULL로 설정하고 collation 통일
    console.log("7. UUID 컬럼들을 NOT NULL로 설정하고 collation 통일 중...")

    await queryRunner.query(`
      ALTER TABLE permission MODIFY COLUMN userId VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
    `)

    await queryRunner.query(`
      ALTER TABLE retreat_attend MODIFY COLUMN userId VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
    `)

    await queryRunner.query(`
      ALTER TABLE attend_data MODIFY COLUMN userId VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
    `)

    await queryRunner.query(`
      ALTER TABLE chat_log MODIFY COLUMN userId VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
    `)

    await queryRunner.query(`
      ALTER TABLE sharing_image MODIFY COLUMN writerId VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
    `)

    await queryRunner.query(`
      ALTER TABLE sharing_text MODIFY COLUMN writerId VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
    `)

    await queryRunner.query(`
      ALTER TABLE sharing_video MODIFY COLUMN writerId VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
    `)

    await queryRunner.query(`
      ALTER TABLE user MODIFY COLUMN id VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
    `)

    // 8. 새로운 외래 키 제약 조건 추가
    console.log("8. 새로운 외래 키 제약 조건 추가 중...")

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

    await queryRunner.createForeignKey(
      "attend_data",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user",
        onDelete: "CASCADE",
      })
    )

    await queryRunner.createForeignKey(
      "chat_log",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user",
        onDelete: "CASCADE",
      })
    )

    await queryRunner.createForeignKey(
      "community",
      new TableForeignKey({
        columnNames: ["leaderId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user",
        onDelete: "SET NULL",
      })
    )

    await queryRunner.createForeignKey(
      "community",
      new TableForeignKey({
        columnNames: ["deputyLeaderId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user",
        onDelete: "SET NULL",
      })
    )

    await queryRunner.createForeignKey(
      "sharing_image",
      new TableForeignKey({
        columnNames: ["writerId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user",
        onDelete: "CASCADE",
      })
    )

    await queryRunner.createForeignKey(
      "sharing_text",
      new TableForeignKey({
        columnNames: ["writerId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user",
        onDelete: "CASCADE",
      })
    )

    await queryRunner.createForeignKey(
      "sharing_video",
      new TableForeignKey({
        columnNames: ["writerId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user",
        onDelete: "CASCADE",
      })
    )

    console.log("✅ UUID 변환 마이그레이션 완료!")
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error(
      "UUID 전환 마이그레이션은 자동으로 되돌릴 수 없습니다. 백업에서 복구해주세요."
    )
  }
}
