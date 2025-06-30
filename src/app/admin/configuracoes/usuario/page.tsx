import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import UserInfoForm from "./_components/user-info-form";
import WhatsappForm from "./_components/whatsapp-form";

export default async function ConfiguracoesUsuarioPage() {
  const session = await auth();

  if (!session) {
    redirect("/entrar");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-8">
      <UserInfoForm
        title="Informações do Usuário"
        description="Edite as informações do seu perfil de usuário."
        helpText="Estas informações não incluem o seu número de WhatsApp."
        initialValues={{}}
        user={user}
      />
      <WhatsappForm user={user} />
    </div>
  );
}
