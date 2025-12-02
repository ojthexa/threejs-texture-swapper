// SinglePage.jsx
import React, { useRef, useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import logo from "@/assets/logo.png";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture, Html } from "@react-three/drei";
import * as THREE from "three";

/* -------------------------
   Fence (3D boxes) - minimal
   ------------------------- */
const boxNames = ["Kiri", "Tengah", "Kanan"];

function Fence({
  boxTextures,
  onBoxClick,
  hoveredBox,
  setHoveredBox,
  selectedBox,
}) {
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

  const materials = boxTextures.map((t) => {
    const tx = textureMap[t];
    // safety in case textures not loaded yet
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
      transparent: t === "shuriken",
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
          <div className="bg-background/95 backdrop-blur-md border-2 border-primary px-4 py-2 rounded-lg shadow-[0_0_20px_hsl(var(--primary)/0.5)] whitespace-nowrap pointer-events-none">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-bold text-primary uppercase tracking-wider">
                {boxNames[activeBox]} {/* : {texture label could go here} */}
              </span>
            </div>
          </div>
        </Html>
      )}
    </>
  );
}

/* --------------------------------
   SinglePage (Home + 3D viewer)
   -------------------------------- */
export default function SinglePage() {
  const containerRef = useRef(null);
  const [activeSection, setActiveSection] = useState(0); // 0 = Home, 1 = Viewer
  const [boxTextures, setBoxTextures] = useState([
    "flower",
    "mahkota",
    "himawari",
  ]);
  const [selectedBox, setSelectedBox] = useState(null);
  const [hoveredBox, setHoveredBox] = useState(null);

  // scroll to section programmatically
  const goToSection = useCallback((index) => {
    if (!containerRef.current) return;
    const top = window.innerHeight * index;
    containerRef.current.scrollTo({ top, behavior: "smooth" });
  }, []);

  // onScroll: determine active section by closest viewport multiple
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = el.scrollTop;
          const idx = Math.round(scrollTop / window.innerHeight);
          if (idx !== activeSection) setActiveSection(idx);
          ticking = false;
        });
        ticking = true;
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [activeSection]);

  // keyboard arrows to navigate (optional, nice UX)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowDown") goToSection(Math.min(1, activeSection + 1));
      if (e.key === "ArrowUp") goToSection(Math.max(0, activeSection - 1));
      if (e.key === "Home") goToSection(0);
      if (e.key === "End") goToSection(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeSection, goToSection]);

  // small helper: update box texture
  const setTextureForSelected = (tex) => {
    if (selectedBox === null) return;
    const nt = [...boxTextures];
    nt[selectedBox] = tex;
    setBoxTextures(nt);
  };

  return (
    <div className="w-full h-screen">
      {/* NAVBAR (can call goToSection from here if you expose it) */}
      <Navbar />

      {/* SCROLLABLE CONTAINER */}
      <div
        ref={containerRef}
        className="h-screen w-full overflow-y-auto snap-y snap-mandatory scroll-smooth scrollbar-hide"
        // ensure inner div can be scrolled even if body overflow hidden
      >
        {/* SECTION 0: HOME */}
        <section
          id="home"
          className={`h-screen w-full snap-start flex items-center justify-center relative transition-all duration-700 ease-in-out
            ${activeSection === 0 ? "opacity-100 translate-y-0" : "opacity-60 translate-y-6"}`}
        >
          {/* background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5 pointer-events-none" />

          {/* content */}
          <div className="relative z-10 text-center px-6 max-w-5xl">
            <img
              src={logo}
              alt="GRC-artiKON"
              className="h-10 md:h-16 mx-auto mb-6 drop-shadow-[0_0_30px_rgba(0,255,255,0.3)]"
            />

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent transition-transform duration-700 ease-in-out">
              PROFESSIONAL ARCHITECTURE SOLUTIONS
            </h1>

            <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Premium GRC materials and structural solutions for modern architecture.
              Building excellence with innovation and precision.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => goToSection(1)}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:scale-105 transition-transform duration-300"
              >
                Go to 3D Viewer
              </button>
            </div>
          </div>

          {/* scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20 pointer-events-none">
            <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
              <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </section>

        {/* SECTION 1: 3D VIEWER */}
        <section
          id="viewer"
          className={`h-screen w-full snap-start relative transition-all duration-700 ease-in-out
            ${activeSection === 1 ? "opacity-100 translate-y-0" : "opacity-60 translate-y-6"}`}
        >
          {/* subtle background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

          {/* Canvas fills the section */}
          <div className="absolute inset-0">
            <Canvas camera={{ position: [5, 3, 5], fov: 50 }} className="w-full h-full">
              <color attach="background" args={["#050505"]} />
              <ambientLight intensity={0.6} />
              <directionalLight position={[10, 10, 5]} intensity={1.2} />
              <Fence
                boxTextures={boxTextures}
                onBoxClick={(i) => setSelectedBox(i)}
                hoveredBox={hoveredBox}
                setHoveredBox={setHoveredBox}
                selectedBox={selectedBox}
              />
              <OrbitControls enableDamping dampingFactor={0.05} rotateSpeed={0.6} zoomSpeed={0.8} />
            </Canvas>
          </div>

          {/* bottom control panel */}
          <div className="absolute bottom-0 left-0 right-0 z-30 bg-background/90 backdrop-blur-md border-t border-primary/30 p-4">
            <div className="max-w-6xl mx-auto">
              {selectedBox !== null ? (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <div>
                      <p className="text-sm font-bold text-primary uppercase">Selected: {boxNames[selectedBox]}</p>
                      <p className="text-xs text-muted-foreground">Pilih tekstur di sebelah untuk mengganti</p>
                    </div>
                  </div>

                  <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                    {[
                      { label: "Flower", value: "flower", img: "/flower.jpg" },
                      { label: "Mahkota", value: "mahkota", img: "/mahkota.jpg" },
                      { label: "Himawari", value: "himawari", img: "/himawari.jpg" },
                      { label: "Taurus", value: "taurus", img: "/taurus.jpg" },
                      { label: "Metal", value: "metal", img: "/metal.jpg" },
                      { label: "Sulur", value: "sulur", img: "/sulur.jpg" },
                      { label: "Ranting", value: "ranting", img: "/ranting.avif" },
                      { label: "Spinach", value: "spinach", img: "/spinach.avif" },
                      { label: "Shuriken", value: "shuriken", img: "/shuriken.png" },
                    ].map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setTextureForSelected(t.value)}
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          boxTextures[selectedBox] === t.value ? "border-primary scale-110 shadow-[0_0_20px_hsl(var(--primary)/0.8)]" : "border-border hover:border-primary/60 hover:scale-105"
                        }`}
                      >
                        <img src={t.img} alt={t.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1 h-1 bg-accent rounded-full animate-pulse" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Klik pagar untuk memilih</p>
                </div>
              )}
            </div>
          </div>

          {/* back-to-home button */}
          <div className="absolute top-4 left-4 z-40">
            <button
              onClick={() => goToSection(0)}
              className="px-3 py-2 rounded-md bg-background/80 border border-primary/30 hover:bg-background/95 transition-colors duration-200"
            >
              ← Home
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
