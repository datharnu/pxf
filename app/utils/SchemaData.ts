import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  eventFlyer: z.string().url("Event Flyer must be a valid URL").optional(),
  guestLimit: z.enum(["10", "100", "250", "500", "800", "1000+"]),
  photoCapLimit: z.enum(["5", "10", "15", "20", "25"]),
  eventDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Event Date must be a valid date",
  }),
  isPasswordProtected: z.boolean(),
  customPassword: z
    .string()
    .min(4, "Custom Password must be at least 4 characters")
    .optional(),
});
