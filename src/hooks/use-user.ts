"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const useUser = () => {
  const { data: session, status: sessionStatus } = useSession();
  const [isLoadingWithTimeout, setIsLoadingWithTimeout] = useState(true);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  // Handle loading state with timeout to prevent infinite loading
  useEffect(() => {
    if (sessionStatus === "loading") {
      // Set a timeout to prevent infinite loading
      const timer = setTimeout(() => {
        setIsLoadingWithTimeout(false);
        setHasTimedOut(true);
        console.warn("useUser: Session loading timed out after 3 seconds");
      }, 3000); // 3 seconds timeout

      return () => clearTimeout(timer);
    } else {
      setIsLoadingWithTimeout(false);
      setHasTimedOut(false);
    }
  }, [sessionStatus]);

  // Determine loading state:
  // - If we have session data but status is loading, don't show loading
  // - If status is loading and we haven't timed out, show loading
  // - If we've timed out, don't show loading
  const isLoading =
    sessionStatus === "loading" && !session && isLoadingWithTimeout;

  // Determine authentication state
  const isAuthenticated =
    sessionStatus === "authenticated" ||
    (session !== null && session !== undefined && !hasTimedOut);

  console.log(
    "Session status:",
    sessionStatus,
    "Session:",
    !!session,
    "IsLoading:",
    isLoading,
    "HasTimedOut:",
    hasTimedOut,
  );

  return {
    user: session?.user || null,
    isAuthenticated,
    isLoading,
  };
};
