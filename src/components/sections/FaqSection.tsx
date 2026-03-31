import { Helmet } from "react-helmet";

const faqs = [
  {
    question: "What cybersecurity services do small businesses usually need first?",
    answer:
      "Most small businesses start with email security, endpoint protection, backup review, Microsoft 365 hardening, and a vulnerability assessment. That covers the most common attack paths without forcing you into an enterprise-sized project.",
  },
  {
    question: "Do I need an in-house IT team to work with CesiumCyber?",
    answer:
      "No. We work directly with owners, office managers, and internal IT staff when they exist. The process is designed to be understandable for non-technical teams.",
  },
  {
    question: "How quickly can you help if we think we've been hacked?",
    answer:
      "For active incidents, the team offers same-day response and helps with containment, investigation, and recovery so you can reduce downtime and business impact.",
  },
  {
    question: "Do you only serve Maryland businesses?",
    answer:
      "CesiumCyber is based in Columbia, Maryland and works with small businesses locally and across the United States. Local businesses can schedule direct consultations, and remote engagements are available nationwide.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map((faq) => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer,
    },
  })),
};

const FaqSection = () => {
  return (
    <section id="faq" className="bg-[#0D0D0D] py-24 border-t border-[#D4AF37]/10" aria-labelledby="faq-heading">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-3 mb-8">
          <div className="h-px w-8 bg-[#D4AF37]" />
          <span className="font-tech text-[10px] tracking-[0.18em] text-white/55 uppercase">Small business FAQ</span>
        </div>

        <div className="max-w-3xl mb-12">
          <h2 id="faq-heading" className="font-display text-4xl md:text-5xl font-bold text-white tracking-[-0.03em] mb-4 leading-tight">
            Common questions,
            <br />
            <span className="text-[#D4AF37]">clear answers.</span>
          </h2>
          <p className="font-ui text-[18px] text-white/78 leading-8">
            These are the questions small business owners usually ask before they hire a cybersecurity partner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#D4AF37]/10">
          {faqs.map((faq) => (
            <article key={faq.question} className="bg-[#0A0A0A] p-8 border border-transparent hover:bg-[#0F0F0F] transition-colors">
              <h3 className="font-display text-[26px] font-bold text-white mb-4 leading-tight">{faq.question}</h3>
              <p className="font-ui text-[16px] text-white/78 leading-8">{faq.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
