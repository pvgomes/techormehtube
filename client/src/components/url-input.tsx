import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link2, Search, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { VideoInfo } from "@/types/youtube";

interface UrlInputProps {
  onVideoInfo: (info: VideoInfo, url: string) => void;
  isLoading: boolean;
}

export default function UrlInput({ onVideoInfo, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const fetchVideoInfoMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/video-info", { url });
      return response.json();
    },
    onSuccess: (data: VideoInfo) => {
      onVideoInfo(data, url);
      toast({
        title: "Video information loaded",
        description: "You can now select download options below.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch video information",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a YouTube URL",
        variant: "destructive",
      });
      return;
    }

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/;
    if (!youtubeRegex.test(url)) {
      toast({
        title: "Error",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    fetchVideoInfoMutation.mutate(url);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 mb-2">
            YouTube URL
          </label>
          <div className="relative">
            <Input
              type="url"
              id="youtube-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your YouTube URL here... (e.g., https://youtube.com/watch?v=...)"
              className="w-full px-4 py-3 pl-12 text-base"
              data-testid="input-youtube-url"
              disabled={isLoading || fetchVideoInfoMutation.isPending}
            />
            <Link2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
          <p className="text-sm text-gray-500 mt-2 flex items-center">
            <Info size={14} className="mr-1" />
            Maximum video length: 10 minutes
          </p>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-red-600 text-white font-semibold py-3 px-6"
          disabled={isLoading || fetchVideoInfoMutation.isPending}
          data-testid="button-fetch-info"
        >
          {fetchVideoInfoMutation.isPending ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Loading...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Search size={16} />
              <span>Get Video Info</span>
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}
