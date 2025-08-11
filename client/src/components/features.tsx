import { Shield, Smartphone, Zap } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Shield,
      title: "No Storage",
      description: "Files are streamed directly to your device without being stored on our servers",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Fully responsive design that works perfectly on all devices and screen sizes",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "High-speed downloads with real-time progress tracking and instant processing",
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  return (
    <section className="mt-16 mb-12">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold text-dark mb-4" data-testid="features-title">
          Why Choose TechOrMehTube?
        </h3>
        <p className="text-lg text-gray-600" data-testid="features-description">
          Fast, secure, and user-friendly YouTube downloading experience
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100"
            data-testid={`feature-${index}`}
          >
            <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
              <feature.icon className={feature.color} size={24} />
            </div>
            <h4 className="font-semibold text-dark mb-2" data-testid={`feature-title-${index}`}>
              {feature.title}
            </h4>
            <p className="text-gray-600 text-sm" data-testid={`feature-description-${index}`}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
