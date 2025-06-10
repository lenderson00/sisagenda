"use server";

import { signIn as signInAction } from "@/lib/auth";

export const signIn = async (credentials: { email: string; password: string }) => {
  try {
    await signInAction("credentials", {
      email: credentials.email,
      password: credentials.password,
    });
  } catch (error) {
    console.error(error);
    return { error: "Credenciais inválidas" };
  }

};