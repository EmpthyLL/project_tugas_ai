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
    .required("Text is required")
    .min(100, "Text must be at least 100 characters")
    .max(1000, "Text can not exceeding 1000 characters"),
});

export default function SelectTab({ setRender }) {
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
      setVoices(data.map(({ voice_id, name }) => ({ id: voice_id, name })));
    }
    Get();
  }, []);

  const handleGenerate = async () => {
    if (!text) return;
    setRender(null);
    setLoading(true);
    setAudioUrl(null);
    try {
      const audioUrl = await generateVoice(text, voiceId);
      if (audioUrl) setAudioUrl(audioUrl);
      setRender("select");
      toast.success("Voice generated!");
    } catch (error) {
      toast.error(error.responce.data.detail.message || error.message);
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
    <div className="p-6 bg-gray-800 bg-opacity-50 rounded-2xl shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">
        Generate Speech
      </h2>
      <form
        onSubmit={handleSubmit(handleGenerate)}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <Label className="text-blue-300">Select Voice</Label>
          <Select onValueChange={setVoiceId}>
            <SelectTrigger className="w-full bg-gray-800 border-blue-500 text-white">
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white">
              {voices.map((item, key) => (
                <SelectItem key={key} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-blue-300">Text</Label>
          <Textarea
            placeholder="Enter text to say"
            {...register("text")}
            className="bg-gray-800 border-blue-500 text-white placeholder-gray-400"
            rows={6}
            disabled={loading}
          />
          {errors.text && (
            <p className="text-red-400 text-sm">{errors.text.message}</p>
          )}
        </div>

        <Button
          type="submit"
          isLoading={loading}
          disabled={!text || !voiceId}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
        >
          {loading ? "Generating..." : "Generate Speech"}
        </Button>
      </form>

      {audioUrl && (
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="w-full">
            <Label className="text-blue-300">Preview</Label>
            <audio controls className="w-full mt-2">
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
          <Button
            onClick={() => handleDownload(audioUrl)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-600 hover:opacity-90"
          >
            <ArrowDownToLine className="w-5 h-5" /> Download
          </Button>
        </div>
      )}
    </div>
  );
}
