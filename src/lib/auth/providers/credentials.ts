import { prisma } from "@/lib/prisma";
import type { Supplier, User } from "@prisma/client";
import { compare } from "bcryptjs";
import type { Provider } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";

export const Credentials: Provider = CredentialsProvider({
  name: "Credentials",
  credentials: {
    credential: { label: "Credencial", type: "text", placeholder: "NIP ou CNPJ" },
    password: { label: "Senha", type: "password", placeholder: "**********" },
  },
  async authorize(credentials) {
    const { credential, password } = credentials as {
      credential: string;
      password: string;
    };

    console.log(credentials);

    const isSupplier = credential.length === 14;

    let user: any = null;

    if (isSupplier) {
      user = await prisma.supplier.findUnique({
        where: { cnpj: credential },
        select: {
          id: true,
          email: true,
          name: true,
          password: true,
          isActive: true,
          createdAt: true,
          mustChangePassword: true,
        },
      });
    } else {
      user = await prisma.user.findUnique({
        where: { nip: credential },
        select: {
          id: true,
          email: true,
          name: true,
          password: true,
          isActive: true,
          createdAt: true,
          role: true,
          organizationId: true,
          mustChangePassword: true,
        },
      });
    }

    if (!user) {
      return null;
    }

    const isPasswordValid = await compare(password, user.password);

    console.log(isPasswordValid);

    if (!isPasswordValid || !user.isActive) {
      throw new Error("Usuário inativo ou senha inválida");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: "role" in user && typeof user.role === "string" ? user.role : "FORNECEDOR",
      createdAt: user.createdAt,
      organizationId:
        "organizationId" in user && typeof user.organizationId === "string"
          ? user.organizationId
          : undefined,
      mustChangePassword:
        "mustChangePassword" in user && typeof user.mustChangePassword === "boolean"
          ? user.mustChangePassword
          : false,
    };
  },
});
