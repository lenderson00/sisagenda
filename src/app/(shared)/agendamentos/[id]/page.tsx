import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { AppointmentActivityWithRelations } from "@/types/appointment-activity";
import { AppointmentActions } from "./_components/appointment-actions";
import { AppointmentActivityList } from "./_components/appointment-activity";
import { AppointmentDetailsCard } from "./_components/appointment-details-card";
import { AppointmentFormDetailsSidebar } from "./_components/appointment-form-details-sidebar";

interface AppointmentPageProps {
  params: Promise<{ id: string }>;
}

async function getAppointment(id: string) {
  const session = await auth();

  const appointment = await prisma.appointment.findUnique({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      deliveryType: true,
      User: true,
      Supplier: true,
      items: true,
      attachments: true,
      activities: {
        include: {
          user: true,
          supplier: true,
          replies: {
            include: {
              user: true,
              supplier: true,
              replies: {
                include: {
                  user: true,
                  supplier: true,
                },
              },
            },
          },
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

  if (!session?.user?.id || !session?.user?.role) {
    console.log("No session user");
    return null;
  }

  const { user } = session;
  const userRole = user.role;
  const isSupplier = user.role === "FORNECEDOR";

  if (userRole === "SUPER_ADMIN" || userRole === "COMIMSUP_ADMIN") {
    return appointment;
  }

  if (isSupplier) {
    if (appointment.supplierId === user.id) {
      return appointment;
    }
  }

  if (userRole === "ADMIN" || userRole === "USER") {
    if (appointment.organizationId === user.organizationId) {
      return appointment;
    }
  }

  return null;
}

export default async function AppointmentPage({
  params,
}: AppointmentPageProps) {
  const { id } = await params;
  const session = await auth();
  const appointment = await getAppointment(id);

  if (!appointment) {
    notFound();
  }

  const creator = appointment.User ?? appointment.Supplier;

  const plainAppointment = {
    ...appointment,
    creator,
    items: appointment.items.map((item) => ({
      ...item,
      price: item.price.toString(),
    })),
  };

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <AppointmentDetailsCard appointment={plainAppointment} />
          <AppointmentActivityList
            appointmentId={id}
            initialActivities={
              appointment.activities as AppointmentActivityWithRelations[]
            }
            currentUser={{
              name: session?.user?.name ?? "Usuário",
            }}
          />
        </div>
        {/* Right Column: Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <AppointmentActions appointment={plainAppointment} />
          <AppointmentFormDetailsSidebar appointment={plainAppointment} />
        </div>
      </div>
    </div>
  );
}
