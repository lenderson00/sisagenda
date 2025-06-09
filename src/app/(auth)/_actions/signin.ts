"use server";

import { signIn as signInAction } from "@/lib/auth";

export const signIn = async (credentials: { email: string; password: string }) => {
  await signInAction("credentials", {
    email: credentials.email,
    password: credentials.password,
  });
};