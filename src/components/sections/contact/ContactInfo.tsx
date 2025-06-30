
import { Mail, Phone, MapPin, Instagram } from "lucide-react";

const ContactInfo = () => {
  return (
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
            <p className="text-gray-400">3500 Cedar Ave. Columbia, MD 21045</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-cesium/10 rounded-full p-3 mr-4">
            <Instagram className="h-6 w-6 text-cesium" />
          </div>
          <div>
            <h4 className="text-white font-medium mb-1">Instagram</h4>
            <a 
              href="https://instagram.com/cesiumcyber" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cesium transition-colors"
            >
              @cesiumcyber
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
