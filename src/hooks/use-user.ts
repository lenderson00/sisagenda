"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useUser = () => {
  const { data: session, status: sessionStatus } = useSession();

  const userResult = useQuery({
    queryKey: ["user", session?.user?.email],
    queryFn: () => fetch("/api/user").then((res) => res.json()),
    enabled: !!session?.user?.email, // Only fetch when we have a session
    staleTime: 30 * 1000, // 30 seconds - more frequent updates
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnMount: true, // Refetch when component mounts
    retry: 2, // Retry failed requests
  });

  // Session is still loading
  if (sessionStatus === "loading") {
    return {
      user: null,
      isAuthenticated: false,
      isLoading: true,
    };
  }

  // No session - user is not authenticated
  if (!session || !session.user) {
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
    };
  }

  // User query is loading
  if (userResult.isLoading) {
    return {
      user: null,
      isAuthenticated: true,
      isLoading: true,
    };
  }

  // User query has error
  if (userResult.isError) {
    return {
      user: null,
      isAuthenticated: true,
      isLoading: false,
      error: userResult.error,
    };
  }

  // User data is available
  return {
    user: userResult.data,
    isAuthenticated: true,
    isLoading: false,
  };
};
