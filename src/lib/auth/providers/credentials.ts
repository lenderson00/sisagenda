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
  async authorize(credentials, req) {
    const { email, password } = credentials as {
      email: string;
      password: string;
    };

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organization: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid || !user.isActive) {
      throw new Error("Invalid credentials");
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
