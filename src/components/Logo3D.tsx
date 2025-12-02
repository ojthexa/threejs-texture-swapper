import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 0, 6);

    // === Renderer ===
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);

    // === Lights ===
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const directional = new THREE.DirectionalLight(0xffffff, 1);
    directional.position.set(3, 5, 8);
    scene.add(directional);

    // === Load GLB ===
    const loader = new GLTFLoader();
    let logo: THREE.Group | null = null;

    loader.load(
      modelPath,
      (gltf) => {
        logo = gltf.scene;
        logo.scale.set(scale, scale, scale);
        logo.rotation.set(0.1, 0, 0);

        // Tambah ketebalan (extrusion effect fake)
        logo.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = new THREE.MeshStandardMaterial({
              color: child.material.color,
              metalness: 0.2,
              roughness: 0.4,
            });
          }
        });

        scene.add(logo);
      },
      undefined,
      (err) => console.error("GLB load error:", err)
    );

    // === Interaction ===
    let isHover = false;
    let isHold = false;
    let spinProgress = 0;

    const dom = renderer.domElement;

    const handleEnter = () => (isHover = true);
    const handleLeave = () => {
      isHover = false;
      isHold = false;
      spinProgress = 0;
    };
    const handleDown = () => (isHold = true);
    const handleUp = () => (isHold = false);

    dom.addEventListener("mouseenter", handleEnter);
    dom.addEventListener("mouseleave", handleLeave);
    dom.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);

    // === Animation Loop ===
    const animate = (time: number) => {
      if (logo) {
        if (isHold) {
          spinProgress += 0.12;
          logo.rotation.y = spinProgress;
        } else if (isHover) {
          logo.rotation.y += 0.06;
          logo.rotation.x = Math.sin(time / 600) * 0.03;
        } else {
          logo.rotation.y += 0.01;
          logo.rotation.x += (0 - logo.rotation.x) * 0.05;
        }
      }

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    // === Resize ===
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // === Cleanup ===
    return () => {
      window.removeEventListener("resize", handleResize);
      dom.removeEventListener("mouseenter", handleEnter);
      dom.removeEventListener("mouseleave", handleLeave);
      dom.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      renderer.dispose();
      renderer.forceContextLoss();

      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [modelPath, scale]);

  return <div ref={mountRef} className="w-[260px] h-[260px]" />;
}
