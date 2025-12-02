import { Canvas, useThree, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, useTexture, Html } from "@react-three/drei";
import { useState, useMemo, useRef } from "react";
import * as THREE from "three";
import CubeSwitcher from "../components/CubeSwitcher";

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

const boxNames = ["Kiri", "Tengah", "Kanan"];

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
    return boxTextures.map((textureType) => {
      const texture = textureMap[textureType];
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(3, 2);
      texture.center.set(0.5, 0.5);
      return new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.3,
        roughness: 0.7,
      });
    });
  }, [boxTextures]);

  return (
    <>
      {boxTextures.map((_, index) => (
        <mesh
          key={index}
          ref={boxRefs[index]}
          material={materials[index]}
          position={[(index - 1) * 6, 0, 0]}
          onClick={() => onBoxClick(index)}
          onPointerMove={() => setHoveredBox(index)}
          onPointerOut={() => setHoveredBox(null)}
        >
          <boxGeometry args={[6, 4, 0.1]} />
        </mesh>
      ))}

      {(selectedBox ?? hoveredBox) !== null && (
        <Html position={[(selectedBox ?? hoveredBox) * 6 - 6, 3, 0]}>
          <div className="bg-background/95 backdrop-blur-md border-2 border-primary px-4 py-2 rounded-lg shadow-lg pointer-events-none">
            {boxNames[selectedBox ?? hoveredBox!]}:{" "}
            {textureNames[boxTextures[selectedBox ?? hoveredBox!]]}
          </div>
        </Html>
      )}
    </>
  );
}

export default function Viewer3D() {
  const [boxTextures, setBoxTextures] = useState<TextureType[]>([
    "flower",
    "mahkota",
    "himawari",
  ]);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [hoveredBox, setHoveredBox] = useState<number | null>(null);

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      
      {/* === Cube Switcher Panel (Bottom UI) === */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <CubeSwitcher
          boxTextures={boxTextures}
          setBoxTextures={setBoxTextures}
          selectedBox={selectedBox}
        />
      </div>

      {/* === 3D Viewer === */}
      <Canvas camera={{ position: [5, 3, 5], fov: 50 }} className="w-full h-full">
        <color attach="background" args={["#050505"]} />

        <ambientLight intensity={0.6} />
        <directionalLight intensity={1.2} position={[10, 10, 5]} />
        <pointLight intensity={0.6} position={[0, 5, 0]} color="#00ffff" />

        <Fence
          boxTextures={boxTextures}
          onBoxClick={setSelectedBox}
          hoveredBox={hoveredBox}
          setHoveredBox={setHoveredBox}
          selectedBox={selectedBox}
        />

        <OrbitControls enableDamping dampingFactor={0.05} rotateSpeed={0.4} />
      </Canvas>
    </div>
  );
}