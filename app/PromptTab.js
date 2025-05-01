import { useState } from "react";
import { Button } from "@/components/button";
import { Textarea } from "@/components/ui/textarea";
import { voiceDesign } from "@/lib/api";
import { ArrowDownToLine } from "lucide-react";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  description: yup
    .string()
    .required()
    .min(20, "Description must be at least 20 characters")
    .max(1000),
  text: yup
    .string()
    .required()
    .min(100, "Text must be at least 100 characters")
    .max(1000),
});

export default function PromptTab({ setRender }) {
  const [audioSources, setAudioSources] = useState([]);
  const [loading, setLoading] = useState(false);

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
  const description = watch("description");

  const handleGeneratePrompt = async () => {
    if (!text || !description) return;
    setLoading(true);
    setAudioSources([]);
    try {
      const audioUrls = await voiceDesign(description, text);
      if (audioUrls) setAudioSources(audioUrls);
      setRender("prompt");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (audioUrl, index) => {
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `voice_preview_${index + 1}.mp3`;
    a.click();
  };

  return (
    <div className="p-6 bg-gray-900 bg-opacity-50 rounded-2xl shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-400">
        Generate Prompt
      </h2>

      <form
        onSubmit={handleSubmit(handleGeneratePrompt)}
        className="flex flex-col gap-6"
      >
        {/* Voice Description */}
        <div className="flex flex-col gap-2">
          <Label className="text-blue-300">Voice Description</Label>
          <Textarea
            placeholder="Enter voice description"
            {...register("description")}
            className="bg-gray-800 border-purple-500 text-white placeholder-gray-400"
            rows={4}
            disabled={loading}
          />
          {errors.description && (
            <p className="text-red-400 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Text Input */}
        <div className="flex flex-col gap-2">
          <Label className="text-blue-300">Text</Label>
          <Textarea
            placeholder="Enter text to say"
            {...register("text")}
            className="bg-gray-800 border-purple-500 text-white placeholder-gray-400"
            rows={6}
            disabled={loading}
          />
          {errors.text && (
            <p className="text-red-400 text-sm">{errors.text.message}</p>
          )}
        </div>

        {/* Generate Button */}
        <Button
          type="submit"
          isLoading={loading}
          disabled={!text || !description}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90"
        >
          {loading ? "Generating..." : "Generate Prompt"}
        </Button>
      </form>

      {/* Audio Previews */}
      {audioSources.length > 0 && (
        <div className="mt-8 space-y-6">
          {audioSources.map((src, index) => (
            <div key={index} className="p-4 bg-gray-800 rounded-lg shadow-md">
              <Label className="text-blue-300">Preview {index + 1}</Label>
              <audio controls className="w-full mt-2">
                <source src={src} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <Button
                onClick={() => handleDownload(src, index)}
                className="mt-4 w-full bg-gradient-to-r from-green-400 to-green-600 hover:opacity-90 flex items-center justify-center gap-2"
              >
                <ArrowDownToLine className="w-5 h-5" /> Download
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
