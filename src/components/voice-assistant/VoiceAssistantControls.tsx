
import { useVoiceAssistant } from "./VoiceAssistantContext";
import ScrollAnimation from "../utils/ScrollAnimation";
import VoiceSettings from "./VoiceSettings";
import InputSection from "./InputSection";

const VoiceAssistantControls = () => {
  const { 
    selectedVoice, 
    setSelectedVoice, 
    isProcessing, 
    submitQuestion 
  } = useVoiceAssistant();

  return (
    <div className="lg:col-span-2 bg-cyber-dark rounded-lg border border-cesium/20 p-6">
      <ScrollAnimation className="h-full flex flex-col">
        <VoiceSettings 
          selectedVoice={selectedVoice} 
          setSelectedVoice={setSelectedVoice} 
        />
        
        <InputSection 
          onSubmit={submitQuestion}
          isProcessing={isProcessing}
        />

        <div className="text-xs text-gray-500 border-t border-cesium/10 pt-4">
          <p>
            Powered by CesiumCyber's advanced LLM with ElevenLabs voice technology. Your conversations are encrypted and not stored beyond your current session.
          </p>
        </div>
      </ScrollAnimation>
    </div>
  );
};

export default VoiceAssistantControls;
