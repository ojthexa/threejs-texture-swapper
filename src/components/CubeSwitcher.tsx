import { Canvas, useThree, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, useTexture, Html, Line } from "@react-three/drei";
import { useState, useMemo, useRef } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";

type TextureType = "flower" | "mahkota" | "himawari" | "taurus" | "metal" | "sulur" | "ranting" | "spinach" | "shuriken";

const boxNames = ["Kiri", "Tengah", "Kanan"];

function Fence({ 
  boxTextures, 
  onBoxClick,
  hoveredBox,
  setHoveredBox,
  selectedBox
}: { 
  boxTextures: TextureType[];
  onBoxClick: (boxIndex: number) => void;
  hoveredBox: number | null;
  setHoveredBox: (index: number | null) => void;
  selectedBox: number | null;
}) {
  const boxRefs = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)];
  const { camera, raycaster, pointer } = useThree();
  
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
  
  const flowerTexture = useTexture("/flower.jpg");
  const mahkotaTexture = useTexture("/mahkota.jpg");
  const himawariTexture = useTexture("/himawari.jpg");
  const taurusTexture = useTexture("/taurus.jpg");
  const metalTexture = useTexture("/metal.jpg");
  const sulurTexture = useTexture("/sulur.jpg");
  const rantingTexture = useTexture("/ranting.avif");
  const spinachTexture = useTexture("/spinach.avif");
  const shurikenTexture = useTexture("/shuriken.png");

  const textureMap = {
    flower: flowerTexture,
    mahkota: mahkotaTexture,
    himawari: himawariTexture,
    taurus: taurusTexture,
    metal: metalTexture,
    sulur: sulurTexture,
    ranting: rantingTexture,
    spinach: spinachTexture,
    shuriken: shurikenTexture,
  };

  const materials = useMemo(() => {
    return boxTextures.map((textureType) => {
      const material = new THREE.MeshStandardMaterial({
        map: textureMap[textureType],
        metalness: 0.3,
        roughness: 0.7,
      });
      material.map!.wrapS = THREE.RepeatWrapping;
      material.map!.wrapT = THREE.RepeatWrapping;
      material.map!.repeat.set(3, 2);
      material.needsUpdate = true;
      return material;
    });
  }, [boxTextures, flowerTexture, mahkotaTexture, himawariTexture, taurusTexture, metalTexture, sulurTexture, rantingTexture, spinachTexture, shurikenTexture]);

  const handleClick = (boxIndex: number) => (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onBoxClick(boxIndex);
  };

  const handlePointerMove = (boxIndex: number) => (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHoveredBox(boxIndex);
  };

  const handlePointerOut = () => {
    setHoveredBox(null);
  };

  const getBoxPosition = (boxIndex: number): [number, number, number] => {
    const boxWidth = 6;
    return [(boxIndex - 1) * boxWidth, 0, 0];
  };

  const getAnnotationPosition = (boxIndex: number): [number, number, number] => {
    const pos = getBoxPosition(boxIndex);
    return [pos[0], pos[1] + 3, pos[2]];
  };

  const activeBox = selectedBox !== null ? selectedBox : hoveredBox;

  return (
    <>
      {boxTextures.map((texture, index) => (
        <mesh 
          key={index}
          ref={boxRefs[index]} 
          material={materials[index]}
          position={getBoxPosition(index)}
          onClick={handleClick(index)}
          onPointerMove={handlePointerMove(index)}
          onPointerOut={handlePointerOut}
        >
          <boxGeometry args={[6, 4, 0.1]} />
        </mesh>
      ))}
      
      {activeBox !== null && (
        <Html position={getAnnotationPosition(activeBox)}>
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

export default function CubeSwitcher() {
  const [boxTextures, setBoxTextures] = useState<TextureType[]>([
    "flower", "mahkota", "himawari"
  ]);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [hoveredBox, setHoveredBox] = useState<number | null>(null);

  const textures: { label: string; value: TextureType; image: string }[] = [
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

  const handleBoxClick = (boxIndex: number) => {
    setSelectedBox(boxIndex);
  };

  const handleTextureChange = (texture: TextureType) => {
    if (selectedBox === null) return;
    const newTextures = [...boxTextures];
    newTextures[selectedBox] = texture;
    setBoxTextures(newTextures);
  };

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background/80 to-transparent backdrop-blur-sm border-b border-primary/20 z-20">
        <div className="h-full px-6 flex items-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_hsl(var(--primary))]" />
            <h1 className="text-xl font-bold tracking-wider text-primary uppercase">
              Texture Control System
            </h1>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 bg-background/95 backdrop-blur-md border-t border-primary/30 shadow-[0_-5px_30px_hsl(var(--primary)/0.3)]">
        <div className="px-6 py-4">
          {selectedBox !== null && (
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-primary/20">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              <h3 className="text-sm font-bold tracking-wide text-primary uppercase">
                {boxNames[selectedBox]}
              </h3>
            </div>
          )}
          
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center">
            {textures.map((texture) => (
              <button
                key={texture.value}
                onClick={() => handleTextureChange(texture.value)}
                disabled={selectedBox === null}
                className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  selectedBox !== null && boxTextures[selectedBox] === texture.value
                    ? "border-primary shadow-[0_0_20px_hsl(var(--primary)/0.8)] scale-110"
                    : "border-border hover:border-primary/50 hover:scale-105"
                } ${selectedBox === null ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <img 
                  src={texture.image} 
                  alt={texture.label}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent flex items-end justify-center pb-2">
                  <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                    {texture.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
          
          {selectedBox === null && (
            <div className="flex items-center justify-center gap-2 mt-3 pt-2 border-t border-primary/20">
              <div className="w-1 h-1 bg-accent rounded-full animate-pulse" />
              <p className="text-xs text-muted-foreground tracking-wide uppercase">
                Klik pagar untuk memilih
              </p>
            </div>
          )}
        </div>
      </div>

      <Canvas
        camera={{ position: [5, 3, 5], fov: 50 }}
        className="w-full h-full"
      >
        <color attach="background" args={["#050505"]} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.6} color="#00ffff" />
        <pointLight position={[0, 5, 0]} intensity={0.4} color="#ff00ff" />
        
        <Fence 
          boxTextures={boxTextures} 
          onBoxClick={handleBoxClick}
          hoveredBox={hoveredBox}
          setHoveredBox={setHoveredBox}
          selectedBox={selectedBox}
        />
        
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}
