import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // tetap gunakan path milikmu

export default function Navbar() {
  return (
    <nav
      className="
      fixed top-0 left-0 w-full z-50
      h-14 md:h-16 flex items-center px-4

      /* SCI-FI LOOK */
      bg-black/40 backdrop-blur-xl 
      border-b border-cyan-400/30
      shadow-[0_0_15px_rgba(0,255,255,0.25)]
      "
    >
      {/* LOGO */}
      <img 
        src={logo} 
        alt="Logo"
        className="h-7 opacity-90 drop-shadow-[0_0_6px_rgb(0,255,255)]" 
      />

      {/* >>> PASTE HOME BUTTON MILIKMU DI SINI <<< */}
      <div className="ml-auto flex items-center">
        {/* contoh, hapus jika kamu punya yang lain */}
        {/* <Link to="/" className="text-cyan-300 hover:text-white transition-all">Home</Link> */}
      </div>
    </nav>
  );
}
