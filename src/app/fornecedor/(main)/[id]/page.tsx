import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AppointmentActivityList } from "./_components/appointment-activity";
import { AppointmentDetailsCard } from "./_components/appointment-details-card";
import { AppointmentFormDetailsSidebar } from "./_components/appointment-form-details-sidebar";

interface AppointmentPageProps {
  params: Promise<{ id: string }>;
}

async function getAppointment(id: string) {
  const session = await auth();

  if (!session?.user) {
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

  return appointment;
}

export default async function AppointmentPage({
  params,
}: AppointmentPageProps) {
  const { id } = await params;
  const appointment = await getAppointment(id);

  if (!appointment) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <AppointmentDetailsCard appointment={appointment} />
          <AppointmentActivityList
            appointmentId={id}
            initialActivities={appointment.activities}
            currentUser={{ name: appointment.user.name || "" }}
          />
        </div>
        {/* Right Column: Sidebar */}
        <div className="lg:col-span-1">
          <AppointmentFormDetailsSidebar appointment={appointment} />
        </div>
      </div>
    </div>
  );
}
