
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ConsultationBookingProps = {
  className?: string;
};

const ConsultationBooking = ({ className }: ConsultationBookingProps) => {
  const [bookingDate, setBookingDate] = useState<Date | undefined>(undefined);
  const [bookingTime, setBookingTime] = useState<string>("");
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [isOpenBooking, setIsOpenBooking] = useState(false);

  const availableTimes = [
    "09:00 AM", "10:00 AM", "11:00 AM", 
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ];

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "bookingName") setBookingName(value);
    if (name === "bookingEmail") setBookingEmail(value);
    if (name === "bookingTime") setBookingTime(value);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingDate || !bookingTime || !bookingName || !bookingEmail) {
      toast.error("Please fill out all fields");
      return;
    }

    // In a real application, we would send this data to a backend
    const bookingDetails = {
      name: bookingName,
      email: bookingEmail,
      date: format(bookingDate, "MMMM do, yyyy"),
      time: bookingTime
    };

    console.log("Booking submitted:", bookingDetails);
    
    // Email would be sent from a backend service in a production app
    // For this demo, we'll simulate success with a toast notification
    toast.success("Consultation booked successfully!", {
      description: `Your appointment is scheduled for ${format(bookingDate, "MMMM do, yyyy")} at ${bookingTime}. A confirmation has been sent to ${bookingEmail} and information@cesiumcyber.com.`,
    });
    
    // Reset form and close dialog
    setBookingDate(undefined);
    setBookingTime("");
    setBookingName("");
    setBookingEmail("");
    setIsOpenBooking(false);
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
          <form onSubmit={handleBookingSubmit} className="space-y-4 mt-4">
            <div>
              <label htmlFor="bookingName" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="bookingName"
                name="bookingName"
                value={bookingName}
                onChange={handleBookingChange}
                className="w-full px-4 py-3 rounded-md bg-cyber border border-cesium/30 text-white focus:border-cesium focus:ring-1 focus:ring-cesium outline-none transition-colors"
                placeholder="Your name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="bookingEmail" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="bookingEmail"
                name="bookingEmail"
                value={bookingEmail}
                onChange={handleBookingChange}
                className="w-full px-4 py-3 rounded-md bg-cyber border border-cesium/30 text-white focus:border-cesium focus:ring-1 focus:ring-cesium outline-none transition-colors"
                placeholder="your.email@example.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Select Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-cyber border border-cesium/30 text-white hover:bg-cyber/80 hover:text-white",
                      !bookingDate && "text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {bookingDate ? format(bookingDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-cyber-dark border border-cesium/20">
                  <Calendar
                    mode="single"
                    selected={bookingDate}
                    onSelect={setBookingDate}
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
            </div>
            
            <div>
              <label htmlFor="bookingTime" className="block text-sm font-medium text-gray-300 mb-1">
                Select Time
              </label>
              <select
                id="bookingTime"
                name="bookingTime"
                value={bookingTime}
                onChange={handleBookingChange}
                className="w-full px-4 py-3 rounded-md bg-cyber border border-cesium/30 text-white focus:border-cesium focus:ring-1 focus:ring-cesium outline-none transition-colors"
                required
              >
                <option value="">Select a time</option>
                {availableTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            
            <Button 
              type="submit"
              className="w-full bg-cesium hover:bg-cesium-dark text-cyber-dark font-medium mt-4"
            >
              Confirm Booking
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsultationBooking;
