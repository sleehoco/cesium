
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
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
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-medium">Voice Selection</h3>
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
