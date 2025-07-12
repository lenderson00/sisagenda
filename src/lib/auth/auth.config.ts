import type { NextAuthConfig, User as NextAuthUser } from "next-auth";
import { Credentials } from "./providers/credentials";

type AppUser = NextAuthUser & {
  name?: string | null;
  role: string;
  organizationId: string;
  mustChangePassword?: boolean;
  supplierId?: string;
};

export const authOptions: NextAuthConfig = {
  providers: [Credentials],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        const u = user as AppUser;
        token.id = u.id;
        token.role = u.role;
        token.organizationId = u.organizationId;
        token.mustChangePassword = u.mustChangePassword;
        token.image = u.image;
        token.name = u.name;
        if (u.supplierId) {
          token.supplierId = u.supplierId;
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.role = token.role;
        session.user.image = token.image as string;
        session.user.organizationId = token.organizationId;
        session.user.mustChangePassword = Boolean(token.mustChangePassword);
        session.user.name = token.name;

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
