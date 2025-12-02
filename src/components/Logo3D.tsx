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
    camera.position.set(10, 14, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

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

      const autoScale = (width / 80) / Math.max(size.x, size.y, size.z);
      model.scale.setScalar(autoScale * 4); // Bigger

      const center = new THREE.Vector3();
      box.getCenter(center);
      model.position.sub(center);

      pivot.add(model);
      pivot.position.set(0, -1, 1.5);

      renderer.render(scene, camera); // render once when loaded (idle mode)
    });

    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let velocityY = 0;
    let velocityZ = 0;
    let animationActive = false;

    const dom = renderer.domElement;

    const startAnimation = () => {
      if (animationActive) return;
      animationActive = true;
      animate();
    };

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
      velocityZ = dy * 0.01;

      pivot.rotation.y += velocityY;
      pivot.rotation.z += velocityZ;

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
      startAnimation();
    });

    dom.addEventListener("touchend", () => (isDragging = false));

    dom.addEventListener("touchmove", (e) => {
      if (!isDragging || !model) return;

      const dx = e.touches[0].clientX - lastTouchX;
      const dy = e.touches[0].clientY - lastTouchY;

      velocityY = dx * 0.01;
      velocityZ = dy * 0.01;

      pivot.rotation.y += velocityY;
      pivot.rotation.z += velocityZ;

      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
    });

    const animate = () => {
      if (!animationActive) return;

      if (!isDragging) {
        velocityY *= 0.92; // inertia slowdown
        velocityZ *= 0.92;

        pivot.rotation.y += velocityY;
        pivot.rotation.z += velocityZ;

        if (Math.abs(velocityY) < 0.0001 && Math.abs(velocityZ) < 0.0001) {
          animationActive = false;
          return;
        }
      }

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    // RESIZE HANDLING
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
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [modelPath]);

  return (
    <div ref={mountRef} className="w-[300px] md:w-[420px] h-[260px] md:h-[300px] mx-auto" />
  );
}
