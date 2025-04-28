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

export default function PromptTab() {
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
      <form
        onSubmit={handleSubmit(handleGeneratePrompt)}
        className="flex flex-col gap-4"
      >
        <Textarea
          type="text"
          placeholder="Enter voice description"
          {...register("description")}
          className="my-4"
          disabled={loading}
        />
        {errors.description && (
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
            <p className="text-sm font-semibold">
              {errors.description.message}
            </p>
          </div>
        )}
        <Textarea
          type="text"
          placeholder="Enter text to say"
          {...register("text")}
          className="my-4"
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
          disabled={!text || !description}
          className="w-[150px]"
        >
          {loading ? "Generating..." : "Generate Prompt"}
        </Button>
      </form>

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
