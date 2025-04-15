
import ScrollAnimation from "../utils/ScrollAnimation";
import { VoiceAssistantProvider } from "../voice-assistant/VoiceAssistantContext";
import VoiceResponsePanel from "../voice-assistant/VoiceResponsePanel";
import VoiceAssistantControls from "../voice-assistant/VoiceAssistantControls";

const VoiceAssistantSection = () => {
  return (
    <div id="voice-assistant" className="bg-cyber py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              CesiumCyber <span className="text-cesium">AI Assistant</span>
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Interact with our advanced AI security assistant using text or voice. Get instant answers about cybersecurity threats, best practices, and how our services can protect your business.
            </p>
          </div>
        </ScrollAnimation>

        <VoiceAssistantProvider>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <VoiceResponsePanel />
            <VoiceAssistantControls />
          </div>
        </VoiceAssistantProvider>
      </div>
    </div>
  );
};

export default VoiceAssistantSection;
