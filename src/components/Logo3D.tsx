import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

interface Logo3DProps {
  modelPath: string;
}

export default function Logo3D({ modelPath }: Logo3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // === Scene ===
    const scene = new THREE.Scene();

    // === Camera ===
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7); // TURUNKAN kamera agar logo tidak terlalu ke atas

    // === Renderer ===
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);

    // === Lights ===
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dir = new THREE.DirectionalLight(0xffffff, 1.3);
    dir.position.set(4, 6, 8);
    scene.add(dir);

    // === PIVOT (yang diputar) ===
    const pivot = new THREE.Group();
    scene.add(pivot);

    let model: THREE.Group | null = null;

    // === Load GLB ===
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        model = gltf.scene;
        model.updateMatrixWorld(true);

        // === Hitung bounding box === 
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);

        // === SCALE otomatis agar tidak terlalu besar ===
        const maxSize = Math.max(size.x, size.y, size.z);
        const desiredSize = 4; // semakin kecil semakin kecil LOGO
        const autoScale = desiredSize / maxSize;

        model.scale.set(autoScale, autoScale, autoScale);

        // === CENTER PIVOT ===
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center);

        pivot.add(model);
      },
      undefined,
      (err) => console.error("GLB Error:", err)
    );

    // === HOVER STATE ===
    let isHover = false;

    const dom = renderer.domElement;

    dom.addEventListener("mouseenter", () => (isHover = true));
    dom.addEventListener("mouseleave", () => {
      isHover = false;
      pivot.rotation.set(0, 0, 0);
    });

    // === ANIMATION ===
    const animate = () => {
      if (isHover && model) {
        pivot.rotation.y += 0.045; // rotasi saat hover
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

    // === Cleanup ===
    return () => {
      window.removeEventListener("resize", onResize);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }

      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [modelPath]);

  return (
    <div
      ref={mountRef}
      className="w-full h-[120px] md:h-[180px] lg:h-[200px] flex items-center justify-center"
    />
  );
}
