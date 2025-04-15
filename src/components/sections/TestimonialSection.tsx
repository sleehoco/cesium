
import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote: "CesiumCyber Security transformed our approach to cybersecurity. Their vulnerability assessment uncovered critical issues we weren't aware of, and their remediation plan was clear and effective.",
    author: "Sarah Johnson",
    title: "CTO, TechFront Solutions",
    rating: 5,
  },
  {
    id: 2,
    quote: "The team at CesiumCyber provided exceptional penetration testing services. They identified vulnerabilities that our previous security provider missed completely.",
    author: "Michael Chen",
    title: "IT Director, Global Finance Corp",
    rating: 5,
  },
  {
    id: 3,
    quote: "Working with CesiumCyber has been a game-changer for our security posture. Their ongoing support and proactive approach to threat detection gives us peace of mind.",
    author: "David Rodriguez",
    title: "CISO, HealthTech Innovations",
    rating: 5,
  },
];

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="bg-cyber-dark py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Client <span className="text-cesium">Testimonials</span>
          </h2>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            What our clients say about our cybersecurity services
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-cyber rounded-lg border border-cesium/20 p-8 md:p-10 relative">
            {/* Quote icon */}
            <Quote className="absolute top-6 left-6 h-8 w-8 text-cesium/20" />
            
            {/* Testimonial content */}
            <div className="text-center px-4">
              <p className="text-lg md:text-xl text-gray-300 italic mb-8">
                "{currentTestimonial.quote}"
              </p>
              
              <div className="flex flex-col items-center">
                {/* Rating stars */}
                <div className="flex space-x-1 mb-4">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-cesium" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <div>
                  <p className="font-semibold text-white text-lg">{currentTestimonial.author}</p>
                  <p className="text-cesium">{currentTestimonial.title}</p>
                </div>
              </div>
            </div>
            
            {/* Navigation buttons */}
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
              <button 
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-cyber-dark border border-cesium/30 text-cesium hover:bg-cesium/10 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
            
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
              <button 
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-cyber-dark border border-cesium/30 text-cesium hover:bg-cesium/10 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            
            {/* Dots indicators */}
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-2 rounded-full ${
                    index === currentIndex ? 'bg-cesium' : 'bg-cesium/30'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
