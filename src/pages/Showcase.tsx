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
    const maxScroll = window.innerWidth; // 1 section width

    function onWheel(e: WheelEvent) {
      e.preventDefault(); // WAJIB AGAR SCROLL DIHANDLE SENDIRI
      scrollX += e.deltaY;
      scrollX = Math.max(0, Math.min(scrollX, maxScroll));

      content.style.transform = `translateX(-${scrollX}px)`;
      content.style.transition = "transform 0.35s ease-out";
    }

    // HARUS PASSIVE FALSE
    container.addEventListener("wheel", onWheel, { passive: false });

    return () => container.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen overflow-hidden relative"
    >
      <div
        ref={contentRef}
        className="flex w-[200vw] h-full"
        style={{ willChange: "transform" }}
      >
        <section className="w-screen h-screen overflow-hidden">
          <Home />
        </section>

        <section className="w-screen h-screen overflow-hidden">
          <CubeSwitcher />
        </section>
      </div>
    </div>
  );
}
