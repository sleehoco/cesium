
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { ConsultationBookingValues } from "./ConsultationBookingSchema";

export const useConsultationService = () => {
  const submitConsultation = async (values: ConsultationBookingValues) => {
    const dateStr = format(values.bookingDate, "MMMM do, yyyy");
    
    // Create lead in CRM
    const { data: leadData, error: leadError } = await supabase.functions.invoke("create-lead", {
      body: {
        name: values.bookingName,
        email: values.bookingEmail,
        company: null,
        phone: null,
        source: "consultation_booking",
        service_interest: "Consultation",
        initial_message: `Consultation requested for ${dateStr} at ${values.bookingTime}`,
        expected_close_date: format(values.bookingDate, "yyyy-MM-dd")
      }
    });

    if (leadError) {
      console.error("Error creating lead:", leadError);
    }

    // Send email using the send-contact-email edge function
    const { data: emailData, error: emailError } = await supabase.functions.invoke("send-contact-email", {
      body: {
        name: values.bookingName,
        email: values.bookingEmail,
        company: "Consultation Booking",
        message: `Consultation Request: I would like to schedule a consultation on ${dateStr} at ${values.bookingTime}.`,
        recipient: "jmorrison@cesiumcyber.com"
      }
    });

    if (emailError) {
      throw new Error(emailError.message);
    }

    console.log("Consultation booking submitted:", { leadData, emailData });
    return { leadData, emailData };
  };

  return { submitConsultation };
};
