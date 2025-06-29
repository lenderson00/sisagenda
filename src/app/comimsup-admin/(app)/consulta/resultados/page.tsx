import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ConsultaResultsClient } from "./page-client";
import { FilterContextProvider } from "../_context/filter-context";

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
