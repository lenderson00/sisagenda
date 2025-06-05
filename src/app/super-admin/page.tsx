import { auth } from "@/lib/auth";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { CreateOrganizationDialog } from "./_components/create-organization-dialog";
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
    <div>
      <div className="border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Organizações Militares
              </h1>
              <p className="text-gray-600 mt-1">
                Gerencie as organizações militares e seus administradores
              </p>
            </div>
            <CreateOrganizationDialog />
          </div>
        </div>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <OrganizationList />
      </HydrationBoundary>
    </div>
  );
}
