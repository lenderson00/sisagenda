import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FilterContextProvider } from "../_context/filter-context";
import { ConsultaResultsClient } from "./page-client";

export default async function ConsultaResultsPage() {
  const session = await auth();

  if (!session || !session.user || session.user.role !== "COMIMSUP_ADMIN") {
    redirect("/entrar");
  }

  return (
    <FilterContextProvider>
      <ConsultaResultsClient />
    </FilterContextProvider>
  );
}
