import { prisma } from "@/lib/prisma";

export const getAvailabilityPerDay = async (
  deliveryTypeId: string,
  weekDay: number,
) => {
  const availability = await prisma.availability.findFirst({
    where: {
      schedule: {
        deliveryTypes: {
          some: {
            id: deliveryTypeId,
          },
        },
      },
      weekDay,
    },
    include: {
      schedule: {
        include: {
          deliveryTypes: true,
          availabilityRules: true,
        },
      },
    },
  });

  if (!availability) {
    return null;
  }

  const config = {
    lunchStart: availability.schedule?.deliveryTypes[0]?.lunchTimeStart ?? 0,
    lunchEnd: availability.schedule?.deliveryTypes[0]?.lunchTimeEnd ?? 0,
    activityDuration: availability.schedule?.deliveryTypes[0]?.duration ?? 0,
    startHour: availability.startTime,
    endHour: availability.endTime,
    availabilityRule: availability.schedule?.availabilityRules || [],
  };

  return {
    availability,
    ...config,
  };
};
