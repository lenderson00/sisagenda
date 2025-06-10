"use server";

import { signIn as signInAction, signOut as signOutAction } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const signIn = async (credentials: { email: string; password: string }) => {
  try {
    await signInAction("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: true,
      redirectTo: "/",
    });
    revalidatePath("/");
  } catch (error) {
    console.error(error);
    return { error: "Credenciais inválidas" };
  }

};

export const signOut = async () => {
  await signOutAction({
    redirect: true,
    redirectTo: "/",
  });
  revalidatePath("/");
};