import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Video, Music, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { VideoInfo, DownloadOption } from "@/types/youtube";

interface DownloadOptionsProps {
  videoInfo: VideoInfo;
  url: string;
  onDownloadStart: (format: string, quality: string) => void;
}

export default function DownloadOptions({ videoInfo, url, onDownloadStart }: DownloadOptionsProps) {
  const { toast } = useToast();

  const downloadMutation = useMutation({
    mutationFn: async ({ format, quality }: { format: string; quality: string }) => {
      const response = await apiRequest("POST", "/api/download", { url, format, quality });
      return response;
    },
    onSuccess: async (response, { format, quality }) => {
      onDownloadStart(format, quality);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Download failed");
      }
      
      // Create blob URL and trigger download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = downloadUrl;
      a.download = `${videoInfo.title.replace(/[^a-z0-9\s]/gi, '_')}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      
      toast({
        title: "Download started",
        description: "Your file is being downloaded.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Download failed",
        description: error.message || "Failed to download the video",
        variant: "destructive",
      });
    },
  });

  const handleDownload = (format: string, quality: string) => {
    downloadMutation.mutate({ format, quality });
  };

  const videoOptions: DownloadOption[] = [
    { format: 'mp4', quality: '1080p', label: 'MP4 - 1080p', description: 'Best quality, larger file size', type: 'video' },
    { format: 'mp4', quality: '720p', label: 'MP4 - 720p', description: 'Good quality, balanced size', type: 'video' },
    { format: 'webm', quality: '720p', label: 'WebM - 720p', description: 'Web optimized format', type: 'video' },
  ];

  const audioOptions: DownloadOption[] = [
    { format: 'mp3', quality: '320', label: 'MP3 - 320kbps', description: 'High quality audio', type: 'audio' },
    { format: 'mp3', quality: '192', label: 'MP3 - 192kbps', description: 'Good quality, smaller size', type: 'audio' },
    { format: 'm4a', quality: '256', label: 'M4A - 256kbps', description: 'Apple compatible format', type: 'audio' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8" data-testid="download-options">
      <h3 className="text-lg font-semibold text-dark mb-6">Download Options</h3>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Video Download Options */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Video className="text-primary" size={20} />
            <h4 className="font-semibold text-dark">Video Formats</h4>
          </div>
          
          <div className="space-y-3">
            {videoOptions.map((option) => (
              <div 
                key={`${option.format}-${option.quality}`}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
                data-testid={`video-option-${option.format}-${option.quality}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{option.label}</span>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                  <Button
                    onClick={() => handleDownload(option.format, option.quality)}
                    disabled={downloadMutation.isPending}
                    className="bg-primary text-white hover:bg-red-600 text-sm"
                    data-testid={`button-download-${option.format}-${option.quality}`}
                  >
                    <Download size={14} className="mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audio Download Options */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Music className="text-secondary" size={20} />
            <h4 className="font-semibold text-dark">Audio Only</h4>
          </div>
          
          <div className="space-y-3">
            {audioOptions.map((option) => (
              <div 
                key={`${option.format}-${option.quality}`}
                className="border border-gray-200 rounded-lg p-4 hover:border-secondary transition-colors"
                data-testid={`audio-option-${option.format}-${option.quality}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{option.label}</span>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                  <Button
                    onClick={() => handleDownload(option.format, option.quality)}
                    disabled={downloadMutation.isPending}
                    className="bg-secondary text-white hover:bg-teal-600 text-sm"
                    data-testid={`button-download-${option.format}-${option.quality}`}
                  >
                    <Download size={14} className="mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
