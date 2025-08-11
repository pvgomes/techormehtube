import { Clock, Eye, User } from "lucide-react";
import type { VideoInfo } from "@/types/youtube";

interface VideoPreviewProps {
  videoInfo: VideoInfo;
}

export default function VideoPreview({ videoInfo }: VideoPreviewProps) {
  const formatDuration = (seconds: string) => {
    const totalSeconds = parseInt(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: string) => {
    const viewCount = parseInt(views);
    if (viewCount >= 1000000) {
      return `${(viewCount / 1000000).toFixed(1)}M views`;
    } else if (viewCount >= 1000) {
      return `${(viewCount / 1000).toFixed(1)}K views`;
    }
    return `${viewCount} views`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8" data-testid="video-preview">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <img
            src={videoInfo.thumbnail}
            alt="Video thumbnail"
            className="w-full rounded-lg aspect-video object-cover"
            data-testid="video-thumbnail"
          />
        </div>
        
        <div className="md:w-2/3">
          <h3 className="text-xl font-semibold text-dark mb-2" data-testid="video-title">
            {videoInfo.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3" data-testid="video-description">
            {videoInfo.description}
          </p>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1" data-testid="video-duration">
              <Clock size={14} />
              <span>{formatDuration(videoInfo.duration)}</span>
            </div>
            <div className="flex items-center space-x-1" data-testid="video-views">
              <Eye size={14} />
              <span>{formatViews(videoInfo.views)}</span>
            </div>
            <div className="flex items-center space-x-1" data-testid="video-channel">
              <User size={14} />
              <span>{videoInfo.channel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
