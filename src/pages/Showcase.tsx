import { useEffect, useRef } from "react";
import Home from "./Home";
import CubeSwitcher from "@/components/CubeSwitcher";

export default function Showcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const translateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = translateRef.current;
    if (!container || !content) return;

    let current = 0;
    let max = window.innerWidth; // 1 section width
    let scrollPos = 0;

    function onWheel(e: WheelEvent) {
      scrollPos += e.deltaY;
      scrollPos = Math.max(0, Math.min(scrollPos, max));

      content.style.transform = `translateX(-${scrollPos}px)`;
      content.style.transition = "transform 0.4s ease-out";
    }

    container.addEventListener("wheel", onWheel, { passive: true });

    return () => container.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen overflow-hidden bg-black relative"
    >
      {/* Horizontal container controlled by vertical scroll */}
      <div
        ref={translateRef}
        className="flex w-[200vw] h-full"
        style={{ willChange: "transform" }}
      >
        <section className="w-screen h-screen">
          <Home />
        </section>

        <section className="w-screen h-screen">
          <CubeSwitcher />
        </section>
      </div>
    </div>
  );
}
