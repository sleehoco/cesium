
import { Bot } from "lucide-react";
import { useVoiceAssistant } from "./VoiceAssistantContext";
import ResponseDisplay from "./ResponseDisplay";

const VoiceResponsePanel = () => {
  const { responses, playElevenLabsResponse } = useVoiceAssistant();

  return (
    <div className="lg:col-span-3 bg-cyber-dark rounded-lg border border-cesium/20 p-6 h-[500px] overflow-y-auto flex flex-col">
      <ResponseDisplay 
        responses={responses} 
        onPlayResponse={playElevenLabsResponse} 
      />
    </div>
  );
};

export default VoiceResponsePanel;
