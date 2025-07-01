import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { auth } from "@/lib/auth";
import dayjs from "@/lib/dayjs";
import { prisma } from "@/lib/prisma";
import { AlertCircleIcon } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { ActionsProvider } from "./_context/actions-context";

const AgendamentosLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) => {
  const session = await auth();
  const { id } = await params;

  if (!session?.user || !session.user.role) {
    redirect("/entrar");
  }

  const appointment = await prisma.appointment.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      deliveryType: true,
      items: true,
      attachments: true,
      activities: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!appointment) {
    notFound();
  }

  const plainAppointment = {
    ...appointment,
    items: appointment.items.map((item) => ({
      ...item,
      price: item.price.toString(),
    })),
  };

  return (
    <ActionsProvider appointment={plainAppointment}>
      <div className="flex flex-col items-center bg-muted dark:bg-background justify-start pt-12 min-h-screen h-fit  relative">
        <div className="w-full container flex flex-col gap-4 items-center">
          <div className="flex flex-col gap-0 items-center">
            <h1 className="text-md text-muted-foreground">Agendamento</h1>
            <div className="text-xl font-bold">
              {dayjs(appointment?.date).format("DD/MM/YYYY HH:mm")}
            </div>
          </div>

          {children}
        </div>
        <div className=" my-12 text-sm text-muted-foreground">SisAgenda</div>
      </div>
    </ActionsProvider>
  );
};

export default AgendamentosLayout;
