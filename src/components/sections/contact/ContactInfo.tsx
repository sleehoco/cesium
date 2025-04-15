
import { Mail, Phone, MapPin } from "lucide-react";

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
            <p className="text-gray-400">8850 Cedar, Columbia, MD 21045</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
