import { useState } from "react";
import { Menu, X, Play } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Play className="text-white" size={18} />
            </div>
            <h1 className="text-xl font-bold text-dark">TechOrMehTube</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-primary transition-colors" data-testid="nav-home">
              Home
            </a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors" data-testid="nav-features">
              Features
            </a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors" data-testid="nav-support">
              Support
            </a>
          </nav>
          
          <button 
            className="md:hidden text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="mobile-menu-button"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-gray-600 hover:text-primary transition-colors" data-testid="mobile-nav-home">
                Home
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors" data-testid="mobile-nav-features">
                Features
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors" data-testid="mobile-nav-support">
                Support
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
