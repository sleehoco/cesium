import { supabase } from "@/integrations/supabase/client";
import { ContactFormValues } from "./ContactFormSchema";

export const useContactService = () => {
  const submitContact = async (values: ContactFormValues) => {
    // Create lead in CRM
    const { data: leadData, error: leadError } = await supabase.functions.invoke("create-lead", {
      body: {
        name: values.name,
        email: values.email,
        company: values.company || null,
        phone: null,
        source: "contact_form",
        service_interest: "General Inquiry",
        initial_message: values.message
      }
    });

    if (leadError) {
      console.error("Error creating lead:", leadError);
    }

    // Send email notification to company
    const { data: emailData, error: emailError } = await supabase.functions.invoke("send-contact-email", {
      body: {
        name: values.name,
        email: values.email,
        company: values.company || "",
        message: values.message,
        recipient: "jmorrison@cesiumcyber.com"
      }
    });

    if (emailError) {
      throw new Error(emailError.message);
    }

    console.log("Contact form submitted:", { leadData, emailData });
    return { leadData, emailData };
  };

  return { submitContact };
};