import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface YouTubeInputProps {
  onSubmit: (url: string, language: string) => void;
  isLoading: boolean;
}

export function YouTubeInput({ onSubmit, isLoading }: YouTubeInputProps) {
  const [url, setUrl] = useState("");
  const [videoLanguage, setVideoLanguage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      toast.error("Please enter a valid YouTube URL");
      return;
    }
    if (!videoLanguage) {
      toast.error("Please select the video language");
      return;
    }
    onSubmit(url, videoLanguage);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-2xl gap-4">
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="Paste YouTube video URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Select value={videoLanguage} onValueChange={setVideoLanguage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Video Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="te">Telugu</SelectItem>
            <SelectItem value="hi">Hindi</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <span className="loading-dots">Summarizing</span>
        ) : (
          "Summarize"
        )}
      </Button>
    </form>
  );
}