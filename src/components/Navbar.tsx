import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // biarkan sesuai path kamu

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 
      bg-black/40 backdrop-blur-lg border-b border-white/10
      h-14 md:h-16 flex items-center px-4">

      {/* Logo tetap */}
      <img src={logo} alt="Logo" className="h-7 opacity-90" />

      {/* Tombol Home kamu yang lama — tidak diganggu, tidak diubah */}
      <div className="ml-auto">
        {/* kamu tinggal taruh tombol home kamu di sini */}
        {/* contoh (INI TIDAK MENGGANTI HOME BUTTON YANG KAMU PUNYA) */}

        {/* PASTE tombol home kamu di bawah ini */}
        {/* --- */}
        {/* <Link to="/" className="text-white">Home</Link> */}
        {/* --- */}

      </div>
    </nav>
  );
}
