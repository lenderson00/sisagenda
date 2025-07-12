"use server";

import {
  auth,
  signIn as signInAction,
  signOut as signOutAction,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const baseSignIn = async (credentials: {
  credential: string;
  password: string;
}) => {
  try {
    await signInAction("credentials", {
      credential: credentials.credential,
      password: credentials.password,
      redirect: false,
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Credenciais inválidas" };
  }
};

export const signIn = async (credentials: {
  credential: string;
  password: string;
}) => {
  const result = await baseSignIn(credentials);
  if (result.error) {
    return result;
  }

  if (credentials.credential.length === 14) {
    const supplier = await prisma.supplier.findUnique({
      where: { cnpj: credentials.credential },
    });
    if (supplier?.mustChangePassword) {
      redirect("/nova-senha");
    }
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: credentials.credential,
    },
  });

  if (user?.mustChangePassword) {
    redirect("/nova-senha");
  }

  redirect("/");
};

export const baseSignOut = async () => {
  try {
    await signOutAction({
      redirect: false,
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Erro ao deslogar" };
  }
};

export const signOut = async () => {
  const result = await baseSignOut();
  if (result.error) {
    return result;
  }
  redirect("/entrar");
};

export const resetPassword = async (password: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }
  const isSupplier = session.user.role === "FORNECEDOR";

  if (!password || password.length < 8 || password.length > 30) {
    throw new Error("Senha inválida");
  }

  if (password === "Marinh@2025") {
    throw new Error("Senha não pode ser a senha padrão");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let credential: string;
  if (isSupplier) {
    const user = await prisma.supplier.update({
      where: { id: session.user.id },
      data: { password: hashedPassword, mustChangePassword: false },
      select: { cnpj: true },
    });
    credential = user.cnpj;
  } else {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword, mustChangePassword: false },
      select: { nip: true },
    });
    credential = user.nip;
  }

  await signInAction("credentials", {
    credential,
    password: password,
    redirect: false,
  });

  redirect("/?bem-vindo=true");
};
