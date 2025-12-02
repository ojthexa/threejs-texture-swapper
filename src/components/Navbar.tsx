import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = ({ scrollToHome, scrollToViewer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = (callback) => {
    callback?.();
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
      <div className="container mx-auto px-6 py-4 flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="ml-auto text-white hover:text-primary p-2 transition"
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Overlay Menu */}
      <div
        className={`
          fixed inset-0 bg-background/95 backdrop-blur-lg 
          transition-all duration-500
          ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      >
        <div className="flex flex-col items-center justify-center h-full gap-10">
          <button
            onClick={() => closeMenu(scrollToHome)}
            className="text-6xl font-bold hover:text-primary hover:scale-110 transition"
          >
            Home
          </button>

          <button
            onClick={() => closeMenu(scrollToViewer)}
            className="text-6xl font-bold hover:text-primary hover:scale-110 transition"
          >
            3D Viewer
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
