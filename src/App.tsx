import React, { useRef, useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture, Html } from "@react-three/drei";
import * as THREE from "three";

/* --------------------------------
    HOME SECTION
---------------------------------- */
const Home = ({ scrollToViewer }) => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <button
        onClick={scrollToViewer}
        className="px-6 py-3 bg-primary text-black text-xl rounded-xl"
      >
        Start
      </button>
    </div>
  );
};

/* --------------------------------
    3D FENCE (Viewer Section)
---------------------------------- */
const boxNames = ["Kiri", "Tengah", "Kanan"];

const Fence = ({
  boxTextures,
  onBoxClick,
  hoveredBox,
  setHoveredBox,
  selectedBox,
}) => {
  const textureMap = {
    flower: useTexture("/flower.jpg"),
    mahkota: useTexture("/mahkota.jpg"),
    himawari: useTexture("/himawari.jpg"),
    taurus: useTexture("/taurus.jpg"),
    metal: useTexture("/metal.jpg"),
    sulur: useTexture("/sulur.jpg"),
    ranting: useTexture("/ranting.avif"),
    spinach: useTexture("/spinach.avif"),
    shuriken: useTexture("/shuriken.png"),
  };

  const materials = boxTextures.map((key) => {
    const tx = textureMap[key];
    if (tx) {
      tx.wrapS = THREE.RepeatWrapping;
      tx.wrapT = THREE.RepeatWrapping;
      tx.repeat.set(3, 2);
      tx.center.set(0.5, 0.5);
      tx.needsUpdate = true;
    }
    return new THREE.MeshStandardMaterial({
      map: tx || null,
      roughness: 0.7,
      metalness: 0.2,
      transparent: key === "shuriken",
    });
  });

  const activeBox = selectedBox !== null ? selectedBox : hoveredBox;

  return (
    <>
      {boxTextures.map((_, i) => (
        <mesh
          key={i}
          material={materials[i]}
          position={[(i - 1) * 6, 0, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onBoxClick(i);
          }}
          onPointerMove={(e) => {
            e.stopPropagation();
            setHoveredBox(i);
          }}
          onPointerOut={() => setHoveredBox(null)}
        >
          <boxGeometry args={[6, 4, 0.1]} />
        </mesh>
      ))}

      {activeBox !== null && (
        <Html position={[(activeBox - 1) * 6, 3, 0]}>
          <div className="bg-background/95 backdrop-blur-md border-2 border-primary px-4 py-2 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
            <span className="text-sm text-primary font-bold">
              {boxNames[activeBox]}
            </span>
          </div>
        </Html>
      )}
    </>
  );
};

/* --------------------------------
    MAIN SINGLE PAGE APP
---------------------------------- */
export default function SinglePage() {
  const containerRef = useRef(null);
  const [activeSection, setActiveSection] = useState(0);
  const [boxTextures, setBoxTextures] = useState([
    "flower",
    "mahkota",
    "himawari",
  ]);

  const [selectedBox, setSelectedBox] = useState(null);
  const [hoveredBox, setHoveredBox] = useState(null);

  const goToSection = useCallback((index) => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: window.innerHeight * index,
      behavior: "smooth",
    });
  }, []);

  // update current section indicator
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const idx = Math.round(el.scrollTop / window.innerHeight);
      setActiveSection(idx);
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden">
      <Navbar
        scrollToHome={() => goToSection(0)}
        scrollToViewer={() => goToSection(1)}
      />

      <div
        ref={containerRef}
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth scrollbar-hide"
      >
        {/* HOME */}
        <section className="snap-start h-screen w-full">
          <Home scrollToViewer={() => goToSection(1)} />
        </section>

        {/* VIEWER */}
        <section className="snap-start h-screen w-full relative">
          <Canvas camera={{ position: [5, 3, 5], fov: 50 }}>
            <color attach="background" args={["#050505"]} />
            <ambientLight intensity={0.7} />
            <directionalLight intensity={1.2} position={[10, 10, 5]} />

            <Fence
              boxTextures={boxTextures}
              onBoxClick={(i) => setSelectedBox(i)}
              hoveredBox={hoveredBox}
              setHoveredBox={setHoveredBox}
              selectedBox={selectedBox}
            />

            <OrbitControls />
          </Canvas>

          <button
            onClick={() => goToSection(0)}
            className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded-md"
          >
            ← Home
          </button>
        </section>
      </div>
    </div>
  );
}
