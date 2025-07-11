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
        token.image = u.image;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.role = token.role ? String(token.role) : "";
        session.user.image = token.image as string;
        session.user.organizationId = token.organizationId
          ? String(token.organizationId)
          : "";
        session.user.mustChangePassword = Boolean(token.mustChangePassword);
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
