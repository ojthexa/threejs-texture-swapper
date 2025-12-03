import CubeSwitcher from "../components/CubeSwitcher";
import Navbar from "@/components/Navbar";

export default function Viewer3D() {
  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      <Navbar />
      <CubeSwitcher />
    </div>
  );
}
