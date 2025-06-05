import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import type { Provider } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";

export const Credentials: Provider = CredentialsProvider({
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    const { email, password } = credentials as {
      email: string;
      password: string;
    };

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        createdAt: true,
        password: true,
        mustChangePassword: true,
        isActive: true,
        organization: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid || !user.isActive) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
      createdAt: user.createdAt,
      organizationId: user.organization?.id,
      mustChangePassword: user.mustChangePassword,
    };
  },
});
