import { Video, Music } from "lucide-react";

export default function SupportedFormats() {
  const videoFormats = [
    { name: 'MP4', qualities: '720p, 1080p' },
    { name: 'WebM', qualities: '720p, 1080p' },
    { name: 'AVI', qualities: 'Various qualities' },
  ];

  const audioFormats = [
    { name: 'MP3', qualities: '128kbps, 192kbps, 320kbps' },
    { name: 'WAV', qualities: 'Uncompressed quality' },
    { name: 'M4A', qualities: '256kbps, 320kbps' },
  ];

  return (
    <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-12">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-dark mb-4" data-testid="formats-title">
          Supported Formats
        </h3>
        <p className="text-gray-600" data-testid="formats-description">
          Choose from multiple formats to suit your needs
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-semibold text-dark mb-4 flex items-center">
            <Video className="text-primary mr-2" size={20} />
            Video Formats
          </h4>
          <div className="space-y-2">
            {videoFormats.map((format) => (
              <div 
                key={format.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                data-testid={`video-format-${format.name.toLowerCase()}`}
              >
                <span>{format.name}</span>
                <span className="text-sm text-gray-500">{format.qualities}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-dark mb-4 flex items-center">
            <Music className="text-secondary mr-2" size={20} />
            Audio Formats
          </h4>
          <div className="space-y-2">
            {audioFormats.map((format) => (
              <div 
                key={format.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                data-testid={`audio-format-${format.name.toLowerCase()}`}
              >
                <span>{format.name}</span>
                <span className="text-sm text-gray-500">{format.qualities}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
