
import { createContext, useState, useContext, ReactNode } from "react";
import { generateSpeech, playAudio, ELEVEN_LABS_VOICES } from "../../utils/voiceUtils";
import { toast } from "sonner";

interface VoiceAssistantContextProps {
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  responses: {text: string, timestamp: number}[];
  isProcessing: boolean;
  submitQuestion: (text: string) => Promise<void>;
  playElevenLabsResponse: (text: string) => Promise<void>;
}

const VoiceAssistantContext = createContext<VoiceAssistantContextProps | undefined>(undefined);

export const VoiceAssistantProvider = ({ children }: { children: ReactNode }) => {
  const [selectedVoice, setSelectedVoice] = useState(ELEVEN_LABS_VOICES.DANIEL);
  const [isProcessing, setIsProcessing] = useState(false);
  const [responses, setResponses] = useState<{text: string, timestamp: number}[]>([]);

  const submitQuestion = async (inputText: string) => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // Create the simulated response object
      const simulatedResponse = {
        text: `Here's information about ${inputText}. CesiumCyber provides advanced protection against the latest threats using our proprietary detection systems.`,
        timestamp: Date.now()
      };
      
      // Update the UI state first
      setResponses(prev => [...prev, simulatedResponse]);
      
      // Use setTimeout to add a delay, but properly handle async operations inside
      setTimeout(async () => {
        try {
          const audioUrl = await generateSpeech(simulatedResponse.text, selectedVoice);
          await playAudio(audioUrl);
          
          const voiceName = getVoiceName(selectedVoice);
          toast.success(`Played response with ${voiceName} voice`);
        } catch (error) {
          console.error("Error playing audio:", error);
          toast.error("Failed to generate speech. Please check your API key.");
        } finally {
          setIsProcessing(false);
        }
      }, 1500);
    } catch (error) {
      console.error("Error processing request:", error);
      toast.error("Failed to process your request. Please try again.");
      setIsProcessing(false);
    }
  };

  const playElevenLabsResponse = async (text: string) => {
    try {
      const audioUrl = await generateSpeech(text, selectedVoice);
      await playAudio(audioUrl);
      
      const voiceName = getVoiceName(selectedVoice);
      toast.success(`Played response with ${voiceName} voice`);
      
    } catch (error) {
      console.error("Error playing audio:", error);
      toast.error("Failed to generate speech. Please check your API key.");
    }
  };

  const getVoiceName = (voiceId: string): string => {
    const VOICE_OPTIONS = [
      { id: ELEVEN_LABS_VOICES.SARAH, name: "Sarah" },
      { id: ELEVEN_LABS_VOICES.CALLUM, name: "Callum" },
      { id: ELEVEN_LABS_VOICES.DANIEL, name: "Daniel" },
    ];
    return VOICE_OPTIONS.find(v => v.id === voiceId)?.name || "Default";
  };

  return (
    <VoiceAssistantContext.Provider 
      value={{
        selectedVoice,
        setSelectedVoice,
        responses,
        isProcessing,
        submitQuestion,
        playElevenLabsResponse
      }}
    >
      {children}
    </VoiceAssistantContext.Provider>
  );
};

export const useVoiceAssistant = () => {
  const context = useContext(VoiceAssistantContext);
  if (!context) {
    throw new Error("useVoiceAssistant must be used within a VoiceAssistantProvider");
  }
  return context;
};
