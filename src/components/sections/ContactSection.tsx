
import { useState } from "react";
import { Send, Mail, Phone, MapPin, Calendar as CalendarIcon } from "lucide-react";
import ScrollAnimation from "../utils/ScrollAnimation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const [bookingDate, setBookingDate] = useState<Date | undefined>(undefined);
  const [bookingTime, setBookingTime] = useState<string>("");
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [isOpenBooking, setIsOpenBooking] = useState(false);

  const availableTimes = [
    "09:00 AM", "10:00 AM", "11:00 AM", 
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "bookingName") setBookingName(value);
    if (name === "bookingEmail") setBookingEmail(value);
    if (name === "bookingTime") setBookingTime(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here we would typically send an API request to a backend service
    // In a real application, this would send an email to information@cesiumcyber.com
    console.log("Form submitted:", formData);
    
    // In a real implementation, we would have an API call here
    // For this demo, we'll use a toast notification to simulate the email being sent
    toast.success("Thank you for your message!", {
      description: `Your message has been sent to our team and a confirmation email has been sent to ${formData.email} and information@cesiumcyber.com.`,
    });
    
    setFormData({ name: "", email: "", company: "", message: "" });
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
    <div id="contact" className="bg-cyber py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Contact <span className="text-cesium">Us</span>
          </h2>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Let's discuss how we can secure your digital assets
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ScrollAnimation>
            <div className="bg-cyber-dark rounded-lg border border-cesium/20 p-6 md:p-8">
              <h3 className="text-2xl font-semibold text-white mb-6">Send us a message</h3>
            
              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-md bg-cyber border border-cesium/30 text-white focus:border-cesium focus:ring-1 focus:ring-cesium outline-none transition-colors"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-md bg-cyber border border-cesium/30 text-white focus:border-cesium focus:ring-1 focus:ring-cesium outline-none transition-colors"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-md bg-cyber border border-cesium/30 text-white focus:border-cesium focus:ring-1 focus:ring-cesium outline-none transition-colors"
                      placeholder="Your company name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-md bg-cyber border border-cesium/30 text-white focus:border-cesium focus:ring-1 focus:ring-cesium outline-none transition-colors"
                      placeholder="How can we help you?"
                      required
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-cesium hover:bg-cesium-dark text-cyber-dark font-medium px-4 py-3 rounded-md transition-colors flex items-center justify-center"
                    >
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </ScrollAnimation>
          
          <div>
            <div className="bg-cyber-dark rounded-lg border border-cesium/20 p-6 md:p-8 my-8">
              <h3 className="text-2xl font-semibold text-white mb-6">Get in touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-cesium/10 rounded-full p-3 mr-4">
                    <Mail className="h-6 w-6 text-cesium" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Email</h4>
                    <p className="text-gray-400">information@cesiumcyber.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-cesium/10 rounded-full p-3 mr-4">
                    <Phone className="h-6 w-6 text-cesium" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Phone</h4>
                    <p className="text-gray-400">(301) 531-5670</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-cesium/10 rounded-full p-3 mr-4">
                    <MapPin className="h-6 w-6 text-cesium" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Office</h4>
                    <p className="text-gray-400">8850 Cedar, Columbia, MD 21045</p>
                  </div>
                </div>
              </div>
            </div>
            
            <ScrollAnimation className="delay-200">
              <div id="consult" className="bg-cyber-dark rounded-lg border border-cesium/20 p-6 md:p-8">
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
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
