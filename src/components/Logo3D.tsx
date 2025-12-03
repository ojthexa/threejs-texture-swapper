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

    let width = mountRef.current.clientWidth;
    let height = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(26, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 11);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const directional = new THREE.DirectionalLight(0xffffff, 1.2);
    directional.position.set(4, 6, 8);
    scene.add(directional);

    const pivot = new THREE.Group();
    scene.add(pivot);

    let model = null;

    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
      model = gltf.scene;

      // Normalize pivot
      const box = new THREE.Box3().setFromObject(model);
      const center = new THREE.Vector3();
      box.getCenter(center);
      model.position.sub(center);

      const sphere = new THREE.Sphere();
      box.getBoundingSphere(sphere);

      // RESPONSIVE DYNAMIC SCALE
      const baseWidth = 400;
      const scaleMultiplier = Math.min(1.4, Math.max(0.65, width / baseWidth));
      model.scale.setScalar(scaleMultiplier * 0.75);

      pivot.add(model);

      // Recalculate pivot shift
      setTimeout(() => {
        const recalculatedBox = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        recalculatedBox.getSize(size);

        // Shift slightly (fine-tuned)
        pivot.position.x = -size.x * 0.02;
        pivot.position.y = -size.y * 0.03;
      });

      const idealDistance = sphere.radius * 3.5;
      camera.position.set(0, sphere.radius * 0.35, idealDistance);
      camera.lookAt(0, 0, 0);
    });

    // ===== INTERACTION =====
    let isDragging = false;
    let isHover = false;
    let lastX = 0;
    let lastY = 0;
    let velX = 0;
    let velY = 0;

    const dom = renderer.domElement;

    dom.addEventListener("mouseenter", () => (isHover = true));
    dom.addEventListener("mouseleave", () => { isHover = false; isDragging = false; });

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

    const defaultRotation = { x: 0, y: 0, z: 0 };

    const animate = () => {
      if (model) {
        velX *= 0.94;
        velY *= 0.94;

        if (!isDragging) {
          pivot.rotation.y += velY;
          pivot.rotation.x += velX;
        }

        pivot.rotation.x = Math.max(-0.75, Math.min(0.75, pivot.rotation.x));

        if (!isDragging && !isHover && Math.abs(velX) < 0.002 && Math.abs(velY) < 0.002) {
          pivot.rotation.x += (defaultRotation.x - pivot.rotation.x) * 0.06;
          pivot.rotation.y += (defaultRotation.y - pivot.rotation.y) * 0.06;
        }
      }

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    // ===== RESPONSIVE RESIZE =====
    const handleResize = () => {
      if (!mountRef.current) return;
      width = mountRef.current.clientWidth;
      height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [modelPath]);

  return (
    <div
      ref={mountRef}
      className="
        w-[260px] h-[180px]
        sm:w-[320px] sm:h-[220px]
        md:w-[420px] md:h-[280px]
        lg:w-[520px] lg:h-[330px]
        mx-auto
      "
    />
  );
}
