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

    const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const directional = new THREE.DirectionalLight(0xffffff, 1.3);
    directional.position.set(4, 6, 8);
    scene.add(directional);

    const pivot = new THREE.Group();
    scene.add(pivot);

    let model = null;

    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
      model = gltf.scene;

      /** --- NORMALIZING MODEL --- */
      const box = new THREE.Box3().setFromObject(model);
      const center = new THREE.Vector3();
      box.getCenter(center);
      model.position.sub(center);

      const sphere = new THREE.Sphere();
      box.getBoundingSphere(sphere);

      /** --- FIXED SCALE (slightly smaller + proportional) --- */
      const scaleFactor = (mountRef.current.clientWidth / 200) / sphere.radius;
      model.scale.setScalar(scaleFactor * 1.15);

      pivot.add(model);

      // Recalculate bounding after scale for perfect pivot correction
      requestAnimationFrame(() => {
        const newBox = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        newBox.getSize(size);

        /** --- PERFECT CENTER OFFSET --- */
        pivot.position.x = -size.x * 0.18; // adjust balance
        pivot.position.y = -size.y * 0.1; // slightly lower for better framing
      });

      /** --- CAMERA ADJUSTED TO AVOID CROPPING EVEN DURING ROTATION --- */
      const idealDistance = sphere.radius * 3.6;
      camera.position.set(0, sphere.radius * 0.35, idealDistance);
      camera.lookAt(0, 0, 0);
    });

    // ===== INTERACTION & SMOOTH ANIMATION =====
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
    dom.addEventListener("touchstart", (e) => {
      isDragging = true;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
    });

    dom.addEventListener("touchend", () => (isDragging = false));

    dom.addEventListener("touchmove", (e) => {
      if (!isDragging || !model) return;
      const dx = e.touches[0].clientX - lastX;
      const dy = e.touches[0].clientY - lastY;
      velY = dx * 0.01;
      velX = dy * 0.01;
      pivot.rotation.y += velY;
      pivot.rotation.x += velX;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
    });

    const restRotation = { x: 0, y: 0, z: 0 };

    const animate = () => {
      if (model) {
        velX *= 0.94;
        velY *= 0.94;

        if (!isDragging) {
          pivot.rotation.y += velY;
          pivot.rotation.x += velX;
        }

        // prevent full upside-down
        pivot.rotation.x = Math.max(-0.7, Math.min(0.7, pivot.rotation.x));

        // Auto return
        if (!isDragging && !isHover && Math.abs(velX) < 0.002 && Math.abs(velY) < 0.002) {
          pivot.rotation.x += (restRotation.x - pivot.rotation.x) * 0.06;
          pivot.rotation.y += (restRotation.y - pivot.rotation.y) * 0.06;
          pivot.rotation.z += (restRotation.z - pivot.rotation.z) * 0.06;
        }
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
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [modelPath]);

  return (
    <div
      ref={mountRef}
      className="w-[320px] md:w-[500px] lg:w-[550px] h-[200px] md:h-[260px] lg:h-[300px] mx-auto flex items-center justify-center"
    />
  );
}
