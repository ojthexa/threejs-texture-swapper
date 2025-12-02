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
  const dir = new THREE.DirectionalLight(0xffffff, 1.2);
  dir.position.set(3, 4, 6);
  scene.add(dir);

  const pivot = new THREE.Group();
  scene.add(pivot);

  let model = null;

  const loader = new GLTFLoader();
  loader.load(modelPath, (gltf) => {
  model = gltf.scene;

  // Setelah model.scale.setScalar(...)
  const box2 = new THREE.Box3().setFromObject(model);
  const size2 = new THREE.Vector3();
  box2.getSize(size2);
  pivot.position.x = -size2.x * 0.18;

  const sphere = new THREE.Sphere();
  box.getBoundingSphere(sphere);

  // 🔥 Scale stabil
  const scaleFactor = (mountRef.current.clientWidth / 150) / sphere.radius;
  model.scale.setScalar(scaleFactor * 1.5);

  pivot.add(model);

  // 📌 Geser posisi setelah scale (agar tepat)
  setTimeout(() => {
    pivot.position.x = sphere.radius * 0.35;  // lebih aman dari 0.8
  }, 10);

  // 🔥 Kamera otomatis pas & tidak cropping
  const idealDistance = sphere.radius * 3.2;
  camera.position.set(0, sphere.radius * 0.2, idealDistance);
  camera.lookAt(0, 0, 0);
});

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

  // TOUCH SUPPORT
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

  const targetRotation = { x: 0, y: 0, z: 0 };

  const animate = () => {
    if (!model) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }

    velX *= 0.93;
    velY *= 0.93;

    if (!isDragging) {
      pivot.rotation.y += velY;
      pivot.rotation.x += velX;
    }

    // ROTATION LIMIT (prevent upside down)
    pivot.rotation.x = Math.max(-0.8, Math.min(0.8, pivot.rotation.x));

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




