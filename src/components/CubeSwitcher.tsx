import { Canvas, useThree, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, useTexture, Html, Line } from "@react-three/drei";
import { useState, useMemo, useRef } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";

type TextureType = "wood" | "brick" | "marble" | "bamboo" | "ornament" | "strip";

const faceNames = ["Kanan", "Kiri", "Atas", "Bawah", "Depan", "Belakang"];

function Cube({ 
  faceTextures, 
  onFaceClick,
  hoveredFace,
  setHoveredFace,
  selectedFace
}: { 
  faceTextures: TextureType[];
  onFaceClick: (faceIndex: number) => void;
  hoveredFace: number | null;
  setHoveredFace: (index: number | null) => void;
  selectedFace: number | null;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, raycaster, pointer } = useThree();
  
  const textureNames = {
    wood: "Kayu",
    brick: "Batu Bata",
    marble: "Marmer",
    bamboo: "Bambu",
    ornament: "Ornamen",
    strip: "Strip",
  };
  
  const woodTexture = useTexture("/wood.jpg");
  const brickTexture = useTexture("/brick.jpg");
  const marbleTexture = useTexture("/marble.jpg");
  const bambooTexture = useTexture("/bamboo.jpg");
  const ornamentTexture = useTexture("/ornament.jpg");
  const stripTexture = useTexture("/strip.jpg");

  const textureMap = {
    wood: woodTexture,
    brick: brickTexture,
    marble: marbleTexture,
    bamboo: bambooTexture,
    ornament: ornamentTexture,
    strip: stripTexture,
  };

  const materials = useMemo(() => {
    return faceTextures.map((textureType) => {
      const material = new THREE.MeshStandardMaterial({
        map: textureMap[textureType],
        metalness: 0.2,
        roughness: 0.8,
      });
      material.map!.wrapS = THREE.RepeatWrapping;
      material.map!.wrapT = THREE.RepeatWrapping;
      material.needsUpdate = true;
      return material;
    });
  }, [faceTextures, woodTexture, brickTexture, marbleTexture, bambooTexture, ornamentTexture, stripTexture]);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (!meshRef.current) return;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(meshRef.current);
    
    if (intersects.length > 0) {
      const faceIndex = Math.floor(intersects[0].faceIndex! / 2);
      onFaceClick(faceIndex);
    }
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (!meshRef.current) return;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(meshRef.current);
    
    if (intersects.length > 0) {
      const faceIndex = Math.floor(intersects[0].faceIndex! / 2);
      setHoveredFace(faceIndex);
    } else {
      setHoveredFace(null);
    }
  };

  const handlePointerOut = () => {
    setHoveredFace(null);
  };

  const getFaceCenter = (faceIndex: number): [number, number, number] => {
    const positions: [number, number, number][] = [
      [1, 0, 0],    // Right (Kanan)
      [-1, 0, 0],   // Left (Kiri)
      [0, 1, 0],    // Top (Atas)
      [0, -1, 0],   // Bottom (Bawah)
      [0, 0, 1],    // Front (Depan)
      [0, 0, -1],   // Back (Belakang)
    ];
    return positions[faceIndex];
  };

  const getBendPoint = (faceIndex: number): [number, number, number] => {
    const center = getFaceCenter(faceIndex);
    return [
      center[0] * 1.3,
      center[1] * 1.3 + 0.5,
      center[2] * 1.3
    ];
  };

  const getAnnotationPosition = (faceIndex: number): [number, number, number] => {
    const center = getFaceCenter(faceIndex);
    const bendPoint = getBendPoint(faceIndex);
    return [center[0] * 1.5, bendPoint[1], center[2] * 1.5];
  };

  const activeFace = selectedFace !== null ? selectedFace : hoveredFace;

  return (
    <>
      <mesh 
        ref={meshRef} 
        material={materials}
        onClick={handleClick}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[2, 2, 2]} />
      </mesh>
      
      {activeFace !== null && (
        <>
          <Line
            points={[
              getFaceCenter(activeFace), 
              getBendPoint(activeFace),
              getAnnotationPosition(activeFace)
            ]}
            color="#00ffff"
            lineWidth={2}
            dashed={false}
          />
          <Html position={getAnnotationPosition(activeFace)}>
            <div className="bg-background/95 backdrop-blur-md border-2 border-primary px-4 py-2 rounded-lg shadow-[0_0_20px_hsl(var(--primary)/0.5)] whitespace-nowrap pointer-events-none">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-bold text-primary uppercase tracking-wider">
                  {faceNames[activeFace]}: {textureNames[faceTextures[activeFace]]}
                </span>
              </div>
            </div>
          </Html>
        </>
      )}
    </>
  );
}

export default function CubeSwitcher() {
  const [faceTextures, setFaceTextures] = useState<TextureType[]>([
    "wood", "wood", "wood", "wood", "wood", "wood"
  ]);
  const [selectedFace, setSelectedFace] = useState<number | null>(null);
  const [hoveredFace, setHoveredFace] = useState<number | null>(null);

  const textures: { label: string; value: TextureType }[] = [
    { label: "Kayu", value: "wood" },
    { label: "Batu Bata", value: "brick" },
    { label: "Marmer", value: "marble" },
    { label: "Bambu", value: "bamboo" },
    { label: "Ornamen", value: "ornament" },
    { label: "Strip", value: "strip" },
  ];

  const handleFaceClick = (faceIndex: number) => {
    setSelectedFace(faceIndex);
  };

  const handleTextureChange = (texture: TextureType) => {
    if (selectedFace === null) return;
    const newTextures = [...faceTextures];
    newTextures[selectedFace] = texture;
    setFaceTextures(newTextures);
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

      {selectedFace !== null && (
        <div className="absolute top-24 left-6 z-10 bg-background/90 backdrop-blur-md border border-primary/30 rounded-lg p-4 shadow-[0_0_20px_hsl(var(--primary)/0.3)] min-w-[280px]">
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-primary/20">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            <h3 className="text-sm font-bold tracking-wide text-primary uppercase">
              {faceNames[selectedFace]}
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {textures.map((texture) => (
              <Button
                key={texture.value}
                onClick={() => handleTextureChange(texture.value)}
                variant={faceTextures[selectedFace] === texture.value ? "default" : "secondary"}
                className="font-medium text-xs uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_hsl(var(--primary)/0.5)]"
              >
                {texture.label}
              </Button>
            ))}
          </div>
          
          <Button
            onClick={() => setSelectedFace(null)}
            variant="outline"
            className="w-full mt-3 text-xs uppercase tracking-wider border-primary/30 hover:bg-primary/10"
          >
            Tutup
          </Button>
        </div>
      )}

      <div className="absolute bottom-6 left-6 z-10 bg-background/80 backdrop-blur-md border border-primary/30 rounded-lg p-3 shadow-[0_0_20px_hsl(var(--primary)/0.2)]">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-accent rounded-full animate-pulse" />
          <p className="text-xs text-muted-foreground tracking-wide uppercase">
            Klik sisi kubus untuk mengedit
          </p>
        </div>
      </div>

      <Canvas
        camera={{ position: [4, 4, 4], fov: 50 }}
        className="w-full h-full"
      >
        <color attach="background" args={["#050505"]} />
        
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} color="#00ffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.6} color="#00ffff" />
        <pointLight position={[0, 5, 0]} intensity={0.3} color="#ff00ff" />
        
        <Cube 
          faceTextures={faceTextures} 
          onFaceClick={handleFaceClick}
          hoveredFace={hoveredFace}
          setHoveredFace={setHoveredFace}
          selectedFace={selectedFace}
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
