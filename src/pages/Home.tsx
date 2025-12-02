// src/pages/Home.jsx
import React, { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import logo from "@/assets/logo.png";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture, Html } from "@react-three/drei";
import * as THREE from "three";

/* ---------- Fence / CubeSwitcher (sama seperti sebelumnya, singkat disini) ---------- */
const boxNames = ["Kiri", "Tengah", "Kanan"];

function Fence({
  boxTextures,
  onBoxClick,
  hoveredBox,
  setHoveredBox,
  selectedBox,
}) {
  const boxRefs = [useRef(), useRef(), useRef()];

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

  const textureNames = {
    flower: "Flower",
    mahkota: "Mahkota",
    himawari: "Himawari",
    taurus: "Taurus",
    metal: "Metal",
    sulur: "Sulur",
    ranting: "Ranting",
    spinach: "Spinach",
    shuriken: "Shuriken",
  };

  const materials = React.useMemo(() => {
    return boxTextures.map((t) => {
      const tx = textureMap[t];
      tx.wrapS = THREE.RepeatWrapping;
      tx.wrapT = THREE.RepeatWrapping;
      tx.repeat.set(3, 2);
      tx.center.set(0.5, 0.5);
      tx.needsUpdate = true;
      return new THREE.MeshStandardMaterial({
        map: tx,
        metalness: 0.3,
        roughness: 0.7,
        transparent: t === "shuriken",
      });
    });
  }, [boxTextures, textureMap]);

  const getPos = (i) => [(i - 1) * 6, 0, 0];
  const activeBox = selectedBox !== null ? selectedBox : hoveredBox;

  return (
    <>
      {boxTextures.map((_, i) => (
        <mesh
          key={i}
          ref={boxRefs[i]}
          material={materials[i]}
          position={getPos(i)}
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
        <Html position={[getPos(activeBox)[0], 3, 0]}>
          <div className="bg-background/95 backdrop-blur-md border-2 border-primary px-4 py-2 rounded-lg shadow-[0_0_20px_hsl(var(--primary)/0.5)] whitespace-nowrap pointer-events-none">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-bold text-primary uppercase tracking-wider">
                {boxNames[activeBox]}: {textureNames[boxTextures[activeBox]]}
              </span>
            </div>
          </div>
        </Html>
      )}
    </>
  );
}

/* ---------- MAIN PAGE ---------- */
export default function Home() {
  // 3D state
  const [boxTextures, setBoxTextures] = useState([
    "flower",
    "mahkota",
    "himawari",
  ]);
  const [selectedBox, setSelectedBox] = useState(null);
  const [hoveredBox, setHoveredBox] = useState(null);

  const textures = [
    { label: "Flower", value: "flower", image: "/flower.jpg" },
    { label: "Mahkota", value: "mahkota", image: "/mahkota.jpg" },
    { label: "Himawari", value: "himawari", image: "/himawari.jpg" },
    { label: "Taurus", value: "taurus", image: "/taurus.jpg" },
    { label: "Metal", value: "metal", image: "/metal.jpg" },
    { label: "Sulur", value: "sulur", image: "/sulur.jpg" },
    { label: "Ranting", value: "ranting", image: "/ranting.avif" },
    { label: "Spinach", value: "spinach", image: "/spinach.avif" },
    { label: "Shuriken", value: "shuriken", image: "/shuriken.png" },
  ];

  // --- section reveal (fade/slide) ---
  const sectionsRef = useRef([]);
  const [inView, setInView] = useState([]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll(".full-section"));
    sectionsRef.current = sections;

    const obs = new IntersectionObserver(
      (entries) => {
        setInView((prev) => {
          const copy = [...(prev.length ? prev : new Array(sections.length).fill(false))];
          entries.forEach((entry) => {
            const idx = sections.indexOf(entry.target);
            if (idx >= 0) copy[idx] = entry.isIntersecting;
          });
          return copy;
        });
      },
      { root: document.querySelector(".scroll-container"), threshold: 0.5 }
    );

    sections.forEach((s) => obs.observe(s));

    return () => obs.disconnect();
  }, []);

  // helper to change texture
  const handleTextureChange = (value) => {
    if (selectedBox === null) return;
    const nt = [...boxTextures];
    nt[selectedBox] = value;
    setBoxTextures(nt);
  };

  return (
    <div className="w-full h-screen">
      <Navbar />

      {/* SCROLL CONTAINER: full-height, snap, hidden scrollbar, smooth */}
      <div
        className="scroll-container h-[calc(100vh-0px)] overflow-y-auto snap-y snap-mandatory scroll-smooth scrollbar-hide no-scrollbar"
        style={{ scrollBehavior: "smooth" }} // redundant but explicit
      >
        {/* HERO (section 0) */}
        <section
          id="hero"
          className={`full-section snap-start h-screen flex items-center justify-center relative transition-transform duration-700 ease-in-out transform px-6 ${
            inView[0] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="relative z-10 text-center max-w-5xl">
            <img
              src={logo}
              alt="GRC-artiKON"
              className="h-10 md:h-16 mx-auto mb-8 drop-shadow-[0_0_30px_rgba(0,255,255,0.3)]"
            />

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              PROFESSIONAL ARCHITECTURE SOLUTIONS
            </h1>

            <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Premium GRC materials and structural solutions for modern architecture.
            </p>

            <div className="mt-8">
              <a
                href="#viewer"
                onClick={(e) => {
                  e.preventDefault();
                  // scroll to viewer section smoothly
                  document.querySelector("#viewer")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(0,255,255,0.3)]"
              >
                View 3D
              </a>
            </div>
          </div>
        </section>

        {/* 3D VIEWER (section 1) */}
        <section
          id="viewer"
          className={`full-section snap-start h-screen relative transition-transform duration-700 ease-in-out transform ${
            inView[1] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <Canvas camera={{ position: [5, 3, 5], fov: 50 }} className="w-full h-full">
            <color attach="background" args={["#050505"]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <pointLight position={[-10, -10, -5]} intensity={0.6} color="#00ffff" />
            <pointLight position={[0, 5, 0]} intensity={0.4} color="#ff00ff" />

            <Fence
              boxTextures={boxTextures}
              onBoxClick={(i) => setSelectedBox(i)}
              hoveredBox={hoveredBox}
              setHoveredBox={setHoveredBox}
              selectedBox={selectedBox}
            />

            <OrbitControls enableDamping dampingFactor={0.05} rotateSpeed={0.5} zoomSpeed={0.8} />
          </Canvas>

          {/* BOTTOM SCRUB / TEXTURE PICKER */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4">
            <div className="bg-background/95 backdrop-blur-md border border-primary/30 rounded-xl p-3 flex gap-3 overflow-x-auto scrollbar-hide">
              {textures.map((t) => (
                <button
                  key={t.value}
                  onClick={() => handleTextureChange(t.value)}
                  disabled={selectedBox === null}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedBox !== null && boxTextures[selectedBox] === t.value
                      ? "border-primary shadow-[0_0_20px_hsl(var(--primary)/0.8)] scale-105"
                      : "border-border hover:border-primary/50 hover:scale-105"
                  } ${selectedBox === null ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <img src={t.image} alt={t.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent flex items-end justify-center pb-1">
                    <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                      {t.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* helper text */}
            {!selectedBox && (
              <div className="text-center mt-2 text-xs text-muted-foreground uppercase tracking-wide">
                Klik pagar 3D untuk memilih kotak sebelum mengganti motif
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
