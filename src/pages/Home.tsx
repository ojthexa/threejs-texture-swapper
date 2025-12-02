import { useState, useMemo, useRef } from "react";
import { Canvas, useTexture, Html } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Navbar from "@/components/Navbar";

type TextureType =
  | "flower"
  | "mahkota"
  | "himawari"
  | "taurus"
  | "metal"
  | "sulur"
  | "ranting"
  | "spinach"
  | "shuriken";

// ===============================
// 3D FENCE
// ===============================
function Fence({
  boxTextures,
  onBoxClick,
  hoveredBox,
  setHoveredBox,
  selectedBox,
}: {
  boxTextures: TextureType[];
  onBoxClick: (boxIndex: number) => void;
  hoveredBox: number | null;
  setHoveredBox: (index: number | null) => void;
  selectedBox: number | null;
}) {
  const boxRefs = [
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
  ];

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

  const materials = useMemo(() => {
    return boxTextures.map((texture) => {
      const tex = textureMap[texture];
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(3, 2);
      return new THREE.MeshStandardMaterial({
        map: tex,
        metalness: 0.3,
        roughness: 0.7,
      });
    });
  }, [boxTextures]);

  const active = selectedBox ?? hoveredBox;

  return (
    <>
      {boxTextures.map((_, i) => (
        <mesh
          key={i}
          ref={boxRefs[i]}
          material={materials[i]}
          position={[(i - 1) * 6, 0, 0]}
          onClick={() => onBoxClick(i)}
          onPointerMove={() => setHoveredBox(i)}
          onPointerOut={() => setHoveredBox(null)}
        >
          <boxGeometry args={[6, 4, 0.1]} />
        </mesh>
      ))}

      {active !== null && (
        <Html position={[(active - 1) * 6, 3, 0]}>
          <div className="bg-background/90 px-4 py-2 rounded-md border border-primary text-primary shadow-lg">
            {textureNames[boxTextures[active]]}
          </div>
        </Html>
      )}
    </>
  );
}

// ===============================
// FULLPAGE HOME + 3D VIEWER
// ===============================
export default function Home() {
  const [section, setSection] = useState<"home" | "viewer">("home");

  const [boxTextures, setBoxTextures] = useState<TextureType[]>([
    "flower",
    "mahkota",
    "himawari",
  ]);
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const goViewer = () =>
    setSection("viewer");

  const goHome = () =>
    setSection("home");

  return (
    <div className="h-screen w-full overflow-hidden snap-y snap-mandatory relative">

      <Navbar />

      {/* HOME SECTION */}
      <section
        className={`h-screen w-full flex items-center justify-center transition-all duration-700 ease-in-out snap-start ${
          section === "home"
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            PROFESSIONAL ARCHITECTURE SOLUTIONS
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Premium GRC material for modern architecture.
          </p>
          <button
            onClick={goViewer}
            className="px-8 py-4 bg-primary text-white rounded-lg shadow hover:scale-105 transition"
          >
            Open 3D Viewer
          </button>
        </div>
      </section>

      {/* VIEWER SECTION */}
      <section
        className={`h-screen w-full transition-all duration-700 ease-in-out snap-start absolute top-0 left-0 ${
          section === "viewer"
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={goHome}
          className="absolute top-6 left-6 z-50 px-4 py-2 bg-background border rounded shadow"
        >
          ← Back
        </button>

        <Canvas camera={{ position: [5, 3, 5], fov: 50 }}>
          <color attach="background" args={["#050505"]} />

          <ambientLight intensity={0.6} />
          <directionalLight intensity={1.2} position={[10, 10, 5]} />

          <Fence
            boxTextures={boxTextures}
            onBoxClick={setSelected}
            hoveredBox={hovered}
            setHoveredBox={setHovered}
            selectedBox={selected}
          />

          <OrbitControls enableDamping dampingFactor={0.05} />
        </Canvas>
      </section>
    </div>
  );
}
