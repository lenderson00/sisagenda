import { auth } from "@/lib/auth";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { AgendamentosList } from "./page-client";

// Mock function to get appointments - replace with actual implementation
async function getAppointments() {
  // This would be replaced with actual data fetching
  return [];
}

export default async function ComimsupAdminAgendamentosPage() {
  const session = await auth();

  if (!session || !session.user || session.user.role !== "COMIMSUP_ADMIN") {
    redirect("/entrar");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["Appointments"],
    queryFn: getAppointments,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AgendamentosList />
    </HydrationBoundary>
  );
}
