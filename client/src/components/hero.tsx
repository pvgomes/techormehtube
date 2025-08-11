export default function Hero() {
  return (
    <section className="text-center mb-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-dark mb-6" data-testid="hero-title">
          Download YouTube Videos & Audio{" "}
          <span className="text-primary">Instantly</span>
        </h2>
        <p className="text-lg text-gray-600 mb-8" data-testid="hero-description">
          Fast, secure, and free YouTube downloader. Extract audio or download videos in multiple formats without storing files on our servers.
        </p>
      </div>
    </section>
  );
}
