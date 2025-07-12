import { z } from "zod";

export const allSubject = z.tuple([z.literal("manage"), z.literal("all")]);

export type AllSubject = z.infer<typeof allSubject>;
