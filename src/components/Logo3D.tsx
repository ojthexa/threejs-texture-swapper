import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default function Logo3D({ modelPath }) {
  const mountRef = useRef(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    /* -----------------------------
     *  SCENE + CAMERA + RENDERER
     * ----------------------------- */
    const scene = new THREE.Scene();
    scene.background = null;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 11);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    /* -----------------------------
     *               LIGHTS
     * ----------------------------- */
    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const directional = new THREE.DirectionalLight(0xffffff, 1.3);
    directional.position.set(4, 6, 8);
    scene.add(directional);

    /* -----------------------------
     *            PIVOT GROUP
     * ----------------------------- */
    const pivot = new THREE.Group();
    scene.add(pivot);

    let model: THREE.Group | null = null;

    /* -----------------------------
     *         LOAD GLB MODEL
     * ----------------------------- */
    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
      model = gltf.scene;

      // Normalize model pivot using bounding box
      const box = new THREE.Box3().setFromObject(model);
      const center = new THREE.Vector3();
      box.getCenter(center);
      model.position.sub(center); // shift model so pivot = true center

      // Apply manual pivot correction (geser ke kiri/kanan)
      const pivotOffset = new THREE.Vector3(-0.62, 0, 0); 
      model.position.add(pivotOffset);

      // Compute scale based on container size
      const sphere = new THREE.Sphere();
      box.getBoundingSphere(sphere);

      const scaleFactor = (width / 200) / sphere.radius;
      model.scale.setScalar(scaleFactor * 0.75);

      pivot.add(model);

      // Re-calc slightly for visual centering
      setTimeout(() => {
        const newBox = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        newBox.getSize(size);

        pivot.position.x = size.x * 0.05;
        pivot.position.y = -size.y * 0.05;
      });

      // Adjust camera distance
      const idealDistance = sphere.radius * 3.6;
      camera.position.set(0, sphere.radius * 0.4, idealDistance);
      camera.lookAt(0, 0, 0);
    });

    /* -----------------------------
     *     INTERACTION VARIABLES
     * ----------------------------- */
    let isDragging = false;
    let isHover = false;

    let lastX = 0;
    let lastY = 0;

    let velX = 0;
    let velY = 0;

    const dom = renderer.domElement;

    /* -----------------------------
     *      MOUSE EVENTS
     * ----------------------------- */
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

    /* -----------------------------
     *        TOUCH EVENTS
     * ----------------------------- */
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

    /* -----------------------------
     *         ANIMATION
     * ----------------------------- */
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

        const lowVelocity = Math.abs(velX) < 0.002 && Math.abs(velY) < 0.002;

        if (!isDragging && !isHover && lowVelocity) {
          pivot.rotation.x += (defaultRotation.x - pivot.rotation.x) * 0.06;
          pivot.rotation.y += (defaultRotation.y - pivot.rotation.y) * 0.06;
          pivot.rotation.z += (defaultRotation.z - pivot.rotation.z) * 0.06;
        }
      }

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    /* -----------------------------
     *          CLEANUP
     * ----------------------------- */
    return () => {
      cancelAnimationFrame(rafRef.current!);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [modelPath]);

  return (
    <div
      ref={mountRef}
      className="w-[320px] md:w-[500px] lg:w-[550px] 
                 h-[240px] md:h-[300px] lg:h-[340px] 
                 mx-auto pt-6"
    />
  );
}
