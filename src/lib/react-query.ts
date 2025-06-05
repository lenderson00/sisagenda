"use client";

import { QueryClient, isServer } from "@tanstack/react-query";

const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // Consider data stale immediately
      },
    },
  });
};

let browserClient: QueryClient | undefined;

export const getQueryClient = () => {
  if (isServer) {
    return createQueryClient();
  }

  if (!browserClient) {
    browserClient = createQueryClient();
  }

  return browserClient;
};
