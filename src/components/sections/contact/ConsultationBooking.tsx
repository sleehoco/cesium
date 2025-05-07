
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { consultationBookingSchema, ConsultationBookingValues } from "./ConsultationBookingSchema";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@supabase/supabase-js";

type ConsultationBookingProps = {
  className?: string;
};

const ConsultationBooking = ({ className }: ConsultationBookingProps) => {
  const [isOpenBooking, setIsOpenBooking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTimes = [
    "09:00 AM", "10:00 AM", "11:00 AM", 
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ];

  const form = useForm<ConsultationBookingValues>({
    resolver: zodResolver(consultationBookingSchema),
    defaultValues: {
      bookingName: "",
      bookingEmail: "",
      bookingTime: "",
    },
  });

  const onSubmit = async (values: ConsultationBookingValues) => {
    setIsSubmitting(true);
    
    try {
      // Get Supabase client
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL || "",
        import.meta.env.VITE_SUPABASE_ANON_KEY || ""
      );
      
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
          message: `Consultation Request: I would like to schedule a consultation on ${format(values.bookingDate, "MMMM do, yyyy")} at ${values.bookingTime}.`
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log("Consultation booking submitted:", bookingDetails);
      console.log("Email function response:", data);
      
      toast.success("Consultation booked successfully!", {
        description: `Your appointment is scheduled for ${format(values.bookingDate, "MMMM do, yyyy")} at ${values.bookingTime}. A confirmation has been sent to your email.`,
      });
      
      form.reset();
      setIsOpenBooking(false);
    } catch (error: any) {
      console.error("Failed to book consultation:", error);
      toast.error("Failed to book consultation", {
        description: "Please try again later or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="consult" className={`bg-cyber-dark rounded-lg border border-cesium/20 p-6 md:p-8 ${className}`}>
      <h3 className="text-2xl font-semibold text-white mb-4">Free Consultation</h3>
      <p className="text-gray-400 mb-6">
        Schedule a free 30-minute consultation with our security experts to discuss your cybersecurity needs.
      </p>
      <Dialog open={isOpenBooking} onOpenChange={setIsOpenBooking}>
        <DialogTrigger asChild>
          <Button className="w-full bg-cesium hover:bg-cesium-dark text-cyber-dark font-medium px-4 py-3 rounded-md transition-colors">
            Book a Consultation
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-cyber-dark border border-cesium/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-white">Book Your Free Consultation</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="bookingName"
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
                name="bookingEmail"
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
                name="bookingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-medium text-gray-300">
                      Select Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-cyber border border-cesium/30 text-white hover:bg-cyber/80 hover:text-white",
                            !field.value && "text-gray-400"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-cyber-dark border border-cesium/20">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto bg-cyber-dark text-white"
                          disabled={(date) => 
                            date < new Date(new Date().setHours(0,0,0,0)) || 
                            date.getDay() === 0 || 
                            date.getDay() === 6
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bookingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-300">
                      Select Time
                    </FormLabel>
                    <FormControl>
                      <select
                        id="bookingTime"
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full px-4 py-3 rounded-md bg-cyber border border-cesium/30 text-white focus:border-cesium focus:ring-1 focus:ring-cesium outline-none transition-colors"
                      >
                        <option value="">Select a time</option>
                        {availableTimes.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-cesium hover:bg-cesium-dark text-cyber-dark font-medium mt-4"
              >
                {isSubmitting ? "Processing..." : "Confirm Booking"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsultationBooking;
