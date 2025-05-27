"use server";

import { signIn } from "@/lib/auth";

export const signInWithEmail = async (email: string, password: string) => {
  await signIn("credentials", {
    email,
    password,
  });
};
