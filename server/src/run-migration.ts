import { DataSource } from "typeorm"

async function runMigration() {
  const dataSource = new DataSource(require("../ormconfig.json"))
  
  try {
    await dataSource.initialize()
    console.log("Database connected successfully")
    
    await dataSource.runMigrations()
    console.log("Migrations executed successfully")
    
  } catch (error) {
    console.error("Migration failed:", error)
  } finally {
    await dataSource.destroy()
    console.log("Database connection closed")
  }
}

runMigration()
