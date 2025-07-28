#!/usr/bin/env node

const mysql = require("mysql2/promise")
require("dotenv").config()

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env

async function checkPendingMigrations() {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      port: parseInt(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    })

    // migrations 테이블이 있는지 확인
    const [tables] = await connection.execute("SHOW TABLES LIKE 'migrations'")

    if (tables.length === 0) {
      console.log("pending")
      await connection.end()
      return
    }

    // 실행된 마이그레이션 목록 가져오기
    const [executed] = await connection.execute(
      "SELECT name FROM migrations ORDER BY id"
    )

    const fs = require("fs")
    const path = require("path")

    // 마이그레이션 파일 목록 가져오기
    const migrationDir = path.join(__dirname, "..", "src", "migration")
    const migrationFiles = fs
      .readdirSync(migrationDir)
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"))
      .map((file) => {
        // 파일명에서 클래스명 추출 (예: 1642665600000-ConvertToUuid.ts -> ConvertToUuid1642665600000)
        const match = file.match(/^(\d+)-(.+)\.(ts|js)$/)
        if (match) {
          return `${match[2]}${match[1]}`
        }
        return null
      })
      .filter(Boolean)

    const executedNames = executed.map((row) => row.name)

    // 실행되지 않은 마이그레이션이 있는지 확인
    const pendingMigrations = migrationFiles.filter(
      (migration) => !executedNames.includes(migration)
    )

    if (pendingMigrations.length > 0) {
      console.log("pending")
    } else {
      console.log("none")
    }

    await connection.end()
  } catch (error) {
    console.error("Error checking migrations:", error.message)
    // 에러가 발생하면 안전하게 백업하도록 pending으로 처리
    console.log("pending")
    process.exit(1)
  }
}

checkPendingMigrations()
