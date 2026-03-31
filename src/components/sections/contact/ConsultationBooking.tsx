
import { useState } from "react";
import { toast } from "sonner";
import { ConsultationBookingValues } from "./booking/ConsultationBookingSchema";
import { useConsultationService } from "./booking/useConsultationService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ConsultationBookingForm from "./booking/ConsultationBookingForm";
import { format } from "date-fns";

type ConsultationBookingProps = {
  className?: string;
};

const ConsultationBooking = ({ className }: ConsultationBookingProps) => {
  const [isOpenBooking, setIsOpenBooking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitConsultation } = useConsultationService();

  const availableTimes = [
    "09:00 AM", "10:00 AM", "11:00 AM", 
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ];

  const onSubmit = async (values: ConsultationBookingValues) => {
    setIsSubmitting(true);
    
    try {
      await submitConsultation(values);
      
      toast.success("Consultation booked successfully!", {
        description: `Your appointment is scheduled for ${format(values.bookingDate, "MMMM do, yyyy")} at ${values.bookingTime}. A confirmation has been sent to your email.`,
      });
      
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
      <h3 className="font-display text-3xl font-semibold text-white mb-4">Free consultation</h3>
      <p className="font-ui text-[16px] text-gray-300 leading-7 mb-6">
        Schedule a free 30-minute consultation with our security experts to discuss your cybersecurity needs.
      </p>
      <Dialog open={isOpenBooking} onOpenChange={setIsOpenBooking}>
        <DialogTrigger asChild>
          <Button className="w-full bg-cesium hover:bg-cesium-dark text-cyber-dark font-ui text-[16px] font-medium px-4 py-3 rounded-md transition-colors">
            Book a consultation
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-cyber-dark border border-cesium/20 text-white">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-semibold text-white">Book your free consultation</DialogTitle>
          </DialogHeader>
          
          <ConsultationBookingForm 
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            availableTimes={availableTimes}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsultationBooking;
