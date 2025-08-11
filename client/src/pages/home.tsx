import { useState } from "react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import UrlInput from "@/components/url-input";
import VideoPreview from "@/components/video-preview";
import DownloadOptions from "@/components/download-options";
import DownloadProgress from "@/components/download-progress";
import Features from "@/components/features";
import SupportedFormats from "@/components/supported-formats";
import Footer from "@/components/footer";
import type { VideoInfo } from "@/types/youtube";

export default function Home() {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [downloadInProgress, setDownloadInProgress] = useState(false);
  const [downloadDetails, setDownloadDetails] = useState<{ format: string; quality: string } | null>(null);

  const handleVideoInfo = (info: VideoInfo, url: string) => {
    setVideoInfo(info);
    setCurrentUrl(url);
  };

  const handleDownloadStart = (format: string, quality: string) => {
    setDownloadDetails({ format, quality });
    setDownloadInProgress(true);
  };

  const handleDownloadComplete = () => {
    setDownloadInProgress(false);
    setDownloadDetails(null);
  };

  return (
    <div className="min-h-screen bg-light text-dark">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Hero />
        
        <section className="max-w-4xl mx-auto">
          <UrlInput 
            onVideoInfo={handleVideoInfo}
            isLoading={downloadInProgress}
          />
          
          {videoInfo && (
            <>
              <VideoPreview videoInfo={videoInfo} />
              <DownloadOptions 
                videoInfo={videoInfo}
                url={currentUrl}
                onDownloadStart={handleDownloadStart}
              />
            </>
          )}
          
          {downloadInProgress && downloadDetails && (
            <DownloadProgress
              format={downloadDetails.format}
              quality={downloadDetails.quality}
              onComplete={handleDownloadComplete}
            />
          )}
        </section>
        
        <Features />
        <SupportedFormats />
      </main>
      
      <Footer />
    </div>
  );
}
