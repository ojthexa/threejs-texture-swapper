import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Logo3DProps {
  image: string;
  size?: number;
}

export default function Logo3D({ image, size = 3 }: Logo3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const logoMeshRef = useRef<THREE.Mesh>();

  useEffect(() => {
    // Scene
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current!.clientWidth / mountRef.current!.clientHeight,
      0.1,
      100
    );
    camera.position.z = 9;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(
      mountRef.current!.clientWidth,
      mountRef.current!.clientHeight
    );
    mountRef.current!.appendChild(renderer.domElement);

    // LIGHTING
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(5, 5, 10);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    // TEXTURE
    const texture = new THREE.TextureLoader().load(image);

    // GEOMETRY — memberi ketebalan 0.4
    const geometry = new THREE.BoxGeometry(size, size, 0.4);

    const materials = [
      new THREE.MeshStandardMaterial({ color: "#e0e0e0" }), // sisi samping
      new THREE.MeshStandardMaterial({ color: "#e0e0e0" }),
      new THREE.MeshStandardMaterial({ color: "#e0e0e0" }),
      new THREE.MeshStandardMaterial({ color: "#e0e0e0" }),
      new THREE.MeshStandardMaterial({ map: texture }), // depan
      new THREE.MeshStandardMaterial({ map: texture }), // belakang
    ];

    const logoMesh = new THREE.Mesh(geometry, materials);
    logoMeshRef.current = logoMesh;

    scene.add(logoMesh);

    // RENDER LOOP
    let frame = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      // Idle slow rotation
      if (!isHovering && !isHolding) {
        logoMesh.rotation.y += 0.005;
      }

      renderer.render(scene, camera);
    };
    animate();

    // EVENTS
    let isHovering = false;
    let isHolding = false;

    const handleHover = () => {
      isHovering = true;
      const start = logoMesh.rotation.y;
      const end = start + Math.PI * 2;

      const duration = 900; // ms
      const startTime = performance.now();

      const spin = (now: number) => {
        if (!isHovering || isHolding) return;

        const progress = Math.min((now - startTime) / duration, 1);
        const eased = progress < 1 ? 1 - Math.pow(1 - progress, 4) : 1;

        logoMesh.rotation.y = start + (end - start) * eased;

        if (progress < 1) requestAnimationFrame(spin);
      };

      requestAnimationFrame(spin);
    };

    const handleHold = () => {
      isHolding = true;
      const start = logoMesh.rotation.y;
      const end = start + Math.PI * 2;

      const duration = 700;
      const startTime = performance.now();

      const spin = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = progress < 1 ? 1 - Math.pow(1 - progress, 4) : 1;

        logoMesh.rotation.y = start + (end - start) * eased;

        if (progress < 1) requestAnimationFrame(spin);
        else isHolding = false;
      };

      requestAnimationFrame(spin);
    };

    renderer.domElement.addEventListener("mouseenter", handleHover);
    renderer.domElement.addEventListener("mousedown", handleHold);
    renderer.domElement.addEventListener("mouseleave", () => {
      isHovering = false;
      isHolding = false;
    });

    // CLEANUP
    return () => {
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-[240px] h-[240px]" />;
}
