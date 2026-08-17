import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { ROLES, type Role } from "@/lib/constants";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Staff login
    Credentials({
      id: "credentials",
      name: "Staff Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const email = (credentials.email as string).toLowerCase().trim();
          const user = await prisma.user.findUnique({
            where: { email },
          });
          if (!user || !user.active) return null;

          const ok = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash,
          );
          if (!ok) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as Role,
          };
        } catch {
          return null;
        }
      },
    }),
    // Customer portal login
    Credentials({
      id: "portal",
      name: "Customer Portal",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Portal Code", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const email = (credentials.email as string).toLowerCase().trim();
          const portalUser = await prisma.portalUser.findUnique({
            where: { email },
            include: { customer: true },
          });
          if (!portalUser) return null;
          const ok = await bcrypt.compare(
            credentials.password as string,
            portalUser.passwordHash,
          );
          if (!ok) return null;

          await prisma.portalUser.update({
            where: { id: portalUser.id },
            data: { lastLoginAt: new Date() },
          }).catch(() => {});

          return {
            id: portalUser.customerId,
            email: portalUser.email,
            name: portalUser.customer.fullName,
            role: "CLIENT",
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      // Refresh role from DB on non-signin so revoked roles take effect.
      if (trigger !== "signIn" && trigger !== "signUp" && token.id && token.role !== "CLIENT") {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true, active: true },
          });
          if (!dbUser || !dbUser.active) {
            token.role = undefined;
          } else {
            token.role = dbUser.role as Role;
          }
        } catch {
          /* ignore */
        }
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost:
    process.env.NODE_ENV === "development" ||
    process.env.AUTH_TRUST_HOST === "true" ||
    !!process.env.TRUSTED_HOSTS,
});

export const AUTH_ROLE = ROLES;
