import { supabase } from "@/integrations/supabase/client";
import { ContactFormValues } from "./ContactFormSchema";

export const useContactService = () => {
  const submitContact = async (values: ContactFormValues) => {
    const { data: emailData, error: emailError } = await supabase.functions.invoke("send-contact-email", {
      body: {
        name: values.name,
        email: values.email,
        company: values.company || "",
        message: values.message,
        leadSource: "contact_form",
        serviceInterest: "General Inquiry",
      }
    });

    if (emailError) {
      throw new Error(emailError.message);
    }

    console.log("Contact form submitted:", { emailData });
    return { emailData };
  };

  return { submitContact };
};
