
/**
 * Voice utility functions for the CesiumCyber application
 */

import { supabase } from "@/integrations/supabase/client";

// ElevenLabs voice IDs for reference
export const ELEVEN_LABS_VOICES = {
  // Premium voices
  SARAH: "EXAVITQu4vr4xnSDxMaL",    // Professional female
  CALLUM: "N2lVS1w4EtoT3dr4eOWO",    // British male 
  DANIEL: "onwK4e9ZLuTAKqWW03F9",    // Authoritative male
  ARIA: "9BWtsMINqrJLrRacOk9x",      // Clear female
  ROGER: "CwhRBWXzGAHq8TQ4Fs17",     // Narrator male
  LAURA: "FGY2WhTYpPnrIDTdsKH5",     // Conversational female
  CHARLIE: "IKne3meq5aSn9XLyUdCD",    // Friendly male
};

// ElevenLabs models
export const ELEVEN_LABS_MODELS = {
  MONOLINGUAL_V1: "eleven_monolingual_v1",
  MULTILINGUAL_V1: "eleven_multilingual_v1",
  MULTILINGUAL_V2: "eleven_multilingual_v2",
  TURBO_V2: "eleven_turbo_v2",
};

// Get API key from secure storage - Legacy method, kept for backward compatibility
export const getApiKey = (): string => {
  const storedKey = sessionStorage.getItem('elevenLabsApiKey') || '';
  
  // Optional: Add runtime validation if needed
  return storedKey.startsWith('sk_') ? storedKey : '';
};

// Securely save API key to session storage - Legacy method, kept for backward compatibility
export const saveApiKey = (apiKey: string): boolean => {
  // Basic API key format validation (ElevenLabs typically starts with 'sk_')
  const isValidKey = apiKey.startsWith('sk_') && apiKey.length > 10;
  
  if (isValidKey) {
    sessionStorage.setItem('elevenLabsApiKey', apiKey);
    return true;
  }
  
  return false;
};

// Clear API key from session storage - Legacy method, kept for backward compatibility
export const clearApiKey = (): void => {
  sessionStorage.removeItem('elevenLabsApiKey');
};

/**
 * Generate speech using ElevenLabs API through Supabase Edge Function
 * @param text Text to convert to speech
 * @param voiceId ElevenLabs voice ID
 * @returns Promise with audio URL
 */
export const generateSpeech = async (
  text: string,
  voiceId: string,
): Promise<string> => {
  try {
    // Call the secure Supabase Edge Function instead of directly calling ElevenLabs
    const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
      body: {
        text,
        voiceId,
        model: ELEVEN_LABS_MODELS.MONOLINGUAL_V1,
      },
    });

    if (error) {
      console.error("Error calling elevenlabs-tts function:", error);
      throw new Error(`Failed to generate speech: ${error.message}`);
    }

    // Create a Blob from the returned audio data
    const base64Data = data.audio;
    const binaryString = window.atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error("Error generating speech:", error);
    throw error;
  }
};

/**
 * Play audio from URL and clean up after playback
 * @param audioUrl URL of audio to play
 * @returns Promise that resolves when audio playback ends
 */
export const playAudio = (audioUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio(audioUrl);
    
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      resolve();
    };
    
    audio.onerror = (error) => {
      URL.revokeObjectURL(audioUrl);
      reject(error);
    };
    
    audio.play().catch(reject);
  });
};
