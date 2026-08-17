import { spawnSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.user.count();
  await prisma.$disconnect();

  if (userCount > 0) {
    console.log("Demo data already exists; skipping initial seed.");
    return;
  }

  console.log("Database is empty; loading the initial demo data...");
  const result = spawnSync("npm", ["run", "db:seed"], { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

main().catch(async (error) => {
  console.error("Demo initialization failed:", error);
  await prisma.$disconnect();
  process.exit(1);
});
