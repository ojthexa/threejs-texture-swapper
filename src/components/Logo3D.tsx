// Logo3D.tsx
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Logo3DProps {
  image: string;
  size?: number;
}

export default function Logo3D({ image, size = 3 }: Logo3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene + Camera
    const scene = new THREE.Scene();
    const width = mountRef.current.clientWidth || 400;
    const height = mountRef.current.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 9;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(width, height);

    // FIX: replacement for old outputEncoding
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const pointLight = new THREE.PointLight(0xffffff, 1.0);
    pointLight.position.set(5, 5, 10);
    scene.add(pointLight);

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    // Texture
    const loader = new THREE.TextureLoader();
    const texture = loader.load(image);
    texture.colorSpace = THREE.SRGBColorSpace;

    // 3D Thick Logo
    const geometry = new THREE.BoxGeometry(size, size, 0.4);

    const sideMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const frontMaterial = new THREE.MeshStandardMaterial({ map: texture });
    const backMaterial = new THREE.MeshStandardMaterial({ map: texture });

    const materials = [
      sideMaterial,
      sideMaterial,
      sideMaterial,
      sideMaterial,
      frontMaterial,
      backMaterial,
    ];

    const logoMesh = new THREE.Mesh(geometry, materials);
    logoMesh.castShadow = true;
    logoMesh.receiveShadow = true;
    scene.add(logoMesh);

    // Interaction Flags
    let isHovering = false;
    let isHolding = false;
    let holdProgress = 0;
    const idleSpeed = 0.005;

    // Resize Handling
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Mouse Events
    const dom = renderer.domElement;

    dom.addEventListener("mouseenter", () => (isHovering = true));
    dom.addEventListener("mouseleave", () => {
      isHovering = false;
      isHolding = false;
      holdProgress = 0;
    });
    dom.addEventListener("mousedown", () => {
      isHolding = true;
      holdProgress = 0;
    });
    window.addEventListener("mouseup", () => {
      isHolding = false;
      holdProgress = 0;
    });

    // Animation Loop
    const animate = (time: number) => {
      if (isHolding) {
        holdProgress += 0.12;
        logoMesh.rotation.y = holdProgress;
      } else if (isHovering) {
        logoMesh.rotation.y += 0.06;
        logoMesh.rotation.x = Math.sin(time / 600) * 0.03;
      } else {
        logoMesh.rotation.y += idleSpeed;
        logoMesh.rotation.x += (0 - logoMesh.rotation.x) * 0.05;
      }

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      dom.removeEventListener("mouseenter", () => {});
      dom.removeEventListener("mouseleave", () => {});
      dom.removeEventListener("mousedown", () => {});
      window.removeEventListener("mouseup", () => {});
      window.removeEventListener("resize", handleResize);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      geometry.dispose();
      texture.dispose();
      sideMaterial.dispose();
      frontMaterial.dispose();
      backMaterial.dispose();

      renderer.forceContextLoss();
      renderer.dispose();

      if (
        mountRef.current &&
        renderer.domElement.parentElement === mountRef.current
      ) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [image, size]);

  return (
    <div
      ref={mountRef}
      className="w-[240px] h-[240px]"
      style={{ width: 240, height: 240 }}
    />
  );
}
