import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Logo3DProps {
  image: string;
  size?: number;
}

export default function Logo3D({ image, size = 3 }: Logo3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    /** ---------------------------
     *  BASIC SETUP
     * --------------------------*/
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(400, 400);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    /** ---------------------------
     *  LIGHTING
     * --------------------------*/
    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(5, 5, 5);
    scene.add(light);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    /** ---------------------------
     *  LOAD LOGO AS TEXTURE
     * --------------------------*/
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(image);

    // 3D plane with texture
    const geometry = new THREE.BoxGeometry(size, size, 0.3);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.4,
      metalness: 0.1,
    });

    const logoMesh = new THREE.Mesh(geometry, material);
    scene.add(logoMesh);

    /** ---------------------------
     *  INTERACTIONS
     * --------------------------*/
    let hover = false;
    let hold = false;
    let holdProgress = 0;

    const dom = renderer.domElement;

    dom.addEventListener("mouseenter", () => (hover = true));
    dom.addEventListener("mouseleave", () => {
      hover = false;
      hold = false;
      holdProgress = 0;
    });

    dom.addEventListener("mousedown", () => (hold = true));
    dom.addEventListener("mouseup", () => {
      hold = false;
      holdProgress = 0;
    });

    /** ---------------------------
     *  ANIMATION LOOP
     * --------------------------*/
    const animate = () => {
      requestAnimationFrame(animate);

      if (hold) {
        // Full 360 spin animation
        holdProgress += 0.06;
        logoMesh.rotation.y = holdProgress;

        if (holdProgress >= Math.PI * 2) {
          holdProgress = 0; // reset
        }
      } else if (hover) {
        // Small tilt when hovering
        logoMesh.rotation.y += 0.03;
      } else {
        // Return to original rotation
        logoMesh.rotation.y += (0 - logoMesh.rotation.y) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    /** Cleanup */
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [image, size]);

  return (
    <div
      ref={mountRef}
      style={{
        width: 400,
        height: 400,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );
}
