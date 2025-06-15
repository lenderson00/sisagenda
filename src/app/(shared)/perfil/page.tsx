"use client";

import { useUser } from "@/hooks/use-user";

export default function MePage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div className="container mx-auto px-6 py-8">Loading...</div>;
  }

  if (!user) {
    return <div className="container mx-auto px-6 py-8">User not found.</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8 flex-1 h-full flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-6">Meu Usuário</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {JSON.stringify(user)}
      </div>
    </div>
  );
}
