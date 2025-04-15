
/**
 * Voice utility functions for the CesiumCyber application
 */

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

// Get API key from secure storage
export const getApiKey = (): string => {
  return sessionStorage.getItem('elevenLabsApiKey') || '';
};

// Securely save API key to session storage (more secure than localStorage)
export const saveApiKey = (apiKey: string): void => {
  sessionStorage.setItem('elevenLabsApiKey', apiKey);
};

// Clear API key from session storage
export const clearApiKey = (): void => {
  sessionStorage.removeItem('elevenLabsApiKey');
};

/**
 * Generate speech using ElevenLabs API
 * @param text Text to convert to speech
 * @param voiceId ElevenLabs voice ID
 * @param apiKey ElevenLabs API key
 * @returns Promise with audio URL
 */
export const generateSpeech = async (
  text: string,
  voiceId: string,
  apiKey: string
): Promise<string> => {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: ELEVEN_LABS_MODELS.MONOLINGUAL_V1,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBlob = await response.blob();
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
