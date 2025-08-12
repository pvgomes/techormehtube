/**
 * Triggers browser download from a response stream
 */
export async function downloadFromResponse(
  response: Response,
  filename: string
): Promise<void> {
  if (!response.body) {
    throw new Error('No response body available for download');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Estimates file size based on duration and format
 */
export function estimateFileSize(
  durationSeconds: number,
  format: string,
  quality?: string
): string {
  const bitrates: Record<string, number> = {
    // Video formats (in Mbps)
    'mp4_1080p': 8,
    'mp4_720p': 5,
    'mp4_480p': 2.5,
    'mp4_360p': 1,
    'webm_1080p': 6,
    'webm_720p': 4,
    'webm_480p': 2,
    'avi_720p': 10,
    'avi_480p': 5,
    
    // Audio formats (in Kbps)
    'mp3': 192,
    'wav': 1411,
  };

  const key = quality ? `${format}_${quality}` : format;
  const bitrate = bitrates[key] || bitrates[format] || 1;
  
  let sizeInMB: number;
  if (['mp3', 'wav'].includes(format)) {
    // Audio: bitrate in Kbps
    sizeInMB = (durationSeconds * bitrate) / (8 * 1024);
  } else {
    // Video: bitrate in Mbps
    sizeInMB = (durationSeconds * bitrate) / 8;
  }

  if (sizeInMB < 1) {
    return `${Math.round(sizeInMB * 1024)} KB`;
  } else if (sizeInMB < 1024) {
    return `${Math.round(sizeInMB)} MB`;
  } else {
    return `${(sizeInMB / 1024).toFixed(1)} GB`;
  }
}

/**
 * Validates time range for cutting
 */
export function validateTimeRange(
  startTime?: number,
  endTime?: number,
  videoDuration?: number
): { isValid: boolean; error?: string } {
  if (startTime !== undefined && startTime < 0) {
    return { isValid: false, error: 'Start time cannot be negative' };
  }

  if (endTime !== undefined && endTime < 0) {
    return { isValid: false, error: 'End time cannot be negative' };
  }

  if (startTime !== undefined && endTime !== undefined && endTime <= startTime) {
    return { isValid: false, error: 'End time must be greater than start time' };
  }

  if (videoDuration && endTime && endTime > videoDuration) {
    return { isValid: false, error: 'End time cannot exceed video duration' };
  }

  if (videoDuration && startTime && startTime >= videoDuration) {
    return { isValid: false, error: 'Start time cannot exceed video duration' };
  }

  return { isValid: true };
}