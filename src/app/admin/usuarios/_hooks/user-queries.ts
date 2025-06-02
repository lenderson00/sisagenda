"use client";

import { useQuery } from "@tanstack/react-query";
import { userKeys } from "./user-keys";

export function useUsers(orgId: string) {
  return useQuery({
    queryKey: userKeys.list(orgId),
    queryFn: async () => {
      const response = await fetch("/api/users", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return response.json();
    },
  });
}

export function useUser(orgId: string, id: string) {
  return useQuery({
    queryKey: userKeys.detail(orgId, id),
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) {
        throw new Error("User not found");
      }
      return response.json();
    },
    enabled: !!id,
  });
}

export function useUserStats(orgId: string) {
  return useQuery({
    queryKey: userKeys.stats(orgId),
    queryFn: async () => {
      const response = await fetch("/api/users/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch user stats");
      }
      return response.json();
    },
  });
}
