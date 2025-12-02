import CubeSwitcher from "@/components/CubeSwitcher";
import Navbar from "@/components/Navbar";

const Viewer3D = () => {
  return (
    <div className="relative h-screen w-full">
      <Navbar />
      <CubeSwitcher />
    </div>
  );
};

export default Viewer3D;
