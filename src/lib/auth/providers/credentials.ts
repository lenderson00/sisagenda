import { prisma } from "@/lib/prisma";
import type { Supplier, User as PrismaUser } from "@prisma/client";
import { compare } from "bcryptjs";
import type { Provider } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";

// Types
interface Credentials {
  credential: string;
  password: string;
}

interface UserData {
  id: string;
  email: string | null;
  name: string | null;
  password: string;
  isActive: boolean;
  createdAt: Date;
  mustChangePassword?: boolean;
  failedLoginAttempts?: number;
  lockoutUntil?: Date | null;
  role?: string;
  organizationId?: string | null;
}

interface AuthResult {
  id: string;
  email: string | null;
  name: string | null;
  role: string;
  createdAt: Date;
  organizationId?: string;
  mustChangePassword: boolean;
}

// Constants
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_DURATION_MINUTES = 15;
const SUPPLIER_CNPJ_LENGTH = 14;

// Utility functions
const isSupplierCredential = (credential: string): boolean => {
  return credential.length === SUPPLIER_CNPJ_LENGTH;
};

const isAccountLocked = (lockoutUntil: Date | null): boolean => {
  return lockoutUntil !== null && new Date(lockoutUntil) > new Date();
};

const calculateLockoutUntil = (failedAttempts: number): Date | null => {
  if (failedAttempts >= LOCKOUT_THRESHOLD) {
    return new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
  }
  return null;
};

// Database operations
const findSupplierByCnpj = async (cnpj: string): Promise<UserData | null> => {
  const supplier = await prisma.supplier.findUnique({
    where: { cnpj, isActive: true, deletedAt: null },
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
  return supplier;
};

const findUserByNip = async (nip: string): Promise<UserData | null> => {
  const user = await prisma.user.findUnique({
    where: { nip, isActive: true, deletedAt: null },
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
  return user;
};

const updateSupplierLoginAttempts = async (
  cnpj: string,
  failedAttempts: number,
  lockoutUntil: Date | null
): Promise<void> => {
  await prisma.supplier.update({
    where: { cnpj },
    data: {
      failedLoginAttempts: failedAttempts,
      lockoutUntil,
    },
  });
};

const updateUserLoginAttempts = async (
  nip: string,
  failedAttempts: number,
  lockoutUntil: Date | null
): Promise<void> => {
  await prisma.user.update({
    where: { nip },
    data: {
      failedLoginAttempts: failedAttempts,
      lockoutUntil,
    },
  });
};

const resetSupplierLoginAttempts = async (cnpj: string): Promise<void> => {
  await prisma.supplier.update({
    where: { cnpj },
    data: {
      failedLoginAttempts: 0,
      lockoutUntil: null,
      lastLogin: new Date(),
    },
  });
};

const resetUserLoginAttempts = async (nip: string): Promise<void> => {
  await prisma.user.update({
    where: { nip },
    data: {
      failedLoginAttempts: 0,
      lockoutUntil: null,
      lastLogin: new Date(),
    },
  });
};

// Authentication logic
const findUserByCredential = async (credential: string): Promise<UserData | null> => {
  if (isSupplierCredential(credential)) {
    return await findSupplierByCnpj(credential);
  }
  return await findUserByNip(credential);
};

const handleFailedLogin = async (
  credential: string,
  user: UserData,
  isSupplier: boolean
): Promise<void> => {
  const failedAttempts = (user.failedLoginAttempts || 0) + 1;
  const lockoutUntil = calculateLockoutUntil(failedAttempts);

  if (isSupplier) {
    await updateSupplierLoginAttempts(credential, failedAttempts, lockoutUntil);
  } else {
    await updateUserLoginAttempts(credential, failedAttempts, lockoutUntil);
  }
};

const resetLoginAttempts = async (
  credential: string,
  user: UserData,
  isSupplier: boolean
): Promise<void> => {
  if ((user.failedLoginAttempts || 0) > 0 || user.lockoutUntil) {
    if (isSupplier) {
      await resetSupplierLoginAttempts(credential);
    } else {
      await resetUserLoginAttempts(credential);
    }
  }
};

const validateCredentials = async (
  password: string,
  user: UserData
): Promise<boolean> => {
  const isPasswordValid = await compare(password, user.password);
  return isPasswordValid && user.isActive;
};

const buildAuthResult = (user: UserData): AuthResult => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: "role" in user && typeof user.role === "string" ? user.role : "FORNECEDOR",
    createdAt: user.createdAt,
    organizationId:
      "organizationId" in user && user.organizationId ? user.organizationId : undefined,
    mustChangePassword:
      "mustChangePassword" in user && typeof user.mustChangePassword === "boolean"
        ? user.mustChangePassword
        : false,
  };
};

// Main authorization function
const authorizeUser = async (credentials: any): Promise<AuthResult | null> => {
  const { credential, password } = credentials as Credentials;

  const user = await findUserByCredential(credential);

  if (!user) {
    return null;
  }
  // Check if account is locked
  if (isAccountLocked(user.lockoutUntil || null)) {
    throw new Error("Account is locked. Please try again later.");
  }

  const isSupplier = isSupplierCredential(credential);
  const isValid = await validateCredentials(password, user);

  if (!isValid) {
    await handleFailedLogin(credential, user, isSupplier);
    throw new Error("Usuário inativo ou senha inválida");
  }

  // Reset failed attempts on successful login
  await resetLoginAttempts(credential, user, isSupplier);

  return buildAuthResult(user);
};

// Export the provider
export const Credentials: Provider = CredentialsProvider({
  name: "Credentials",
  credentials: {
    credential: { label: "Credencial", type: "text", placeholder: "NIP ou CNPJ" },
    password: { label: "Senha", type: "password", placeholder: "**********" },
  },
  authorize: authorizeUser,
});

// Export functions for testing
export {
  isSupplierCredential,
  isAccountLocked,
  calculateLockoutUntil,
  findUserByCredential,
  handleFailedLogin,
  resetLoginAttempts,
  validateCredentials,
  buildAuthResult,
  authorizeUser,
};
