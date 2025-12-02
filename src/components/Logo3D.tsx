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

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
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
      const scale = (mountRef.current.clientHeight / 120) / maxSize;
      model.scale.setScalar(scale * 1.5);

      const center = new THREE.Vector3();
      box.getCenter(center);
      model.position.sub(center);

      model.rotation.set(0, 0, 0);

      pivot.add(model);
    });

    // Interaction
    let isDragging = false;
    let isHover = false;
    let lastX = 0;
    let lastY = 0;
    let velX = 0;
    let velY = 0;

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
      if (!isDragging || !model) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;

      velY = dx * 0.01;
      velX = dy * 0.01;

      pivot.rotation.y += velY;
      pivot.rotation.x += velX;

      lastX = e.clientX;
      lastY = e.clientY;
    });

    // Touch
    let lastTouchX = 0;
    let lastTouchY = 0;

    dom.addEventListener("touchstart", (e) => {
      isDragging = true;
      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
    });

    dom.addEventListener("touchend", () => (isDragging = false));

    dom.addEventListener("touchmove", (e) => {
      if (!isDragging || !model) return;

      const dx = e.touches[0].clientX - lastTouchX;
      const dy = e.touches[0].clientY - lastTouchY;

      velY = dx * 0.01;
      velX = dy * 0.01;

      pivot.rotation.y += velY;
      pivot.rotation.x += velX;

      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
    });

    // Target resting rotation (front facing)
    const targetRotation = { x: 0, y: 0, z: 0 };

    const animate = () => {
      if (!model) return;

      // inertia decay
      if (!isDragging) {
        velX *= 0.93;
        velY *= 0.93;
        pivot.rotation.y += velY;
        pivot.rotation.x += velX;
      }

      // Auto return to perfect front view when idle
      if (!isDragging && !isHover && Math.abs(velX) < 0.002 && Math.abs(velY) < 0.002) {
        pivot.rotation.x += (targetRotation.x - pivot.rotation.x) * 0.06;
        pivot.rotation.y += (targetRotation.y - pivot.rotation.y) * 0.06;
        pivot.rotation.z += (targetRotation.z - pivot.rotation.z) * 0.06;
      }

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", () => {
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [modelPath]);

  return (
    <div ref={mountRef} className="w-[300px] md:w-[420px] h-[280px] md:h-[320px] mx-auto" />
  );
}

