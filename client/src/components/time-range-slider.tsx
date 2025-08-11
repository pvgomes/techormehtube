import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Clock, RotateCcw } from "lucide-react";

interface TimeRangeSliderProps {
  videoDuration: number; // in seconds
  onTimeRangeChange: (startTime: number, endTime: number) => void;
  isEnabled: boolean;
}

export default function TimeRangeSlider({ videoDuration, onTimeRangeChange, isEnabled }: TimeRangeSliderProps) {
  const [timeRange, setTimeRange] = useState<[number, number]>([0, videoDuration]);
  const [useTimeRange, setUseTimeRange] = useState(false);

  useEffect(() => {
    setTimeRange([0, videoDuration]);
  }, [videoDuration]);

  useEffect(() => {
    if (useTimeRange) {
      onTimeRangeChange(timeRange[0], timeRange[1]);
    } else {
      onTimeRangeChange(0, videoDuration);
    }
  }, [timeRange, useTimeRange, videoDuration, onTimeRangeChange]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSliderChange = (values: number[]) => {
    const [start, end] = values;
    // Ensure minimum 1 second difference
    if (end - start >= 1) {
      setTimeRange([start, end]);
    }
  };

  const resetTimeRange = () => {
    setTimeRange([0, videoDuration]);
  };

  const toggleTimeRange = () => {
    setUseTimeRange(!useTimeRange);
    if (!useTimeRange) {
      // Reset to full duration when enabling
      setTimeRange([0, videoDuration]);
    }
  };

  if (!isEnabled || videoDuration <= 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6" data-testid="time-range-slider">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="text-primary" size={20} />
          <h4 className="font-semibold text-dark">Trim Video/Audio</h4>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={resetTimeRange}
            variant="outline"
            size="sm"
            disabled={!useTimeRange}
            data-testid="button-reset-time"
          >
            <RotateCcw size={14} className="mr-1" />
            Reset
          </Button>
          <Button
            onClick={toggleTimeRange}
            variant={useTimeRange ? "default" : "outline"}
            size="sm"
            className={useTimeRange ? "bg-primary text-white" : ""}
            data-testid="button-toggle-trim"
          >
            {useTimeRange ? "Disable Trim" : "Enable Trim"}
          </Button>
        </div>
      </div>

      {useTimeRange && (
        <div className="space-y-4">
          <div className="px-2">
            <Slider
              value={timeRange}
              onValueChange={handleSliderChange}
              max={videoDuration}
              min={0}
              step={1}
              className="w-full"
              data-testid="time-range-slider-input"
            />
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <span className="text-gray-600">Start:</span>
                <span className="font-mono font-medium" data-testid="start-time-display">
                  {formatTime(timeRange[0])}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-600">End:</span>
                <span className="font-mono font-medium" data-testid="end-time-display">
                  {formatTime(timeRange[1])}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-gray-600">Duration:</span>
              <span className="font-mono font-medium text-primary" data-testid="trim-duration-display">
                {formatTime(timeRange[1] - timeRange[0])}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 flex items-center">
              <Clock size={12} className="mr-1" />
              Drag the handles to select the portion you want to download. 
              The trimmed file will be processed on-demand without storing on our servers.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}