
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { consultationBookingSchema, ConsultationBookingValues } from "./ConsultationBookingSchema";
import { Button } from "@/components/ui/button";
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

type ConsultationBookingFormProps = {
  onSubmit: (values: ConsultationBookingValues) => Promise<void>;
  isSubmitting: boolean;
  availableTimes: string[];
};

const ConsultationBookingForm = ({ 
  onSubmit, 
  isSubmitting, 
  availableTimes 
}: ConsultationBookingFormProps) => {
  const form = useForm<ConsultationBookingValues>({
    resolver: zodResolver(consultationBookingSchema),
    defaultValues: {
      bookingName: "",
      bookingEmail: "",
      bookingTime: "",
    },
  });

  return (
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
  );
};

export default ConsultationBookingForm;
