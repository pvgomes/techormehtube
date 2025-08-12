export interface FormatOption {
  format: string;
  quality: string;
  label: string;
  description: string;
  extension: string;
  type: 'video' | 'audio';
}

export const VIDEO_FORMATS: FormatOption[] = [
  {
    format: 'mp4',
    quality: '1080p',
    label: 'MP4 (1080p)',
    description: 'High quality video, widely compatible',
    extension: 'mp4',
    type: 'video',
  },
  {
    format: 'mp4',
    quality: '720p',
    label: 'MP4 (720p)',
    description: 'Good quality video, smaller file size',
    extension: 'mp4',
    type: 'video',
  },
  {
    format: 'mp4',
    quality: '480p',
    label: 'MP4 (480p)',
    description: 'Standard quality video',
    extension: 'mp4',
    type: 'video',
  },
  {
    format: 'webm',
    quality: '720p',
    label: 'WebM (720p)',
    description: 'Open source format, good compression',
    extension: 'webm',
    type: 'video',
  },
  {
    format: 'avi',
    quality: '720p',
    label: 'AVI (720p)',
    description: 'Legacy format, widely supported',
    extension: 'avi',
    type: 'video',
  },
];

export const AUDIO_FORMATS: FormatOption[] = [
  {
    format: 'mp3',
    quality: '192kbps',
    label: 'MP3 (192 kbps)',
    description: 'High quality audio, small file size',
    extension: 'mp3',
    type: 'audio',
  },
  {
    format: 'mp3',
    quality: '128kbps',
    label: 'MP3 (128 kbps)',
    description: 'Good quality audio, smaller file size',
    extension: 'mp3',
    type: 'audio',
  },
  {
    format: 'wav',
    quality: 'lossless',
    label: 'WAV (Lossless)',
    description: 'Uncompressed audio, largest file size',
    extension: 'wav',
    type: 'audio',
  },
];

export const ALL_FORMATS = [...VIDEO_FORMATS, ...AUDIO_FORMATS];

export const SUPPORTED_FORMATS = {
  video: VIDEO_FORMATS.map(f => f.format),
  audio: AUDIO_FORMATS.map(f => f.format),
  all: ALL_FORMATS.map(f => f.format),
};

export const MAX_VIDEO_DURATION = 600; // 10 minutes in seconds
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB limit