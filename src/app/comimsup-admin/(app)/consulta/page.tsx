import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ConsultaParametrizadaClient } from "./page-client";

export default async function ComimsupAdminConsultaPage() {
  const session = await auth();

  if (!session || !session.user || session.user.role !== "COMIMSUP_ADMIN") {
    redirect("/entrar");
  }

  return <ConsultaParametrizadaClient />;
}
