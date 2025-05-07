
import { z } from "zod";

export const consultationBookingSchema = z.object({
  bookingName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  bookingEmail: z.string().email({ message: "Please enter a valid email address" }),
  bookingDate: z.date({
    required_error: "Please select a date",
    invalid_type_error: "That's not a valid date",
  }),
  bookingTime: z.string({
    required_error: "Please select a time",
  }).min(1, { message: "Please select a time" }),
});

export type ConsultationBookingValues = z.infer<typeof consultationBookingSchema>;
