import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FilterBuilderClient } from "./page-client";
import { FilterContextProvider } from "../_context/filter-context";

export default async function ConsultaFilterBuilderPage() {
  const session = await auth();

  if (!session || !session.user || session.user.role !== "COMIMSUP_ADMIN") {
    redirect("/entrar");
  }

  return (
    <FilterContextProvider>
      <FilterBuilderClient />
    </FilterContextProvider>
  );
}
