import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
      <div className="container mx-auto px-6 py-4 flex items-center">
        {/* Burger menu di kanan */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="ml-auto text-white hover:text-primary transition-colors p-2"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Full screen menu overlay */}
      <div
        className={`fixed inset-0 bg-background/95 backdrop-blur-lg transition-all duration-500 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="text-5xl md:text-7xl font-bold text-foreground hover:text-primary transition-all duration-300 hover:scale-110"
          >
            Home
          </Link>
          <Link
            to="/3d-viewer"
            onClick={() => setIsOpen(false)}
            className="text-5xl md:text-7xl font-bold text-foreground hover:text-primary transition-all duration-300 hover:scale-110"
          >
            3D Viewer
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
