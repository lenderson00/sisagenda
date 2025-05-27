import NextAuth, { type DefaultSession, type DefaultUser } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      organizationId?: string;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    role?: string;
    organizationId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: string;
    organizationId?: string;
  }
}
