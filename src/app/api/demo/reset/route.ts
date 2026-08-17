import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

/**
 * Demo reset: restores seeded demo data and removes temporary demo records.
 * Only super admins can trigger this. Runs the seed via prisma.
 */
export async function POST() {
  const session = await auth();
  if (!session?.user?.role || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  try {
    execSync("npx prisma db seed", {
      cwd: process.cwd(),
      stdio: "pipe",
      timeout: 120000,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Reset failed: " + (e as Error).message },
      { status: 500 },
    );
  }
}
