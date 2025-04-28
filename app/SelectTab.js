"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
  text: yup
    .string()
    .required()
    .min(100, "Text must be at least 100 characters")
    .max(1000),
});

export default function SelectTab() {
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [voiceId, setVoiceId] = useState(null);
  const [voices, setVoices] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      description: "",
      text: "",
    },
  });

  const text = watch("text");

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
    a.download = `voice_preview.mp3`;
    a.click();
  };
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Generate Speech</h2>
      <form
        onSubmit={handleSubmit(handleGenerate)}
        className="flex flex-col gap-4"
      >
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
        {errors.text && (
          <div className="flex items-center gap-2 bg-red-500 border text-white px-4 py-3 rounded-md animate-fade-in">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11V7a1 1 0 00-2 0v4a1 1 0 002 0zm0 6a1 1 0 10-2 0 1 1 0 002 0z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm font-semibold">{errors.text.message}</p>
          </div>
        )}

        <Button
          type="submit"
          isLoading={loading}
          disabled={!text || !voiceId}
          className="w-[150px]"
        >
          {loading ? "Generating..." : "Generate Speech"}
        </Button>
      </form>

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
