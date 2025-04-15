
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

interface InputSectionProps {
  onSubmit: (text: string) => void;
  isProcessing: boolean;
}

const InputSection = ({ onSubmit, isProcessing }: InputSectionProps) => {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
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

  const handleSubmit = () => {
    if (!inputText.trim()) return;
    onSubmit(inputText);
    setInputText("");
  };

  return (
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
  );
};

export default InputSection;
