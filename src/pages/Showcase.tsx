import { useEffect, useRef } from "react";
import Home from "./Home";
import CubeSwitcher from "@/components/CubeSwitcher";

export default function Showcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    let scrollX = 0;
    const sectionWidth = window.innerWidth;
    const maxScroll = sectionWidth; // Karena hanya 2 section

    function onWheel(e: WheelEvent) {
      e.preventDefault();                 // WAJIB: blok scroll default
      e.stopPropagation();                // WAJIB: cegah elemen lain intercept

      scrollX += e.deltaY;

      // Batasi scroll
      if (scrollX < 0) scrollX = 0;
      if (scrollX > maxScroll) scrollX = maxScroll;

      // Gerakan smooth
      content.style.transform = `translateX(-${scrollX}px)`;
      content.style.transition = "transform 0.3s ease-out";
    }

    // HARUS passive:false agar preventDefault berfungsi
    container.addEventListener("wheel", onWheel, { passive: false });

    return () => container.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen overflow-hidden bg-black relative"
      style={{ position: "relative", zIndex: 1 }}
    >
      {/* Content Horizontal */}
      <div
        ref={contentRef}
        className="flex h-full"
        style={{
          width: "200vw",
          height: "100%",
          display: "flex",
          willChange: "transform",
        }}
      >
        {/* SECTION 1 */}
        <div className="w-screen h-screen relative overflow-hidden">
          <Home />
        </div>

        {/* SECTION 2 */}
        <div className="w-screen h-screen relative overflow-hidden">
          <CubeSwitcher />
        </div>
      </div>
    </div>
  );
}
