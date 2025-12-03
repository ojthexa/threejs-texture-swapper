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

    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
    camera.position.set(0, 0.3, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const directional = new THREE.DirectionalLight(0xffffff, 1.1);
    directional.position.set(4, 6, 8);
    scene.add(directional);

    const pivot = new THREE.Group();
    scene.add(pivot);

    let model = null;

    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
      model = gltf.scene;

      // Tentukan bounding box
      const box = new THREE.Box3().setFromObject(model);
      const center = new THREE.Vector3();
      box.getCenter(center);

      // Normalisasi pivot
      model.position.sub(center);

      // Hitung ulang setelah normalisasi
      const size = new THREE.Vector3();
      box.getSize(size);

      // --------------------------------------------
      // 💡 DETEKSI BLANK SPACE KIRI & KOMPENSASI
      // --------------------------------------------

      const min = box.min.x - center.x;  // jarak sisi kiri
      const max = box.max.x - center.x;  // jarak sisi kanan

      // Jika sisi kiri lebih luas → kompensasikan geseran
      if (Math.abs(min) > Math.abs(max)) {
        const offset = (Math.abs(min) - Math.abs(max)) * 0.5;
        model.position.x += offset;
      } else if (Math.abs(max) > Math.abs(min)) {
        const offset = (Math.abs(max) - Math.abs(min)) * 0.5;
        model.position.x -= offset;
      }

      // -----------------------------------------------------
      // 💡 Fine-tuning manual (GESER KE KANAN)
      // -----------------------------------------------------
      model.position.x += 0.13; 
      // Sesuaikan 0.05 → 0.06 / 0.07 untuk lebih geser kanan

      // bounding sphere for scaling
      const sphere = new THREE.Sphere();
      box.getBoundingSphere(sphere);

      const scaleFactor = 1.45 / sphere.radius;
      model.scale.setScalar(scaleFactor);

      pivot.add(model);

      pivot.position.set(0, 0, 0);

      const idealDistance = sphere.radius * 3.2;
      camera.position.set(0, sphere.radius * 0.32, idealDistance);
      camera.lookAt(0, 0, 0);
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

    const defaultRotation = { x: 0, y: 0, z: 0 };

    const animate = () => {
      if (model) {
        velX *= 0.92;
        velY *= 0.92;

        if (!isDragging) {
          pivot.rotation.y += velY;
          pivot.rotation.x += velX;
        }

        // Limit tilt
        pivot.rotation.x = Math.max(-0.6, Math.min(0.6, pivot.rotation.x));

        if (!isDragging && !isHover && Math.abs(velX) < 0.002 && Math.abs(velY) < 0.002) {
          pivot.rotation.x += (defaultRotation.x - pivot.rotation.x) * 0.06;
          pivot.rotation.y += (defaultRotation.y - pivot.rotation.y) * 0.06;
          pivot.rotation.z += (defaultRotation.z - pivot.rotation.z) * 0.06;
        }
      }
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [modelPath]);

  return (
    <div
      ref={mountRef}
      className="w-[85vw] max-w-[820px] h-[40vw] max-h-[380px] mx-auto pt-6"
    />
  );
}
