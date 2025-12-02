import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";

const TiltLogo = ({ onTiltChange }) => {
  const [hovered, setHovered] = useState(false);
  const [autoAngle, setAutoAngle] = useState(0);
  const [direction, setDirection] = useState(1);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  // Auto rotate Y when hovered
  useEffect(() => {
    if (!hovered) {
      setAutoAngle(0);
      return;
    }

    const interval = setInterval(() => {
      setAutoAngle((prev) => {
        const next = prev + direction * 1.8;

        if (next > 45) setDirection(-1);
        if (next < -45) setDirection(1);

        return next;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [hovered, direction]);

  // Mouse tilt movement (affects text)
  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y - rect.height / 2) / 25).toFixed(2);
    const rotateY = ((x - rect.width / 2) / 25).toFixed(2);

    const newTilt = { rotateX: Number(rotateX), rotateY: Number(rotateY) };
    setTilt(newTilt);

    if (onTiltChange) onTiltChange(newTilt);
  };

  const handleLeave = () => {
    setHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
    if (onTiltChange) onTiltChange({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      className="w-40 md:w-56 mx-auto perspective-1000"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
    >
      <img
        src={logo}
        alt="artiKON Logo"
        className="w-full drop-shadow-[0_0_30px_rgba(0,255,255,0.3)]"
        style={{
          transform: `
            rotateX(${tilt.rotateX}deg)
            rotateY(${autoAngle + tilt.rotateY}deg)
          `,
          transition: hovered ? "none" : "transform 0.4s ease-out",
          transformStyle: "preserve-3d",
        }}
      />
    </div>
  );
};

export default TiltLogo;
