import { useState } from "react";
import { Button } from "@/components/button";
import { Textarea } from "@/components/ui/textarea";
import { voiceDesign } from "@/lib/api";
import { ArrowDownToLine } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function PromptTab() {
  const [description, setDescription] = useState("");
  const [text, setText] = useState("");
  const [audioSources, setAudioSources] = useState([]);
  const [loading, setLoading] = useState(false);

  // Generate the voice and get audio URLs
  const handleGeneratePrompt = async () => {
    if (!text || !description) return;
    setLoading(true);
    setAudioSources([]); // Clear previous audio sources
    try {
      const audioUrls = await voiceDesign(description, text);
      if (audioUrls) setAudioSources(audioUrls); // Set the new audio sources
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Reset the form and audio sources
  const handleReset = () => {
    setDescription("");
    setText("");
    setAudioSources([]);
  };

  // Download the audio file
  const handleDownload = (audioUrl, index) => {
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `voice_preview_${index + 1}.mp3`; // Set the file name
    a.click();
  };

  return (
    <div className="my-4">
      <h2 className="text-xl font-semibold mb-4">Generate Prompt</h2>
      <Textarea
        type="text"
        placeholder="Enter voice description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="my-4"
        disabled={loading}
      />
      <Textarea
        type="text"
        placeholder="Enter text to say"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="my-4"
        rows={4}
        disabled={loading}
      />
      <Button
        onClick={handleGeneratePrompt}
        isLoading={loading}
        disabled={!text || !description}
      >
        {loading ? "Generating..." : "Generate Prompt"}
      </Button>

      {/* Render audio previews */}
      {audioSources &&
        audioSources.map((src, index) => (
          <div key={index} className="mt-4 flex gap-5 justify-center">
            <div>
              <Label>Preview {index + 1}</Label>
              <audio controls>
                <source src={src} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Button
                onClick={() => handleDownload(src, index)}
                className="text-sm"
              >
                <ArrowDownToLine />
              </Button>
            </div>
          </div>
        ))}
    </div>
  );
}
