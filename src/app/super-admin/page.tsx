import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OrganizationList } from "./page-client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getOrganizations } from "./_hooks/use-organizations";
import { CreateOrganizationDialog } from "./_components/create-organization-dialog";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.email) {
    return redirect("/404");
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
