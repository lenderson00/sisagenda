"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useUser = () => {
  const { data: session } = useSession();
  console.log(session);

  const userResult = useQuery({
    queryKey: ["user", session?.user?.email],
    queryFn: () => fetch("/api/user").then((res) => res.json()),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });

  if (
    !session ||
    !session.user ||
    userResult.isLoading ||
    userResult.isError ||
    !userResult.data
  ) {
    return {
      user: null,
      isAuthenticated: false,
      isLoading: true,
    };
  }

  return {
    user: userResult.data,
    isAuthenticated: !!session,
    isLoading: !session,
  };
};
