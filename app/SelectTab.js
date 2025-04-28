"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
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

const schema = yup.object({
  description: yup.string().required().min(20).max(1000),
  text: yup.string().required().min(100).max(1000),
});

export default function SelectTab() {
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [voiceId, setVoiceId] = useState(null);
  const [voices, setVoices] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch, formState: { errors },
  } = useForm({resolver: yupResolver(schema),
    defaultValues: {
      description: "",
      text:"",
    },
  });

  const text = watch('text');
  const description = watch('description');

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
      <form onSubmit={handleSubmit(handleGenerate)} className="flex flex-col gap-4">
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
        {...register("text")}
        className="mb-4"
        rows={4}
        disabled={loading}
      />
      <Button
        onClick={handleGenerate}
        isLoading={loading}
        disabled={!text || !voiceId}
      >
        {loading ? "Generating..." : "Generate Speech"}
      </Button>
      </form>
      {errors.text && <p className="text-red-500">{errors.text.message}</p>}

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
