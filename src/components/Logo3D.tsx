import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default function Logo3D({ modelPath }) {
  const mountRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const dir = new THREE.DirectionalLight(0xffffff, 1.3);
    dir.position.set(3, 4, 6);
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

      const maxSize = Math.max(size.x, size.y, size.z);

      // 👉 Scale berdasarkan tinggi container supaya tidak kebesaran
      const scale = (mountRef.current.clientHeight / 120) / maxSize;
      model.scale.setScalar(scale);

      // Center model
      const center = new THREE.Vector3();
      box.getCenter(center);
      model.position.sub(center);

      // Reset rotation (posisi netral)
      model.rotation.set(0, 0, 0);

      pivot.add(model);
    });

    // Interaction variables
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let velocityY = 0;
    let velocityX = 0;
    let animationActive = false;

    const dom = renderer.domElement;

    const startAnimation = () => {
      if (!animationActive) {
        animationActive = true;
        animate();
      }
    };

    // Mouse control
    dom.addEventListener("mousedown", (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      startAnimation();
    });

    dom.addEventListener("mouseup", () => (isDragging = false));

    dom.addEventListener("mousemove", (e) => {
      if (!isDragging || !model) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;

      velocityY = dx * 0.01;
      velocityX = dy * 0.01;

      pivot.rotation.y += velocityY;
      pivot.rotation.x += velocityX;

      lastX = e.clientX;
      lastY = e.clientY;
    });

    // Touch support
    let lastTouchX = 0;
    let lastTouchY = 0;

    dom.addEventListener("touchstart", (e) => {
      isDragging = true;
      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
      startAnimation();
    });

    dom.addEventListener("touchend", () => (isDragging = false));

    dom.addEventListener("touchmove", (e) => {
      if (!isDragging || !model) return;

      const dx = e.touches[0].clientX - lastTouchX;
      const dy = e.touches[0].clientY - lastTouchY;

      velocityY = dx * 0.01;
      velocityX = dy * 0.01;

      pivot.rotation.y += velocityY;
      pivot.rotation.x += velocityX;

      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
    });

    // Animation loop (only when needed)
    const animate = () => {
      if (!animationActive) return;

      if (!isDragging) {
        velocityY *= 0.92;
        velocityX *= 0.92;
        pivot.rotation.y += velocityY;
        pivot.rotation.x += velocityX;

        if (Math.abs(velocityY) < 0.0002 && Math.abs(velocityX) < 0.0002) {
          animationActive = false;
        }
      }

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    // Resize handler
    const onResize = () => {
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
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [modelPath]);

  return (
    <div ref={mountRef} className="w-[300px] md:w-[420px] h-[280px] md:h-[320px] mx-auto" />
  );
}
