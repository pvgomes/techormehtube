import { Play } from "lucide-react";
import { FaTwitter, FaGithub, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const featureLinks = [
    { name: 'Video Download', href: '#' },
    { name: 'Audio Extraction', href: '#' },
    { name: 'Multiple Formats', href: '#' },
    { name: 'Mobile Support', href: '#' },
  ];

  const supportLinks = [
    { name: 'Help Center', href: '#' },
    { name: 'Contact Us', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Play className="text-white" size={16} />
              </div>
              <span className="text-lg font-bold text-dark" data-testid="footer-logo">
                TechOrMehTube
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4" data-testid="footer-description">
              Fast, secure, and free YouTube video and audio downloader. Download your favorite content in multiple formats without storing files on our servers.
            </p>
            <div className="flex space-x-4">
              <a href="https://x.com/_pvgomes" className="text-gray-400 hover:text-primary transition-colors" data-testid="social-twitter">
                <FaTwitter size={20} />
              </a>
              <a href="https://github.com/pvgomes" className="text-gray-400 hover:text-primary transition-colors" data-testid="social-github">
                <FaGithub size={20} />
              </a>
              <a href="https://www.youtube.com/@tech-or-meh" className="text-gray-400 hover:text-primary transition-colors" data-testid="social-youtube">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold text-dark mb-3">Features</h5>
            <ul className="space-y-2 text-sm">
              {featureLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-600 hover:text-primary transition-colors"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(' ', '-')}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold text-dark mb-3">Support</h5>
            <ul className="space-y-2 text-sm">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-600 hover:text-primary transition-colors"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(' ', '-')}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm" data-testid="footer-copyright">
            © {new Date().getFullYear()} TechOrMehTube • Built with ❤️ for the community
          </p>
        </div>
      </div>
    </footer>
  );
}
