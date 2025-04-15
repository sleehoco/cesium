
import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, ContactFormValues } from "./ContactFormSchema";
import { supabase } from "@/integrations/supabase/client";
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
import { Button } from "@/components/ui/button";

type ContactFormProps = {
  className?: string;
};

const ContactForm = ({ className }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: values
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success("Thank you for your message!", {
        description: `Your message has been sent to our team and a confirmation email has been sent to ${values.email}.`,
      });
      
      form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message", {
        description: "Please try again later or contact us directly at information@cesiumcyber.com",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-cyber-dark rounded-lg border border-cesium/20 p-6 md:p-8 ${className}`}>
      <h3 className="text-2xl font-semibold text-white mb-6">Send us a message</h3>
    
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-300">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-full px-4 py-3 rounded-md bg-cyber border border-cesium/30 text-white focus:border-cesium focus:ring-1 focus:ring-cesium outline-none transition-colors"
                    placeholder="Your name"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-300">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    className="w-full px-4 py-3 rounded-md bg-cyber border border-cesium/30 text-white focus:border-cesium focus:ring-1 focus:ring-cesium outline-none transition-colors"
                    placeholder="your.email@example.com"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-300">
                  Company
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-full px-4 py-3 rounded-md bg-cyber border border-cesium/30 text-white focus:border-cesium focus:ring-1 focus:ring-cesium outline-none transition-colors"
                    placeholder="Your company name"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-300">
                  Message
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    className="w-full px-4 py-3 rounded-md bg-cyber border border-cesium/30 text-white focus:border-cesium focus:ring-1 focus:ring-cesium outline-none transition-colors"
                    placeholder="How can we help you?"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-cesium hover:bg-cesium-dark text-cyber-dark font-medium px-4 py-3 rounded-md transition-colors flex items-center justify-center"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
            {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
