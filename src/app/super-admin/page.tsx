import { auth } from "@/lib/auth";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { getOrganizations } from "./_hooks/use-organizations";
import { OrganizationList } from "./page-client";

export default async function AdminPage() {
  const session = await auth();

  if (!session || !session.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/entrar");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["Organizations"],
    queryFn: getOrganizations,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrganizationList />
    </HydrationBoundary>
  );
}
