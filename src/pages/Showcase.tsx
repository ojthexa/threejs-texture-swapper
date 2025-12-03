import { useEffect, useRef, useState } from "react";
import Home from "./Home";
import CubeSwitcher from "@/components/CubeSwitcher";
import Navbar from "@/components/Navbar"; // pastikan ini ada import!

export default function Showcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollXRef = useRef(0);
  const [isOnSecond, setIsOnSecond] = useState(false);

  const isMobileTablet = () => window.innerWidth <= 1024;
  const getSnap = () => window.innerWidth; // JARAK PANEL → ikut ukuran device

  /** =========================================================
   * ANIMATE SLIDE TRANSITION
   * =======================================================*/
  const animateTo = (x: number) => {
    const el = contentRef.current;
    if (!el) return;
    scrollXRef.current = x;
    el.style.transition = "transform .45s cubic-bezier(.25,.8,.25,1)";
    el.style.transform = `translateX(-${x}px)`;
    setIsOnSecond(x >= getSnap() - 5);
  };

  const goHome = () => animateTo(0);
  const goSecond = () => animateTo(getSnap());

  /** =========================================================
   * Desktop — scroll wheel horizontal
   * ========================================================= */
  useEffect(() => {
    if (isMobileTablet()) return; // skip jika mobile/tablet

    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const onWheel = (e: WheelEvent) => {
      const max = getSnap();
      const reachedEnd = scrollXRef.current >= max - 5;

      if (reachedEnd) return; // canvas bebas scroll/zoom

      e.preventDefault();
      scrollXRef.current = Math.min(max, Math.max(0, scrollXRef.current + e.deltaY));
      content.style.transform = `translateX(-${scrollXRef.current}px)`;
      content.style.transition = "transform .3s ease-out";
      setIsOnSecond(scrollXRef.current >= max - 5);
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, []);

  /** =========================================================
   * Mobile & Tablet — swipe left/right
   * ========================================================= */
  useEffect(() => {
    if (!isMobileTablet()) return;

    const content = contentRef.current;
    if (!content) return;

    let startX = 0;
    let curr = 0;
    let drag = false;

    const start = (e: TouchEvent) => {
      drag = true;
      startX = e.touches[0].clientX;
      content.style.transition = "none";
    };

    const move = (e: TouchEvent) => {
      if (!drag) return;
      const diff = startX - e.touches[0].clientX;
      curr = Math.min(getSnap(), Math.max(0, scrollXRef.current + diff));
      content.style.transform = `translateX(-${curr}px)`;
    };

    const end = () => {
      drag = false;
      scrollXRef.current = curr;
      curr > getSnap() / 2 ? goSecond() : goHome(); // SNAP LOGIC
    };

    content.addEventListener("touchstart", start);
    content.addEventListener("touchmove", move);
    content.addEventListener("touchend", end);

    return () => {
      content.removeEventListener("touchstart", start);
      content.removeEventListener("touchmove", move);
      content.removeEventListener("touchend", end);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-screen h-screen overflow-hidden bg-black relative">

      {/* Navbar hanya muncul di panel CubeSwitcher */}
      {isOnSecond && (
        <Navbar className="fixed top-0 left-0 w-[100vw] z-50" />
      )}

      {/* Home Button (opsional boleh pakai/skip) */}
      {isOnSecond && (
        <button
          onClick={goHome}
          className="fixed top-4 right-4 z-[60] px-3 py-1 bg-white/30 text-white backdrop-blur-sm rounded-md border border-white/30 text-sm"
        >
          Home
        </button>
      )}

      {/* Panels */}
      <div
        ref={contentRef}
        className="flex h-full"
        style={{ width: "200vw", willChange: "transform" }}
      >
        {/* PANEL HOME */}
        <section className="w-[100vw] h-screen">
          <Home hideNavbar />
        </section>

        {/* PANEL CUBESWITCHER (NAVBAR disini) */}
        <section className="w-[100vw] h-screen relative">
          <CubeSwitcher />
        </section>
      </div>
    </div>
  );
}
