export interface VideoInfo {
  videoId: string;
  title: string;
  description: string;
  duration: string;
  views: string;
  channel: string;
  thumbnail: string;
  videoFormats: VideoFormat[];
  audioFormats: AudioFormat[];
}

export interface VideoFormat {
  itag: number;
  container: string;
  quality: string;
  qualityLabel: string;
  hasAudio: boolean;
  hasVideo: boolean;
  contentLength?: string;
}

export interface AudioFormat {
  itag: number;
  container: string;
  quality: string;
  audioBitrate?: number;
  audioQuality: string;
  contentLength?: string;
}

export interface DownloadOption {
  format: string;
  quality: string;
  label: string;
  description: string;
  type: 'video' | 'audio';
}
