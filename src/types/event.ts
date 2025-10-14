import { z } from "zod";

export const eventSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  price: z.number().min(0, "Price must be positive"),
  dateTime: z.string().min(1, "Date and time is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  liked: z.boolean().default(false),
});

export type Event = z.infer<typeof eventSchema>;

export const createEventSchema = eventSchema.omit({ id: true, liked: true });
export type CreateEventInput = z.infer<typeof createEventSchema>;
