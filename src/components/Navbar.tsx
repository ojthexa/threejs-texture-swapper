/* ------------- NAVBAR SEDERHANA ------------- */
/* Hanya menampilkan Logo + Tombol Home */

import logo from "../assets/logo.png";   // pastikan path logo benar
import { Link } from "react-router-dom"; // jika belum pakai routing, boleh hapus

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 
      bg-black/40 backdrop-blur-lg border-b border-white/10
      h-14 md:h-16 flex items-center px-4">

      {/* Logo */}
      <img src={logo} alt="Logo" className="h-7 opacity-90" />

      {/* Tombol Home */}
      <div className="ml-auto">
        <Link to="/">
          <button className="px-4 py-1.5 rounded-lg text-sm font-medium
            bg-white/10 hover:bg-white/20 active:bg-white/30
            text-white border border-white/20 transition">
            Home
          </button>
        </Link>
      </div>
    </nav>
  );
}
