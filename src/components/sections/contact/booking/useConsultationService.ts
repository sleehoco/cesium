
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { ConsultationBookingValues } from "./ConsultationBookingSchema";

export const useConsultationService = () => {
  const submitConsultation = async (values: ConsultationBookingValues) => {
    const dateStr = format(values.bookingDate, "MMMM do, yyyy");

    const { data: emailData, error: emailError } = await supabase.functions.invoke("send-contact-email", {
      body: {
        name: values.bookingName,
        email: values.bookingEmail,
        company: "Consultation Booking",
        message: `Consultation Request: I would like to schedule a consultation on ${dateStr} at ${values.bookingTime}.`,
        leadSource: "consultation_booking",
        serviceInterest: "Consultation",
        expectedCloseDate: format(values.bookingDate, "yyyy-MM-dd"),
      }
    });

    if (emailError) {
      throw new Error(emailError.message);
    }

    console.log("Consultation booking submitted:", { emailData });
    return { emailData };
  };

  return { submitConsultation };
};
