"use client";

import { useSession } from "next-auth/react";

export const useUser = () => {
  const { data: session } = useSession();

  return {
    user: session?.user,
    isAuthenticated: !!session,
    isLoading: !session,
  };
};
