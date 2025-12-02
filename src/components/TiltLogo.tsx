import { useState } from "react";
import logo from "@/assets/logo.png";

const TiltLogo = ({ onTiltChange }) => {
  const [transform, setTransform] = useState("");

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;

    const rotateX = ((y - rect.height / 2) / 20).toFixed(2);
    const rotateY = ((x - rect.width / 2) / 20).toFixed(2);

    const t = `rotateX(${ -rotateX }deg) rotateY(${ rotateY }deg) scale(1.08)`;
    setTransform(t);

    if (onTiltChange) {
      onTiltChange({ rotateX, rotateY });
    }
  };

  const handleLeave = () => {
    setTransform("rotateX(0deg) rotateY(0deg) scale(1)");
    if (onTiltChange) onTiltChange({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      className="w-40 md:w-56 mx-auto transition-transform duration-150 ease-out perspective-1000"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <img
        src={logo}
        alt="artiKON Logo"
        className="w-full drop-shadow-[0_0_30px_rgba(0,255,255,0.3)]"
        style={{
          transform,
          transformStyle: "preserve-3d",
        }}
      />
    </div>
  );
};

export default TiltLogo;
