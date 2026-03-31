
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, ContactFormValues } from "./ContactFormSchema";
import { useContactService } from "./useContactService";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContactFormProps = {
  className?: string;
};

const ContactForm = ({ className }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitContact } = useContactService();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", company: "", message: "" },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      await submitContact(values);
      toast.success("Transmission received.", {
        description: "A CesiumCyber analyst will respond within 24 hours.",
      });
      form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Transmission failed.", {
        description: "Retry or contact: information@cesiumcyber.com",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass =
    "w-full px-4 py-3 bg-[#0F0F0F] border border-[#D4AF37]/20 text-white/88 text-[16px] font-ui placeholder:text-white/35 focus:border-[#D4AF37]/50 focus:outline-none transition-colors rounded-none";

  return (
    <div className={`border border-[#D4AF37]/15 ${className}`}>
      {/* Header */}
      <div className="bg-[#D4AF37]/5 border-b border-[#D4AF37]/15 px-5 py-3 flex justify-between items-center">
        <span className="font-tech text-[10px] tracking-[0.16em] text-[#D4AF37]/70">SEND A MESSAGE</span>
        <span className="font-tech text-[9px] tracking-[0.12em] text-white/30">SECURE FORM</span>
      </div>

      <div className="px-6 py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-ui text-[15px] text-white/78 block mb-2">
                    Full name
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className={fieldClass} placeholder="Firstname Lastname" />
                  </FormControl>
                  <FormMessage className="text-red-400 text-[11px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-ui text-[15px] text-white/78 block mb-2">
                    Email address
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="email" className={fieldClass} placeholder="you@organization.com" />
                  </FormControl>
                  <FormMessage className="text-red-400 text-[11px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-ui text-[15px] text-white/78 block mb-2">
                    Organization
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className={fieldClass} placeholder="Company or agency name" />
                  </FormControl>
                  <FormMessage className="text-red-400 text-[11px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-ui text-[15px] text-white/78 block mb-2">
                    Message
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={5}
                      className={fieldClass}
                      placeholder="Describe your security requirements or inquiry..."
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-[11px]" />
                </FormItem>
              )}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-ui border border-[#D4AF37] text-[#D4AF37] text-[16px] py-3.5 hover:bg-[#D4AF37] hover:text-black transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send message"
              )}
            </button>

          </form>
        </Form>
      </div>
    </div>
  );
};

export default ContactForm;
