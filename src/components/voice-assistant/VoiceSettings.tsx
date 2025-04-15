
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ELEVEN_LABS_VOICES } from "../../utils/voiceUtils";

const VOICE_OPTIONS = [
  { id: ELEVEN_LABS_VOICES.SARAH, name: "Sarah", description: "Professional female voice" },
  { id: ELEVEN_LABS_VOICES.CALLUM, name: "Callum", description: "British male voice" },
  { id: ELEVEN_LABS_VOICES.DANIEL, name: "Daniel", description: "Cybersecurity expert voice" },
];

interface VoiceSettingsProps {
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
}

const VoiceSettings = ({ selectedVoice, setSelectedVoice }: VoiceSettingsProps) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
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
    </>
  );
};

export default VoiceSettings;
