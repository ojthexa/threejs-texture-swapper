import { Canvas, useThree, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, useTexture, Html, Line } from "@react-three/drei";
import { useState, useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

type TextureType = "flower" | "mahkota" | "himawari" | "taurus" | "metal" | "sulur" | "ranting" | "spinach" | "shuriken";

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
  selectedBox
}: { 
  boxTextures: TextureType[];
  colorOverlays: ColorOverlay[];
  onBoxClick: (boxIndex: number) => void;
  hoveredBox: number | null;
  setHoveredBox: (index: number | null) => void;
  selectedBox: number | null;
}) {
  const boxRefs = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)];
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
    return boxTextures.map((textureType, index) => {
      const texture = textureMap[textureType];
      const overlay = colorOverlays[index];
      
      // Configure texture wrapping and tiling
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 2);
      texture.offset.set(0, 0);
      texture.center.set(0, 0);
      texture.needsUpdate = true;
      
      // Parse hex color to RGB
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255
        } : { r: 1, g: 1, b: 1 };
      };
      
      const rgb = hexToRgb(overlay.color);
      const opacity = overlay.opacity;
      
      // Blend the color with white based on opacity (multiply blend effect)
      const blendedColor = new THREE.Color(
        1 - opacity + rgb.r * opacity,
        1 - opacity + rgb.g * opacity,
        1 - opacity + rgb.b * opacity
      );
      
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        color: blendedColor,
        metalness: 0.3,
        roughness: 0.7,
        transparent: textureType === 'shuriken',
      });
      
      return material;
    });
  }, [boxTextures, colorOverlays, flowerTexture, mahkotaTexture, himawariTexture, taurusTexture, metalTexture, sulurTexture, rantingTexture, spinachTexture, shurikenTexture]);

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

  // Panel positions forming a surrounding fence
  const panelConfigs: { position: [number, number, number]; rotation: [number, number, number] }[] = [
    { position: [0, 0, -4], rotation: [0, 0, 0] },           // Panel Depan
    { position: [4, 0, 0], rotation: [0, Math.PI / 2, 0] },  // Panel Kanan
    { position: [0, 0, 4], rotation: [0, Math.PI, 0] },      // Panel Belakang
    { position: [-4, 0, 0], rotation: [0, -Math.PI / 2, 0] } // Panel Kiri
  ];

  const getAnnotationPosition = (boxIndex: number): [number, number, number] => {
    const pos = panelConfigs[boxIndex].position;
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
          position={panelConfigs[index].position}
          rotation={panelConfigs[index].rotation}
          onClick={handleClick(index)}
          onPointerMove={handlePointerMove(index)}
          onPointerOut={handlePointerOut}
        >
          <boxGeometry args={[8, 4, 0.1]} />
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

function ColorPicker({ 
  color, 
  opacity,
  onColorChange, 
  onOpacityChange,
  disabled 
}: { 
  color: string; 
  opacity: number;
  onColorChange: (color: string) => void;
  onOpacityChange: (opacity: number) => void;
  disabled: boolean;
}) {
  return (
    <div className={`flex flex-col gap-3 p-4 bg-background/90 backdrop-blur-md rounded-xl border-2 border-primary/30 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
        <span className="text-xs font-bold text-foreground uppercase tracking-wider">Color Tint</span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            disabled={disabled}
            className="w-12 h-12 rounded-lg cursor-pointer border-2 border-primary/50 bg-transparent"
            style={{ 
              WebkitAppearance: 'none',
              padding: 0,
            }}
          />
          <div 
            className="absolute inset-0 rounded-lg pointer-events-none border-2 border-primary/30"
            style={{ backgroundColor: color }}
          />
        </div>
        
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Intensity</label>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity * 100}
            onChange={(e) => onOpacityChange(Number(e.target.value) / 100)}
            disabled={disabled}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <span className="text-[10px] text-muted-foreground text-right">{Math.round(opacity * 100)}%</span>
        </div>
      </div>
      
      <button
        onClick={() => {
          onColorChange('#ffffff');
          onOpacityChange(0);
        }}
        disabled={disabled}
        className="text-[10px] text-muted-foreground hover:text-primary transition-colors uppercase tracking-wide"
      >
        Reset Color
      </button>
    </div>
  );
}

export default function CubeSwitcher() {
  const [boxTextures, setBoxTextures] = useState<TextureType[]>([
    "flower", "mahkota", "himawari", "taurus"
  ]);
  const [colorOverlays, setColorOverlays] = useState<ColorOverlay[]>([
    { color: '#ffffff', opacity: 1 },
    { color: '#ffffff', opacity: 1 },
    { color: '#ffffff', opacity: 1 },
    { color: '#ffffff', opacity: 1 },
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

  const handleColorChange = (color: string) => {
    if (selectedBox === null) return;
    const newOverlays = [...colorOverlays];
    newOverlays[selectedBox] = { ...newOverlays[selectedBox], color };
    setColorOverlays(newOverlays);
  };

  const handleOpacityChange = (opacity: number) => {
    if (selectedBox === null) return;
    const newOverlays = [...colorOverlays];
    newOverlays[selectedBox] = { ...newOverlays[selectedBox], opacity };
    setColorOverlays(newOverlays);
  };

  const currentColor = selectedBox !== null ? colorOverlays[selectedBox].color : '#ffffff';
  const currentOpacity = selectedBox !== null ? colorOverlays[selectedBox].opacity : 0;

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background/80 to-transparent backdrop-blur-sm border-b border-primary/20 z-20">
        <div className="h-full px-6 flex items-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_hsl(var(--primary))]" />
              <img 
              src={logo}
              alt="GRC Logo"
              className="h-6 md:h-8 object-contain opacity-90 hover:opacity-100 transition duration-200"
              />
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
          
          <div className="flex gap-4 items-start">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide flex-1">
              {textures.map((texture) => (
                <button
                  key={texture.value}
                  onClick={() => handleTextureChange(texture.value)}
                  disabled={selectedBox === null}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
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
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent flex items-end justify-center pb-1">
                    <span className="text-[9px] font-bold text-foreground uppercase tracking-wider">
                      {texture.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            
            <ColorPicker
              color={currentColor}
              opacity={currentOpacity}
              onColorChange={handleColorChange}
              onOpacityChange={handleOpacityChange}
              disabled={selectedBox === null}
            />
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

      <div className="absolute inset-0 bottom-48">
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
          colorOverlays={colorOverlays}
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
    </div>
  );
}