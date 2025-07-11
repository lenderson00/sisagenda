"use client";

import { useSession } from "next-auth/react";

export const useUser = () => {
  const { data: session, status: sessionStatus } = useSession();

  console.log(session, sessionStatus);
  return {
    user: session?.user,
    isAuthenticated: sessionStatus === "authenticated",
    isLoading: sessionStatus === "loading",
  };
};
