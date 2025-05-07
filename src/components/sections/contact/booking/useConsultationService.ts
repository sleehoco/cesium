
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { ConsultationBookingValues } from "./ConsultationBookingSchema";

export const useConsultationService = () => {
  const submitConsultation = async (values: ConsultationBookingValues) => {
    const bookingDetails = {
      name: values.bookingName,
      email: values.bookingEmail,
      date: format(values.bookingDate, "MMMM do, yyyy"),
      time: values.bookingTime,
      message: `Consultation Request: ${values.bookingName} has requested a consultation on ${format(values.bookingDate, "MMMM do, yyyy")} at ${values.bookingTime}.`
    };

    // Send email using the send-contact-email edge function
    const { data, error } = await supabase.functions.invoke("send-contact-email", {
      body: {
        name: values.bookingName,
        email: values.bookingEmail,
        company: "Consultation Booking",
        message: `Consultation Request: I would like to schedule a consultation on ${format(values.bookingDate, "MMMM do, yyyy")} at ${values.bookingTime}.`,
        recipient: "jmorrison@cesiumcyber.com" // Add recipient for the company email
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log("Consultation booking submitted:", bookingDetails);
    console.log("Email function response:", data);
    
    return data;
  };

  return { submitConsultation };
};
