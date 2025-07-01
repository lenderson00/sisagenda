import type { AppointmentActivity, User } from "@prisma/client";

// Define the type with included relations for appointment activities
export type AppointmentActivityWithRelations = AppointmentActivity & {
  user: User;
  replies?: AppointmentActivityWithRelations[];
};
