"use server";

import { signIn } from "@/lib/auth";

export const signInWithEmail = async (email: string, password: string) => {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      redirectTo: "/",
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Credenciais inválidas" };
  }
};
