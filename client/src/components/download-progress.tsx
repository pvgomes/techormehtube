import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Download, CheckCircle, Clock, Zap } from "lucide-react";

interface DownloadProgressProps {
  format: string;
  quality: string;
  onComplete: () => void;
}

export default function DownloadProgress({ format, quality, onComplete }: DownloadProgressProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing...");
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    { icon: Clock, text: "Fetching video information...", color: "text-blue-500" },
    { icon: Zap, text: "Processing video stream...", color: "text-yellow-500" },
    { icon: Download, text: "Preparing your download...", color: "text-orange-500" },
    { icon: CheckCircle, text: "Download complete!", color: "text-green-500" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("Download complete!");
          setCurrentStage(3);
          setTimeout(onComplete, 2000);
          return 100;
        }
        
        const increment = Math.random() * 12 + 6;
        const newProgress = Math.min(prev + increment, 100);
        
        if (newProgress < 25) {
          setStatus("Fetching video information...");
          setCurrentStage(0);
        } else if (newProgress < 65) {
          setStatus("Processing video stream...");
          setCurrentStage(1);
        } else if (newProgress < 95) {
          setStatus("Preparing your download...");
          setCurrentStage(2);
        } else {
          setStatus("Finalizing download...");
          setCurrentStage(2);
        }
        
        return newProgress;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [onComplete]);

  const CurrentStageIcon = stages[currentStage].icon;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8 animate-in slide-in-from-top-4 duration-500" data-testid="download-progress">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <CurrentStageIcon className={`w-5 h-5 ${stages[currentStage].color} ${currentStage < 3 ? 'animate-pulse' : ''}`} />
            </div>
            {currentStage < 3 && (
              <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping"></div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-dark">Downloading</h3>
            <p className="text-sm text-gray-500">{format.toUpperCase()} • {quality}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-primary" data-testid="progress-percentage">
            {Math.round(progress)}%
          </div>
          <div className="text-xs text-gray-400">Complete</div>
        </div>
      </div>
      
      <div className="mb-6 space-y-3">
        <Progress 
          value={progress} 
          className="w-full h-2 bg-gray-100" 
          data-testid="progress-bar"
        />
        
        <div className="flex items-center space-x-2 min-h-[20px]">
          <div className={`flex items-center space-x-2 ${stages[currentStage].color} transition-all duration-300`}>
            <CurrentStageIcon className="w-4 h-4" />
            <span className="text-sm font-medium animate-in fade-in duration-300" data-testid="progress-status">
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* Stage indicator dots */}
      <div className="flex justify-center space-x-2 mb-4">
        {stages.map((stage, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index <= currentStage 
                ? index === currentStage && currentStage < 3
                  ? 'bg-primary animate-pulse scale-125'
                  : 'bg-primary'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      
      <div className="flex items-center justify-center space-x-2 text-gray-600">
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
        </div>
        <span className="text-sm">Processing your request</span>
      </div>
    </div>
  );
}
