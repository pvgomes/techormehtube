import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

interface DownloadProgressProps {
  format: string;
  quality: string;
  onComplete: () => void;
}

export default function DownloadProgress({ format, quality, onComplete }: DownloadProgressProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Preparing download...");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("Download complete!");
          setTimeout(onComplete, 1000);
          return 100;
        }
        
        const increment = Math.random() * 15 + 5;
        const newProgress = Math.min(prev + increment, 100);
        
        if (newProgress < 30) {
          setStatus("Fetching video data...");
        } else if (newProgress < 60) {
          setStatus("Processing video...");
        } else if (newProgress < 90) {
          setStatus("Preparing download...");
        } else {
          setStatus("Finalizing...");
        }
        
        return newProgress;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8" data-testid="download-progress">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-dark">Downloading...</h3>
        <span className="text-sm text-gray-500" data-testid="download-format">
          {format.toUpperCase()} - {quality}
        </span>
      </div>
      
      <div className="mb-4">
        <Progress value={progress} className="w-full h-3" data-testid="progress-bar" />
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span data-testid="progress-percentage">{Math.round(progress)}% Complete</span>
          <span data-testid="progress-status">{status}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-center space-x-2 text-gray-600">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <span className="text-sm">Processing your download...</span>
      </div>
    </div>
  );
}
