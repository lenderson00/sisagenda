import type { NextAuthConfig } from "next-auth";
import type { User } from "next-auth";
import { Credentials } from "./providers/credentials";

export const authOptions: NextAuthConfig = {
  providers: [Credentials],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        const u = user as User;
        token.id = u.id;
        token.role = u.role;
        token.organizationId = u.organizationId;
        token.mustChangePassword = u.mustChangePassword;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string | undefined;
        session.user.organizationId = token.organizationId as
          | string
          | undefined;
        session.user.mustChangePassword = token.mustChangePassword as
          | boolean
          | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/entrar",
    verifyRequest: "/magiclink",
    // error: "/entrar?error=true",
    signOut: "/entrar?deslogado=true",
  },
};
