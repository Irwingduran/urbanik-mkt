/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function check() {
  try {
    // Check migrations table
    const migrations = await prisma.$queryRaw`SELECT * FROM "_prisma_migrations"`;
    console.log("Applied migrations:");
    migrations.forEach(m => console.log(`  - ${m.migration}: ${m.finished_at ? "✓" : "✗"}`));
    
    // Try to query products table info
    const columns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products'
      ORDER BY ordinal_position
    `;
    console.log("\nProducts table columns:");
    columns.forEach(c => console.log(`  - ${c.column_name}`));
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
