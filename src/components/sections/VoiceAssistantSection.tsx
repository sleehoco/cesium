
import { useState, useRef } from "react";
import { Mic, MicOff, Send, Bot, Volume2, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  RadioGroup,
  RadioGroupItem
} from "../ui/radio-group";
import ScrollAnimation from "../utils/ScrollAnimation";
import { toast } from "../ui/sonner";

// Voice options
const VOICE_OPTIONS = [
  { id: "alice", name: "Alice", description: "Professional female voice" },
  { id: "brian", name: "Brian", description: "Authoritative male voice" },
  { id: "cesium", name: "Cesium", description: "Our custom cybersecurity expert voice" },
];

const VoiceAssistantSection = () => {
  const [inputText, setInputText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("cesium");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [responses, setResponses] = useState<{text: string, timestamp: number}[]>([]);
  
  // Refs for speech recognition and audio
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize speech recognition (with proper type checking)
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

  // Toggle speech recognition
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

  // Submit query to LLM and get voice response
  const handleSubmit = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would call your LLM API
      // For demo purposes, we'll simulate a response
      setTimeout(() => {
        const simulatedResponse = {
          text: `Here's information about ${inputText}. CesiumCyber provides advanced protection against the latest threats using our proprietary detection systems. Our security analysts monitor your infrastructure 24/7 to ensure continuous protection.`,
          timestamp: Date.now()
        };
        
        setResponses(prev => [...prev, simulatedResponse]);
        setInputText("");
        setIsProcessing(false);
        
        // Simulate voice playback
        playAudioResponse(simulatedResponse.text);
      }, 1500);
    } catch (error) {
      console.error("Error processing request:", error);
      toast.error("Failed to process your request. Please try again.");
      setIsProcessing(false);
    }
  };

  // Play audio response (mock implementation)
  const playAudioResponse = (text: string) => {
    // In a real implementation, this would use a TTS API with your custom voice
    // For demo purposes, we'll use the browser's built-in speech synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      // Attempt to find a voice that matches the selected option
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => 
        v.name.toLowerCase().includes(selectedVoice === "cesium" ? "en-us" : selectedVoice)
      );
      
      if (voice) {
        utterance.voice = voice;
      }
      
      window.speechSynthesis.speak(utterance);
      
      toast.success(`Playing response with ${VOICE_OPTIONS.find(v => v.id === selectedVoice)?.name} voice`);
    } else {
      toast.error("Text-to-speech is not supported in your browser");
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
          {/* Chat history panel */}
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
                        onClick={() => playAudioResponse(response.text)}
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

          {/* Input and controls panel */}
          <div className="lg:col-span-2 bg-cyber-dark rounded-lg border border-cesium/20 p-6">
            <ScrollAnimation className="h-full flex flex-col">
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3">Voice Selection</h3>
                <RadioGroup 
                  value={selectedVoice} 
                  onValueChange={setSelectedVoice}
                  className="grid grid-cols-1 gap-2"
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
              </div>

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
                  Powered by CesiumCyber's advanced LLM with custom Sesame voice technology. Your conversations are encrypted and not stored beyond your current session.
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
