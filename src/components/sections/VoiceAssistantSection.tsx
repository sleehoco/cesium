import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Bot, Volume2, Loader2, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  RadioGroup,
  RadioGroupItem
} from "../ui/radio-group";
import ScrollAnimation from "../utils/ScrollAnimation";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { 
  ELEVEN_LABS_VOICES, 
  generateSpeech, 
  playAudio
} from "../../utils/voiceUtils";

const VOICE_OPTIONS = [
  { id: ELEVEN_LABS_VOICES.SARAH, name: "Sarah", description: "Professional female voice" },
  { id: ELEVEN_LABS_VOICES.CALLUM, name: "Callum", description: "British male voice" },
  { id: ELEVEN_LABS_VOICES.DANIEL, name: "Daniel", description: "Cybersecurity expert voice" },
];

const VoiceAssistantSection = () => {
  const [inputText, setInputText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(ELEVEN_LABS_VOICES.DANIEL);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [responses, setResponses] = useState<{text: string, timestamp: number}[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const initSpeechRecognition = () => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!recognitionRef.current && SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");
        
        setInputText(transcript);
      };
      
      recognitionRef.current.onerror = (event: ErrorEvent) => {
        console.error("Speech recognition error", event);
        setIsListening(false);
        toast.error("Speech recognition error. Please try again.");
      };
    }
  };

  const toggleListening = () => {
    initSpeechRecognition();
    
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        toast.error("Speech recognition is not supported in your browser.");
      }
    }
  };

  const handleSubmit = async () => {
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
      setInputText("");
      
      // Use setTimeout to add a delay, but properly handle async operations inside
      setTimeout(async () => {
        try {
          const audioUrl = await generateSpeech(simulatedResponse.text, selectedVoice);
          await playAudio(audioUrl);
          
          const selectedVoiceName = VOICE_OPTIONS.find(v => v.id === selectedVoice)?.name || "Default";
          toast.success(`Played response with ${selectedVoiceName} voice`);
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
      
      const selectedVoiceName = VOICE_OPTIONS.find(v => v.id === selectedVoice)?.name || "Default";
      toast.success(`Played response with ${selectedVoiceName} voice`);
      
    } catch (error) {
      console.error("Error playing audio:", error);
      toast.error("Failed to generate speech. Please check your API key.");
    }
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 bg-cyber-dark rounded-lg border border-cesium/20 p-6 h-[500px] overflow-y-auto flex flex-col">
            {responses.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Bot className="mx-auto h-16 w-16 text-cesium/50 mb-4" />
                  <p className="text-gray-400">
                    Ask a question to get started. Our AI assistant is ready to help with your cybersecurity needs.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {responses.map((response, index) => (
                  <div key={response.timestamp} className="bg-cyber-light/20 rounded-lg p-4 border-l-2 border-cesium">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Bot className="h-5 w-5 text-cesium mr-2" />
                        <span className="text-cesium font-medium">CesiumCyber AI</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => playElevenLabsResponse(response.text)}
                        className="h-8 w-8 text-gray-400 hover:text-cesium"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-gray-300">{response.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 bg-cyber-dark rounded-lg border border-cesium/20 p-6">
            <ScrollAnimation className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium">Voice Selection</h3>
                <Dialog open={showSettings} onOpenChange={setShowSettings}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-cesium">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-cyber-dark border border-cesium/20 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-cesium">Voice Settings</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-300">
                          All voice settings are now managed securely on the server.
                        </p>
                        <p className="text-xs text-gray-500">
                          Your API key is stored securely in Supabase and never exposed to the client.
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <RadioGroup 
                value={selectedVoice} 
                onValueChange={setSelectedVoice}
                className="grid grid-cols-1 gap-2 mb-6"
              >
                {VOICE_OPTIONS.map((voice) => (
                  <div 
                    key={voice.id}
                    className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer
                      ${selectedVoice === voice.id ? 'border-cesium bg-cesium/10' : 'border-gray-700'}`}
                  >
                    <RadioGroupItem value={voice.id} id={voice.id} className="text-cesium" />
                    <div className="flex flex-col">
                      <label htmlFor={voice.id} className="text-white font-medium cursor-pointer">
                        {voice.name}
                      </label>
                      <span className="text-gray-400 text-sm">{voice.description}</span>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              <div className="mb-6 flex-grow">
                <h3 className="text-white font-medium mb-3">Ask a Question</h3>
                <Textarea 
                  placeholder="Type your cybersecurity question here..." 
                  className="bg-cyber-light/20 border-cesium/30 text-white h-32 resize-none mb-2"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleListening}
                    className={`${isListening ? 'bg-cesium/20 text-cesium border-cesium' : 'bg-cyber-light/20 text-gray-300 border-gray-700'}`}
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  <Button 
                    className="flex-grow bg-cesium hover:bg-cesium/80 text-cyber-dark font-medium"
                    onClick={handleSubmit}
                    disabled={isProcessing || !inputText.trim()}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-xs text-gray-500 border-t border-cesium/10 pt-4">
                <p>
                  Powered by CesiumCyber's advanced LLM with ElevenLabs voice technology. Your conversations are encrypted and not stored beyond your current session.
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantSection;
