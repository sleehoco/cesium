
import { createContext, useState, useContext, ReactNode } from "react";
import { generateSpeech, playAudio, ELEVEN_LABS_VOICES } from "../../utils/voiceUtils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface VoiceAssistantContextProps {
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  responses: {text: string, timestamp: number}[];
  isProcessing: boolean;
  isGeneratingSpeech: boolean;
  currentPlayingResponseId: number | null;
  submitQuestion: (text: string) => Promise<void>;
  playElevenLabsResponse: (text: string) => Promise<void>;
}

const VoiceAssistantContext = createContext<VoiceAssistantContextProps | undefined>(undefined);

export const VoiceAssistantProvider = ({ children }: { children: ReactNode }) => {
  const [selectedVoice, setSelectedVoice] = useState(ELEVEN_LABS_VOICES.DANIEL);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
  const [currentPlayingResponseId, setCurrentPlayingResponseId] = useState<number | null>(null);
  const [responses, setResponses] = useState<{text: string, timestamp: number}[]>([]);

  const submitQuestion = async (inputText: string) => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // Call the Supabase Edge Function to get response from LLM
      const { data, error } = await supabase.functions.invoke('llm-response', {
        body: { question: inputText }
      });

      if (error) {
        console.error("Error calling llm-response function:", error);
        toast.error(`Failed to get AI response: ${error.message}`);
        setIsProcessing(false);
        return;
      }

      if (!data || !data.response) {
        console.error("No response data received from LLM");
        toast.error("Failed to get AI response");
        setIsProcessing(false);
        return;
      }
      
      // Create the response object with LLM-generated text
      const aiResponse = {
        text: data.response,
        timestamp: Date.now()
      };
      
      // Update the UI state with the response
      setResponses(prev => [...prev, aiResponse]);
      
      // Generate and play speech for the AI response
      try {
        setIsGeneratingSpeech(true);
        const audioUrl = await generateSpeech(aiResponse.text, selectedVoice);
        await playAudio(audioUrl);
        
        const voiceName = getVoiceName(selectedVoice);
        toast.success(`Played response with ${voiceName} voice`);
      } catch (speechError) {
        console.error("Error playing audio:", speechError);
        toast.error("Failed to generate speech. Please check your API key.");
      } finally {
        setIsGeneratingSpeech(false);
      }
    } catch (error) {
      console.error("Error processing request:", error);
      toast.error("Failed to process your request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const playElevenLabsResponse = async (text: string) => {
    try {
      // Find the response with the matching text to get its timestamp
      const responseToPlay = responses.find(r => r.text === text);
      if (responseToPlay) {
        setCurrentPlayingResponseId(responseToPlay.timestamp);
      }
      
      setIsGeneratingSpeech(true);
      const audioUrl = await generateSpeech(text, selectedVoice);
      await playAudio(audioUrl);
      
      const voiceName = getVoiceName(selectedVoice);
      toast.success(`Played response with ${voiceName} voice`);
      
    } catch (error) {
      console.error("Error playing audio:", error);
      toast.error("Failed to generate speech. Please check your API key.");
    } finally {
      setIsGeneratingSpeech(false);
      setCurrentPlayingResponseId(null);
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
        isGeneratingSpeech,
        currentPlayingResponseId,
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
