// Demo reset: wipes temporary demo records and re-seeds the original demo data.
// Run via the admin "Reset Demo Data" button (POST /api/demo/reset) or:
//   npm run db:reset

import { execSync } from "child_process";

console.log("🔄 Resetting demo database to seeded state...");
try {
  execSync("npx prisma db seed", { stdio: "inherit", cwd: __dirname + "/.." });
  console.log("✅ Demo data restored.");
} catch (e) {
  console.error("Reset failed:", (e as Error).message);
  process.exit(1);
}
