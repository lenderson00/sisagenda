"use client";

import { useSession } from "next-auth/react";

export const useUser = () => {
  const { data: session, status: sessionStatus } = useSession();

  return {
    user: session?.user,
    isAuthenticated: sessionStatus === "authenticated",
    isLoading: sessionStatus === "loading",
  };
};
