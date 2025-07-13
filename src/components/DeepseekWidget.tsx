
import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

const DeepseekWidget = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    
    try {
      // This component has been secured - no more client-side API key storage
      toast.error("This feature requires secure server-side implementation. Please contact support.");
      
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-cyber-dark rounded-lg border border-cesium/20 p-6 md:p-8">
      <h3 className="text-2xl font-semibold text-white mb-4">Deepseek R1 AI</h3>
      <p className="text-gray-400 mb-6">
        Ask a question to the Deepseek R1 large language model and get an instant response.
      </p>
      
      <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-md">
        <p className="text-yellow-400 text-sm">
          <strong>Security Notice:</strong> This component has been disabled as it was storing API keys in the browser, 
          which is a security vulnerability. All API calls should be made through secure server-side endpoints.
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-1">
            Your Prompt
          </label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-cyber border border-cesium/30 text-white focus:border-cesium focus:ring-1 focus:ring-cesium outline-none transition-colors"
            placeholder="Enter your question or prompt here..."
            rows={4}
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-gray-600 text-gray-300 font-medium px-4 py-3 rounded-md transition-colors flex items-center justify-center"
          disabled={true}
        >
          Feature Disabled for Security
        </Button>
      </form>
      
      {response && (
        <div className="mt-6">
          <h4 className="text-lg font-medium text-white mb-2">Response:</h4>
          <div className="bg-cyber p-4 rounded border border-cesium/20 text-gray-300 whitespace-pre-wrap">
            {response}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeepseekWidget;
