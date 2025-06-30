import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AppointmentActions } from "./_components/appointment-actions";
import { AppointmentActivityList } from "./_components/appointment-activity";
import { AppointmentDetailsCard } from "./_components/appointment-details-card";
import { AppointmentFormDetailsSidebar } from "./_components/appointment-form-details-sidebar";

interface AppointmentPageProps {
  params: Promise<{ id: string }>;
}

async function getAppointment(id: string) {
  const session = await auth();

  if (!session?.user?.id || !session?.user?.role) {
    return null;
  }

  const appointment = await prisma.appointment.findUnique({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      deliveryType: true,
      user: true,
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

  const { user } = session;
  const userRole = user.role;

  if (userRole === "SUPER_ADMIN" || userRole === "COMIMSUP") {
    return appointment;
  }

  if (userRole === "FORNECEDOR") {
    if (appointment.userId === user.id) {
      return appointment;
    }
  }

  if (userRole === "ADMIN" || userRole === "USER") {
    if (appointment.deliveryType.organizationId === user.organizationId) {
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

  if (!appointment || !session?.user) {
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
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <AppointmentDetailsCard appointment={plainAppointment} />
          <AppointmentActivityList
            appointmentId={id}
            initialActivities={appointment.activities}
            currentUser={{
              name: session.user.name || "Usuário",
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
