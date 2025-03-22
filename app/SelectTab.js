"use client";

import { useEffect, useState } from "react";
import { generateVoice, getVoices } from "@/lib/api";
import { Button } from "@/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowDownToLine } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function SelectTab() {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [voiceId, setVoiceId] = useState(null);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    async function Get() {
      const { voices: data } = await getVoices();
      console.log(data);
      setVoices(data.map(({ voice_id, name }) => ({ id: voice_id, name })));
    }

    Get();
  }, []);

  const handleGenerate = async () => {
    if (!text) return;
    setLoading(true);
    setAudioUrl(null);
    try {
      const audioUrl = await generateVoice(text, voiceId);
      if (audioUrl) setAudioUrl(audioUrl);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleDownload = (audioUrl) => {
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `voice_preview.mp3`; // Set the file name
    a.click();
  };
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Generate Speech</h2>
      <div className="mb-4">
        <Select onValueChange={setVoiceId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a voice" />
          </SelectTrigger>
          <SelectContent>
            {voices.map((item, key) => (
              <SelectItem key={key} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Textarea
        placeholder="Enter text to say"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="mb-4"
        rows={4}
        disabled={loading} // Disable input if a voice is uploaded
      />
      <Button
        onClick={handleGenerate}
        isLoading={loading}
        disabled={!text || !voiceId}
      >
        {loading ? "Generating..." : "Generate Speech"}
      </Button>

      {audioUrl && (
        <div className="mt-4 flex gap-5 justify-center">
          <div>
            <Label>Preview</Label>
            <audio controls>
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Button
              onClick={() => handleDownload(audioUrl)}
              className="text-sm"
            >
              <ArrowDownToLine />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
