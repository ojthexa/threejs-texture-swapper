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

    // Wrapper group agar pivot tepat center
    const pivot = new THREE.Group();
    scene.add(pivot);

    let logoMesh: THREE.Group | null = null;

    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;

        // Auto-center model pivot
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center); // geser model agar center = 0,0,0

        model.scale.set(scale, scale, scale);

        logoMesh = model;
        pivot.add(model);
      },
      undefined,
      (err) => console.error("Failed to load GLB:", err)
    );

    // === Animation states ===
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
          spinProgress += 0.12;
          pivot.rotation.y = spinProgress;
        } else if (isHover) {
          pivot.rotation.y += 0.06;
          pivot.rotation.x = Math.sin(t / 600) * 0.025;
        } else {
          pivot.rotation.y += 0.015;
          pivot.rotation.x += (0 - pivot.rotation.x) * 0.05;
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
      className="w-full h-[320px] md:h-[380px] lg:h-[420px]"
    />
  );
}
