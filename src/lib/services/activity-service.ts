import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AppointmentStatus } from "@prisma/client";
import { startOfYear, endOfYear, format, eachDayOfInterval } from "date-fns";

export const activitySchema = z.object({
  date: z.string(),
  count: z.number(),
  level: z.number().min(0).max(4),
});

export type Activity = z.infer<typeof activitySchema>;

/**
 * Gets real activity data for the entire year based on completed appointments
 */
export async function getYearlyActivity(organizationId: string): Promise<Activity[]> {
  const currentYear = new Date().getFullYear();
  const startDate = startOfYear(new Date(currentYear, 0, 1));
  const endDate = endOfYear(new Date(currentYear, 11, 31));

  // Get all completed appointments for the year
  const completedAppointments = await prisma.appointment.findMany({
    where: {
      organizationId,
      status: AppointmentStatus.COMPLETED,
      date: {
        gte: startDate,
        lte: endDate,
      },
      deletedAt: null,
    },
    select: {
      date: true,
    },
  });

  // Also get confirmed appointments to show pending activity
  const confirmedAppointments = await prisma.appointment.findMany({
    where: {
      organizationId,
      status: AppointmentStatus.CONFIRMED,
      date: {
        gte: startDate,
        lte: endDate,
      },
      deletedAt: null,
    },
    select: {
      date: true,
    },
  });

  // Group appointments by date
  const appointmentsByDate = new Map<string, number>();

  // Count completed appointments
  for (const appointment of completedAppointments) {
    const dateString = format(appointment.date, 'yyyy-MM-dd');
    appointmentsByDate.set(dateString, (appointmentsByDate.get(dateString) || 0) + 1);
  }

  // Add confirmed appointments (weighted less than completed)
  for (const appointment of confirmedAppointments) {
    const dateString = format(appointment.date, 'yyyy-MM-dd');
    const currentCount = appointmentsByDate.get(dateString) || 0;
    appointmentsByDate.set(dateString, currentCount + 0.5); // Weight confirmed appointments as 0.5
  }

  // Generate activity data for all days of the year
  const activities: Activity[] = [];
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  for (const date of allDays) {
    const dateString = format(date, 'yyyy-MM-dd');
    const count = appointmentsByDate.get(dateString) || 0;
    const level = getActivityLevel(count);

    activities.push({
      date: dateString,
      count,
      level,
    });
  }

  return activities;
}

/**
 * Converts activity count to level (0-4)
 */
function getActivityLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 1) return 1;
  if (count <= 2) return 2;
  if (count <= 3) return 3;
  return 4;
}

/**
 * Gets activity data for a specific date range
 */
export async function getActivityRange(
  organizationId: string,
  startDate: Date,
  endDate: Date
): Promise<Activity[]> {
  const allActivities = await getYearlyActivity(organizationId);

  return allActivities.filter(activity => {
    const activityDate = new Date(activity.date);
    return activityDate >= startDate && activityDate <= endDate;
  });
}

/**
 * Gets activity statistics based on real data
 */
export async function getActivityStats(organizationId: string): Promise<{
  totalDays: number;
  activeDays: number;
  totalActivity: number;
  averageActivity: number;
  maxActivity: number;
}> {
  const activities = await getYearlyActivity(organizationId);

  const totalDays = activities.length;
  const activeDays = activities.filter(a => a.count > 0).length;
  const totalActivity = activities.reduce((sum, a) => sum + a.count, 0);
  const averageActivity = totalDays > 0 ? Math.round(totalActivity / totalDays) : 0;
  const maxActivity = Math.max(...activities.map(a => a.count));

  return {
    totalDays,
    activeDays,
    totalActivity,
    averageActivity,
    maxActivity,
  };
}
