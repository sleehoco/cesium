
const ContactInfo = () => {
  return (
    <div className="border border-[#D4AF37]/15">
      {/* Header */}
      <div className="bg-[#D4AF37]/5 border-b border-[#D4AF37]/15 px-5 py-3 flex justify-between items-center">
        <span className="font-tech text-[10px] tracking-[0.16em] text-[#D4AF37]/70">CONTACT DETAILS</span>
        <span className="font-tech text-[9px] tracking-[0.12em] text-white/30">CESIUMCYBER</span>
      </div>

      {[
        { label: "EMAIL", value: "information@cesiumcyber.com", href: "mailto:information@cesiumcyber.com" },
        { label: "PHONE", value: "(301) 531-5670", href: "tel:3015315670" },
        { label: "LOCATION", value: "3500 Cedar Ave. Columbia, MD 21045", href: null },
        { label: "SERVICE AREA", value: "Maryland and nationwide remote support", href: null },
        { label: "INSTAGRAM", value: "@cesiumcyber", href: "https://instagram.com/cesiumcyber" },
      ].map((item, i) => (
        <div
          key={item.label}
          className={`flex items-start gap-4 px-5 py-4 border-b border-[#D4AF37]/08 ${
            i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.015]'
          }`}
        >
          <span className="font-ui text-[14px] text-white/55 w-28 shrink-0 pt-px">{item.label}</span>
          {item.href ? (
            <a
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="font-ui text-[16px] text-white/82 hover:text-[#D4AF37] transition-colors leading-7"
            >
              {item.value}
            </a>
          ) : (
            <span className="font-ui text-[16px] text-white/82 leading-7">{item.value}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContactInfo;
