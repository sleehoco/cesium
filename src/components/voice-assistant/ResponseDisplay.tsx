
import { Volume2, Bot, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface ResponseDisplayProps {
  responses: { text: string; timestamp: number }[];
  onPlayResponse: (text: string) => void;
  isGeneratingSpeech?: boolean;
  currentPlayingResponseId?: number | null;
}

const ResponseDisplay = ({ 
  responses, 
  onPlayResponse, 
  isGeneratingSpeech = false,
  currentPlayingResponseId = null 
}: ResponseDisplayProps) => {
  if (responses.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Bot className="mx-auto h-16 w-16 text-cesium/50 mb-4" />
          <p className="text-gray-400">
            Ask a question to get started. Our AI assistant is ready to help with your cybersecurity needs.
          </p>
        </div>
      </div>
    );
  }

  return (
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
              onClick={() => onPlayResponse(response.text)}
              className="h-8 w-8 text-gray-400 hover:text-cesium"
              disabled={isGeneratingSpeech}
            >
              {isGeneratingSpeech && currentPlayingResponseId === response.timestamp ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-gray-300">{response.text}</p>
        </div>
      ))}
    </div>
  );
};

export default ResponseDisplay;
