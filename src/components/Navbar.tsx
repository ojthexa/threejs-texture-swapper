import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`fixed top-0 left-0 w-screen z-50 mix-blend-difference pointer-events-auto ${className || ''}`}>
      
      {/* Wrapper Navbar */}
      <div className="max-w-screen px-6 py-4 flex items-center">
        {/* Burger Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="ml-auto text-white hover:text-primary transition-colors p-2"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* ====================== Overlay ====================== */}
      <div
        className={`
          fixed top-0 left-0 w-screen h-screen 
          bg-background/95 backdrop-blur-lg 
          transition-all duration-500 
          overflow-hidden touch-none
          ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      >
        {/* Close Button */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-3">

          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-primary transition-colors p-1"
          >
            <X size={24} />
          </button>

          {/* ====================== Menu Items ====================== */}
          <div className="flex flex-col items-end gap-2 pr-1 text-right">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="text-sm md:text-base lg:text-lg font-semibold text-foreground hover:text-primary transition-all"
            >
              Home
            </Link>

            <Link
              to="/3d-viewer"
              onClick={() => setIsOpen(false)}
              className="text-sm md:text-base lg:text-lg font-semibold text-foreground hover:text-primary transition-all"
            >
              GRC Player
            </Link>

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
