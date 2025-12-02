import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default function Logo3D({ modelPath }) {
  const mountRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Light setup
    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const dir = new THREE.DirectionalLight(0xffffff, 1.5);
    dir.position.set(4, 6, 8);
    scene.add(dir);

    const pivot = new THREE.Group();
    scene.add(pivot);

    let model = null;
    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
      model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);

      // Resize model proportionally to container
      const maxSize = Math.max(size.x, size.y, size.z);
      const autoScale = (mountRef.current.clientWidth / 300) / maxSize;
      model.scale.set(autoScale, autoScale, autoScale);

      const center = new THREE.Vector3();
      box.getCenter(center);
      model.position.sub(center);

      pivot.add(model);
    });

    // Interaction states
    let isHover = false;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    const dom = renderer.domElement;

    dom.addEventListener("mouseenter", () => (isHover = true));
    dom.addEventListener("mouseleave", () => {
      isHover = false;
      isDragging = false;
    });

    dom.addEventListener("mousedown", (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    });

    dom.addEventListener("mouseup", () => (isDragging = false));

    dom.addEventListener("mousemove", (e) => {
      if (isDragging && model) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        pivot.rotation.y += dx * 0.01;
        pivot.rotation.x += dy * 0.01;
        lastX = e.clientX;
        lastY = e.clientY;
      }
    });

    // Smooth animation system
    const animate = () => {
      if (model) {
        if (!isDragging) {
          // idle slow rotate
          pivot.rotation.y += isHover ? 0.03 : 0.005;
          if (isHover) {
            pivot.rotation.x += (Math.sin(Date.now() * 0.002) * 0.005);
          }
        }
      }
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      renderer.forceContextLoss();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [modelPath]);

  return (
    <div ref={mountRef} className="w-[300px] md:w-[420px] h-[260px] md:h-[300px] mx-auto" />
  );
}
