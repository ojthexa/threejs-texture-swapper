import { Canvas, useThree, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, useTexture, Html } from "@react-three/drei";
import { useState, useMemo, useRef } from "react";
import * as THREE from "three";
import logo from "@/assets/logo.png";

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

interface ColorOverlay {
  color: string;
  opacity: number;
}

const boxNames = ["PANEL DEPAN", "PANEL KANAN", "PANEL BELAKANG", "PANEL KIRI"];

function Fence({
  boxTextures,
  colorOverlays,
  onBoxClick,
  hoveredBox,
  setHoveredBox,
  selectedBox,
}: {
  boxTextures: TextureType[];
  colorOverlays: ColorOverlay[];
  onBoxClick: (boxIndex: number) => void;
  hoveredBox: number | null;
  setHoveredBox: (index: number | null) => void;
  selectedBox: number | null;
}) {
  const boxRefs = [
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
  ];

  const { pointer } = useThree();

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

  const textureMap = useTexture({
    flower: "/flower.jpg",
    mahkota: "/mahkota.jpg",
    himawari: "/himawari.jpg",
    taurus: "/taurus.jpg",
    metal: "/metal.jpg",
    sulur: "/sulur.jpg",
    ranting: "/ranting.avif",
    spinach: "/spinach.avif",
    shuriken: "/shuriken.png",
  });

  const materials = useMemo(() => {
    return boxTextures.map((textureType, index) => {
      const texture = textureMap[textureType];
      const overlay = colorOverlays[index];

      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 2);

      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? {
              r: parseInt(result[1], 16) / 255,
              g: parseInt(result[2], 16) / 255,
              b: parseInt(result[3], 16) / 255,
            }
          : { r: 1, g: 1, b: 1 };
      };

      const rgb = hexToRgb(overlay.color);
      const blendedColor = new THREE.Color(
        1 - overlay.opacity + rgb.r * overlay.opacity,
        1 - overlay.opacity + rgb.g * overlay.opacity,
        1 - overlay.opacity + rgb.b * overlay.opacity
      );

      return new THREE.MeshStandardMaterial({
        map: texture,
        color: blendedColor,
        metalness: 0.3,
        roughness: 0.7,
        transparent: textureType === "shuriken",
      });
    });
  }, [boxTextures, colorOverlays]);

  const panelConfigs = [
    { position: [0, 0, -4], rotation: [0, 0, 0] },
    { position: [4, 0, 0], rotation: [0, Math.PI / 2, 0] },
    { position: [0, 0, 4], rotation: [0, Math.PI, 0] },
    { position: [-4, 0, 0], rotation: [0, -Math.PI / 2, 0] },
  ];

  const activeBox = selectedBox !== null ? selectedBox : hoveredBox;

  return (
    <>
      {boxTextures.map((_, index) => (
        <mesh
          key={index}
          ref={boxRefs[index]}
          material={materials[index]}
          position={panelConfigs[index].position as any}
          rotation={panelConfigs[index].rotation as any}
          onClick={() => onBoxClick(index)}
          onPointerMove={() => setHoveredBox(index)}
          onPointerOut={() => setHoveredBox(null)}
        >
          <boxGeometry args={[8, 4, 0.1]} />
        </mesh>
      ))}

      {activeBox !== null && (
        <Html position={[panelConfigs[activeBox].position[0], 3, panelConfigs[activeBox].position[2]]}>
          <div className="bg-background/95 backdrop-blur-md border-2 border-primary px-4 py-2 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
            <span className="text-sm font-bold text-primary uppercase tracking-wider">
              {boxNames[activeBox]} : {textureNames[boxTextures[activeBox]]}
            </span>
          </div>
        </Html>
      )}
    </>
  );
}

function ColorPicker({
  color,
  opacity,
  onColorChange,
  onOpacityChange,
  disabled,
}: {
  color: string;
  opacity: number;
  onColorChange: (color: string) => void;
  onOpacityChange: (opacity: number) => void;
  disabled: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-3 p-4 bg-background/90 backdrop-blur-md rounded-xl border-2 border-primary/30 ${
        disabled && "opacity-50"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-wide">Color Tint</span>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="color"
          value={color}
          disabled={disabled}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-12 h-12 border-2 rounded-lg cursor-pointer"
        />

        <div className="flex flex-col flex-1 gap-1">
          <input
            type="range"
            min="0"
            max="100"
            disabled={disabled}
            value={opacity * 100}
            onChange={(e) => onOpacityChange(Number(e.target.value) / 100)}
            className="w-full h-2 rounded-lg appearance-none"
          />
          <span className="text-[10px] text-right">{Math.round(opacity * 100)}%</span>
        </div>
      </div>

      <button
        onClick={() => {
          onColorChange("#ffffff");
          onOpacityChange(0);
        }}
        disabled={disabled}
        className="text-[10px] uppercase tracking-wide hover:text-primary"
      >
        Reset Color
      </button>
    </div>
  );
}

export default function CubeSwitcher() {
  const [boxTextures, setBoxTextures] = useState<TextureType[]>(["flower", "mahkota", "himawari", "taurus"]);
  const [colorOverlays, setColorOverlays] = useState<ColorOverlay[]>([
    { color: "#ffffff", opacity: 1 },
    { color: "#ffffff", opacity: 1 },
    { color: "#ffffff", opacity: 1 },
    { color: "#ffffff", opacity: 1 },
  ]);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [hoveredBox, setHoveredBox] = useState<number | null>(null);

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

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* HEADER */}
      <div className="absolute top-0 z-30 w-screen h-14 
                      bg-black/40 backdrop-blur-lg border-b border-white/10
                      md:h-16">
          <img src={logo} className="h-7 ml-4 opacity-90" />
      </div>

      {/* 3D VIEW */}
      <div className="w-screen h-[100vh] md:h-[85vh] overflow-hidden">
        <Canvas camera={{ position: [5, 3, 5], fov: 50 }}>
          <color attach="background" args={["#050505"]} />
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.2} />

          <Fence
            boxTextures={boxTextures}
            colorOverlays={colorOverlays}
            selectedBox={selectedBox}
            hoveredBox={hoveredBox}
            setHoveredBox={setHoveredBox}
            onBoxClick={(i) => setSelectedBox(i)}
          />

          <OrbitControls enableDamping dampingFactor={0.08} rotateSpeed={0.4} />
        </Canvas>
      </div>

      {/* CONTROL PANEL */}
      {/* CONTROL PANEL — ini letaknya di paling bawah halaman */} 
        <div className="absolute bottom-0 w-full max-h-[38vh] 
                        p-4 bg-background/95 backdrop-blur-md 
                        border-t shadow-lg overflow-y-auto">
        {selectedBox !== null && (
          <h3 className="mb-2 font-semibold text-primary tracking-wide uppercase text-sm">
            {boxNames[selectedBox]}
          </h3>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px]">
          {/* TEXTURE PICKER */}
          <div className="flex gap-3 pb-1 overflow-x-auto">
            {textures.map((t) => (
              <button
                key={t.value}
                disabled={selectedBox === null}
                onClick={() => {
                  const updated = [...boxTextures];
                  if (selectedBox !== null) updated[selectedBox] = t.value;
                  setBoxTextures(updated);
                }}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border ${
                  selectedBox !== null && boxTextures[selectedBox] === t.value
                    ? "border-primary scale-110 shadow-primary"
                    : "border-border hover:border-primary"
                }`}
              >
                <img src={t.image} className="object-cover w-full h-full" />
                <p className="absolute bottom-0 text-[9px] font-bold bg-black/30 w-full text-center">
                  {t.label}
                </p>
              </button>
            ))}
          </div>

          {/* COLOR PICK */}
          <ColorPicker
            disabled={selectedBox === null}
            color={selectedBox !== null ? colorOverlays[selectedBox].color : "#fff"}
            opacity={selectedBox !== null ? colorOverlays[selectedBox].opacity : 1}
            onColorChange={(c) => {
              if (selectedBox === null) return;
              const updated = [...colorOverlays];
              updated[selectedBox].color = c;
              setColorOverlays(updated);
            }}
            onOpacityChange={(v) => {
              if (selectedBox === null) return;
              const updated = [...colorOverlays];
              updated[selectedBox].opacity = v;
              setColorOverlays(updated);
            }}
          />
        </div>
      </div>
    </div>
  );
}
