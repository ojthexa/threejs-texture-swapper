import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
      <div className="container mx-auto px-6 py-4 flex items-center">
        {/* Burger di kanan */}
        <button
          onClick={() => setIsOpen(true)}
          className="ml-auto text-white hover:text-primary transition-colors p-2"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Overlay menu */}
      <div
        className={`fixed inset-0 bg-background/95 backdrop-blur-lg
        transition-all duration-500
        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      >
        <div className="absolute top-4 right-4 flex flex-col items-end gap-3">

          {/* Tombol X kecil */}
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-primary transition-colors p-1"
          >
            <X size={24} />
          </button>

          {/* Menu list */}
          <div className="flex flex-col items-end gap-2 pr-1">
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
