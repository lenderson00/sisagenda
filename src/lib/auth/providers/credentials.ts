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
        where: { cnpj: credential, isActive: true, deletedAt: null },
        select: {
          id: true,
          email: true,
          name: true,
          password: true,
          isActive: true,
          createdAt: true,
          mustChangePassword: true,
          failedLoginAttempts: true,
          lockoutUntil: true,
        },
      });
    } else {
      user = await prisma.user.findUnique({
        where: { nip: credential, isActive: true, deletedAt: null },
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
          failedLoginAttempts: true,
          lockoutUntil: true,
        },
      });
    }

    if (!user) {
      return null;
    }

    // Account lockout check
    if (user.lockoutUntil && new Date(user.lockoutUntil) > new Date()) {
      throw new Error("Account is locked. Please try again later.");
    }

    const isPasswordValid = await compare(password, user.password);

    console.log(isPasswordValid);

    if (!isPasswordValid || !user.isActive) {
      // Handle failed login attempt
      const failedAttempts = (user.failedLoginAttempts || 0) + 1;
      const lockoutThreshold = 5;
      const lockoutDurationMinutes = 15;
      let lockoutUntil = null;
      if (failedAttempts >= lockoutThreshold) {
        lockoutUntil = new Date(Date.now() + lockoutDurationMinutes * 60 * 1000);
      }
      if (isSupplier) {
        await prisma.supplier.update({
          where: { cnpj: credential },
          data: {
            failedLoginAttempts: failedAttempts,
            lockoutUntil,
          },
        });
      } else {
        await prisma.user.update({
          where: { nip: credential },
          data: {
            failedLoginAttempts: failedAttempts,
            lockoutUntil,
          },
        });
      }
      throw new Error("Usuário inativo ou senha inválida");
    }

    // Reset failed attempts and lockout on successful login
    if (user.failedLoginAttempts > 0 || user.lockoutUntil) {
      if (isSupplier) {
        await prisma.supplier.update({
          where: { cnpj: credential },
          data: {
            failedLoginAttempts: 0,
            lockoutUntil: null,
            lastLogin: new Date(),
          },
        });
      } else {
        await prisma.user.update({
          where: { nip: credential },
          data: {
            failedLoginAttempts: 0,
            lockoutUntil: null,
            lastLogin: new Date(),
          },
        });
      }
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
