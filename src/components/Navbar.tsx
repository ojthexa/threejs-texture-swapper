import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = ({ mobileFull }: { mobileFull?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  const isMobileTablet = window.innerWidth <= 1024;
  const widthClass = mobileFull && isMobileTablet ? "w-screen" : "w-auto";

  return (
    <nav className={`fixed top-0 left-0 z-50 mix-blend-difference ${widthClass}`}>
      
      {/* icon toggle */}
      <div className="px-5 py-4 flex items-center">
        <button
          onClick={() => setIsOpen(true)}
          className="ml-auto text-white p-2">
          <Menu size={26} />
        </button>
      </div>

      {/* MENU OVERLAY */}
      <div className={`
        fixed inset-0 bg-black/90 backdrop-blur-lg duration-500
        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
      `}>
        <div className="absolute top-4 right-4">

          <button onClick={() => setIsOpen(false)} className="text-white p-2">
            <X size={24} />
          </button>

          <div className="flex flex-col items-end gap-2 mt-4 pr-2">
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/3d-viewer" onClick={() => setIsOpen(false)}>GRC Player</Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
