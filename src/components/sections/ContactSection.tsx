
import ContactForm from "./contact/ContactForm";
import ContactInfo from "./contact/ContactInfo";
import ConsultationBooking from "./contact/ConsultationBooking";

const ContactSection = () => {
  return (
    <section id="contact" className="bg-[#0A0A0A] py-24 border-t border-[#D4AF37]/10" aria-labelledby="contact-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="flex items-center gap-4 mb-14">
          <div className="h-px flex-1 max-w-xs bg-[#D4AF37]/15" />
          <span className="font-tech text-[10px] tracking-[0.16em] text-white/35">CONTACT CESIUMCYBER</span>
          <div className="h-px flex-1 max-w-xs bg-[#D4AF37]/15" />
        </div>

        <div className="mb-10">
          <h2 id="contact-heading" className="font-display text-4xl md:text-5xl font-bold text-white tracking-[-0.03em] mb-3 leading-tight">
            Talk to a cybersecurity
            <br />
            <span className="text-[#D4AF37]">consultant.</span>
          </h2>
          <p className="font-ui text-[18px] text-white/78 max-w-2xl leading-8 mt-2">
            Tell us what you are worried about, what tools your business runs on, and whether you need an assessment, monitoring, or incident help. We respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ContactForm />
          <div className="space-y-6">
            <ContactInfo />
            <ConsultationBooking />
          </div>
        </div>

      </div>
    </section>
  );
};

export default ContactSection;
