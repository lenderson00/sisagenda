import { prisma } from "@/lib/prisma";

export const getAvailabilityPerDay = async (
  deliveryTypeId: string,
  weekDay: number,
) => {
  const availability = await prisma.availability.findFirst({
    where: {
      deliveryTypeId,
      weekDay,
    },
    include: {
      deliveryType: {
        include: {
          AvailabilitySettings: true,
          AvailabilityRule: true,
        },
      },
    },
  });

  if (!availability) {
    return null;
  }

  const config = {
    lunchStart:
      availability.deliveryType.AvailabilitySettings?.lunchTimeStart ?? 0,
    lunchEnd: availability.deliveryType.AvailabilitySettings?.lunchTimeEnd ?? 0,
    activityDuration:
      availability.deliveryType.AvailabilitySettings?.duration ?? 0,
    startHour: availability.startTime,
    endHour: availability.endTime,
    availabilityRule: availability.deliveryType.AvailabilityRule || [],
  };

  return {
    availability,
    ...config,
  };
};
