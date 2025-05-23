import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authOptions: NextAuthConfig = {
  providers: [Google],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/entrar",
    verifyRequest: "/magiclink",
    // error: "/entrar?error=true",
    signOut: "/entrar",
  },
};
