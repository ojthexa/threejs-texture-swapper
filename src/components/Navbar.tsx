import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-4 right-4 z-50">
      {/* BURGER / CLOSE BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:text-primary transition p-2 bg-black/40 rounded-lg backdrop-blur-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* SMALL DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-black/70 backdrop-blur-md rounded-xl shadow-lg p-4 flex flex-col gap-3">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="text-white text-sm hover:text-primary transition"
          >
            Home
          </Link>

          <Link
            to="/3d-viewer"
            onClick={() => setIsOpen(false)}
            className="text-white text-sm hover:text-primary transition"
          >
            3D Viewer
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
