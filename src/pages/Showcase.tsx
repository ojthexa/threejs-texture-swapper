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
    const maxScroll = window.innerWidth;

    // HANDLE SCROLL MANUAL
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      scrollX += e.deltaY;
      scrollX = Math.max(0, Math.min(scrollX, maxScroll));

      content.style.transform = `translateX(-${scrollX}px)`;
      content.style.transition = "transform 0.35s ease-out";
    }

    container.addEventListener("wheel", onWheel, { passive: false });

    // HANDLE KLIK TOMBOL → AUTO SLIDE KE SECTION 2
    setTimeout(() => {
      const btn = document.getElementById("go-cubes");
      if (btn) {
        btn.onclick = () => {
          scrollX = maxScroll;
          content.style.transform = `translateX(-${scrollX}px)`;
          content.style.transition =
            "transform 0.55s cubic-bezier(0.25, 0.8, 0.25, 1)";
        };
      }
    }, 50);

    return () => {
      container.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen overflow-hidden bg-black relative"
      style={{ position: "relative", zIndex: 1 }}
    >
      <div
        ref={contentRef}
        className="flex h-full"
        style={{
          width: "200vw",
          height: "100%",
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
