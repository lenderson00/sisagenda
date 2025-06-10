import type { AppointmentActivity, User } from "@prisma/client";

export type ActivityComment = AppointmentActivity & {
  user: User;
  replies: ActivityComment[];
};
