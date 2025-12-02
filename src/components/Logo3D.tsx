import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

interface Logo3DProps {
  modelPath: string;
  scale?: number;
}

export default function Logo3D({ modelPath, scale = 2 }: Logo3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // === Scene ===
    const scene = new THREE.Scene();

    // === Camera ===
    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0, 7);

    // === Renderer ===
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);

    // === Lights ===
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(4, 8, 6);
    scene.add(dir);

    // === GLB Loader ===
    const loader = new GLTFLoader();

    // Pivot group for centered rotation
    const pivot = new THREE.Group();
    scene.add(pivot);

    let logoMesh: THREE.Group | null = null;

    loader.load(
      modelPath,
      (gltf) => {
        const original = gltf.scene;

        // Temukan mesh utama (bukan group kosong)
        let mesh: THREE.Object3D | null = null;

        original.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            mesh = child;
          }
        });

        if (!mesh) {
          console.error("No mesh found in GLB!");
          return;
        }

        // Clone mesh agar pivot bisa dipindah tanpa merusak struktur GLB
        const fixedMesh = mesh.clone(true);

        // Hitung bounding box untuk mesh sebenarnya
        const box = new THREE.Box3().setFromObject(fixedMesh);
        const center = new THREE.Vector3();
        box.getCenter(center);

        // Geser mesh agar center = 0,0,0
        fixedMesh.position.sub(center);

        // Scale
        fixedMesh.scale.set(scale, scale, scale);

        // Tambahkan ke pivot (untuk rotasi)
        pivot.add(fixedMesh);

        logoMesh = fixedMesh;
      },
      undefined,
      (err) => console.error("Failed to load GLB:", err)
    );

    // === Interaction States ===
    let isHover = false;
    let isHold = false;
    let spinProgress = 0;

    // === DOM Events ===
    const dom = renderer.domElement;

    const onEnter = () => (isHover = true);
    const onLeave = () => {
      isHover = false;
      isHold = false;
      spinProgress = 0;

      // Reset rotation when not hovered
      pivot.rotation.x = 0;
      pivot.rotation.y = 0;
    };

    const onDown = () => (isHold = true);
    const onUp = () => (isHold = false);

    dom.addEventListener("mouseenter", onEnter);
    dom.addEventListener("mouseleave", onLeave);
    dom.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    // === Animation Loop ===
    const animate = (t: number) => {
      if (logoMesh) {
        if (isHold) {
          // HOLD → continuous 360° spin
          spinProgress += 0.12;
          pivot.rotation.y = spinProgress;
        } else if (isHover) {
          // HOVER → gentle rotation + subtle wobble
          pivot.rotation.y += 0.06;
          pivot.rotation.x = Math.sin(t / 400) * 0.03;
        } else {
          // IDLE → NO ROTATION
          // Keep the logo steady
        }
      }

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    // === Resize ===
    const onResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", onResize);
      dom.removeEventListener("mouseenter", onEnter);
      dom.removeEventListener("mouseleave", onLeave);
      dom.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      renderer.dispose();
      renderer.forceContextLoss();

      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [modelPath, scale]);

  return (
    <div
      ref={mountRef}
      className="w-full h-[200px] md:h-[240px] lg:h-[300px] flex justify-center items-center"
    />
  );
}
