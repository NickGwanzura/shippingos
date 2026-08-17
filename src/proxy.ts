import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const PROTECTED = [
  "/dashboard",
  "/customers",
  "/quotes",
  "/shipments",
  "/invoices",
  "/payments",
  "/expenses",
  "/documents",
  "/reports",
  "/search",
  "/activity",
  "/staff",
];

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthed = !!req.auth?.user;

  // Public routes never redirect.
  const path = nextUrl.pathname;
  if (path.startsWith("/login") || path.startsWith("/portal") || path.startsWith("/api")) {
    return NextResponse.next();
  }

  const needsAuth = PROTECTED.some((r) => path === r || path.startsWith(r + "/"));
  if (needsAuth && !isAuthed) {
    const url = nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  // Root → dashboard if authed, else login
  if (path === "/") {
    const url = nextUrl.clone();
    url.pathname = isAuthed ? "/dashboard" : "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:png|jpg|jpeg|gif|svg|webp|woff2?|ttf)$).*)"],
};
