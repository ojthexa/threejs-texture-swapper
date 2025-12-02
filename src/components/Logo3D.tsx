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
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    // === Renderer ===
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);

    // === Lights ===
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(4, 8, 6);

    scene.add(ambient);
    scene.add(dir);

    // === Pivot group (ini yang kita putar) ===
    const pivot = new THREE.Group();
    scene.add(pivot);

    let model: THREE.Group | null = null;

    // === Load GLB ===
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        model = gltf.scene;

        // Pastikan transform sudah diproses
        model.updateMatrixWorld(true);

        // --- FIX: CENTER PIVOT 100% ---
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);

        // Geser seluruh GLB agar pivot tepat di tengah
        model.position.x += (model.position.x - center.x);
        model.position.y += (model.position.y - center.y);
        model.position.z += (model.position.z - center.z);

        // Scale
        model.scale.set(scale, scale, scale);

        pivot.add(model);
      },
      undefined,
      (err) => console.error("GLB Load Error:", err)
    );

    // === Interaction STATE ===
    let isHover = false;

    // === DOM Events ===
    const dom = renderer.domElement;

    const onEnter = () => (isHover = true);
    const onLeave = () => {
      isHover = false;
      // Reset rotasi ketika mouse keluar
      pivot.rotation.set(0, 0, 0);
    };

    dom.addEventListener("mouseenter", onEnter);
    dom.addEventListener("mouseleave", onLeave);

    // === Animation ===
    const animate = (time: number) => {
      if (model) {
        if (isHover) {
          // HOVER → Putar
          pivot.rotation.y += 0.05;
          pivot.rotation.x = Math.sin(time / 400) * 0.03;
        } else {
          // TIDAK HOVER → DIAM TOTAL
          // (tanpa idle rotation)
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

    // === Cleanup ===
    return () => {
      window.removeEventListener("resize", onResize);
      dom.removeEventListener("mouseenter", onEnter);
      dom.removeEventListener("mouseleave", onLeave);

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
      className="w-full h-[300px] md:h-[360px] lg:h-[420px]"
    />
  );
}
