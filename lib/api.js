import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

// Function to generate voice from text
async function getVoices() {
  try {
    const response = await axios.get(`https://api.elevenlabs.io/v1/voices`, {
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error generating speech:", error);
    throw error; // Propagate error
  }
}

// Function to generate voice from text
async function generateVoice(text, id) {
  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${id}`,
      {
        text,
        model_id: "eleven_multilingual_v1",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": API_KEY,
        },
        responseType: "arraybuffer",
      }
    );
    const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error("Error generating speech:", error);
    throw error;
  }
}

async function voiceDesign(description, text) {
  try {
    const body = {
      voice_description: description,
      text,
    };

    const response = await axios.post(
      "https://api.elevenlabs.io/v1/text-to-voice/create-previews",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": API_KEY,
        },
      }
    );
    const audioUrls = response.data.previews.map((preview) =>
      base64ToBlobUrl(preview.audio_base_64, "audio/mpeg")
    );

    return audioUrls;
  } catch (error) {
    console.error("Error generating voice:", error);
    throw error;
  }
}

function base64ToBlobUrl(base64, mimeType) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const audioBlob = new Blob([byteArray], { type: mimeType });
  return URL.createObjectURL(audioBlob);
}

export { getVoices, generateVoice, voiceDesign };
