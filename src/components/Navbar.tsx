import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between h-14 px-6 text-white md:justify-end">
      <div className="max-w-screen px-6 py-4 flex items-center">
        <div className="font-bold text-sm text-white">My Brand</div>

        {/* push button to right */}
        <button
          onClick={() => setOpen(true)}
          className="ml-auto text-white hover:text-primary transition-colors p-2"
          aria-label="open menu"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* overlay */}
      <div
        className={`fixed inset-0 bg-background/95 backdrop-blur-lg transition-opacity ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="absolute top-4 right-4">
          <button onClick={() => setOpen(false)} className="p-1 text-white">
            <X size={24} />
          </button>
        </div>

        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-4">
            <Link to="/" onClick={() => setOpen(false)} className="block text-white">Home</Link>
            <Link to="/3d-viewer" onClick={() => setOpen(false)} className="block text-white">GRC Player</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
