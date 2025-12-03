import { useEffect, useRef, useState } from "react";
import Home from "./Home";
import CubeSwitcher from "@/components/CubeSwitcher";

export default function Showcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollXRef = useRef(0);
  const [isOnSecond, setIsOnSecond] = useState(false);

  // Helper
  const isMobileTablet = () => window.innerWidth <= 1024;
  const snap = window.innerWidth; // jarak panel = 1 layar

  const animateScroll = (x: number) => {
    const el = contentRef.current;
    if (!el) return;
    scrollXRef.current = x;
    el.style.transition = "transform .45s cubic-bezier(0.25, 0.8, 0.25, 1)";
    el.style.transform = `translateX(-${x}px)`;
    setIsOnSecond(x >= snap - 5);
  };

  const goHome = () => animateScroll(0);
  const goSecond = () => animateScroll(snap);

  // ======================================================
  // Desktop → scroll wheel horizontal
  // ======================================================
  useEffect(() => {
    if (isMobileTablet()) return; // skip if mobile

    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const onWheel = (e: WheelEvent) => {
      const max = snap;
      const isSecond = scrollXRef.current >= max - 5;

      if (isSecond) return;         // Biarkan canvas bebas scroll
      e.preventDefault();           // hentikan scroll default

      scrollXRef.current = Math.min(max, Math.max(0, scrollXRef.current + e.deltaY));
      content.style.transform = `translateX(-${scrollXRef.current}px)`;
      content.style.transition = "transform .3s ease-out";

      setIsOnSecond(scrollXRef.current >= max - 5);
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, []);

  // ======================================================
  // Mobile/Tablet → Swipe Gesture (Touch Drag)
  // ======================================================
  useEffect(() => {
    if (!isMobileTablet()) return; // hanya aktif untuk mobile/tablet

    const content = contentRef.current;
    if (!content) return;

    let startX = 0;
    let current = 0;
    let isDragging = false;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      content.style.transition = "none";
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const diff = startX - e.touches[0].clientX;
      current = Math.min(snap, Math.max(0, scrollXRef.current + diff));
      content.style.transform = `translateX(-${current}px)`;
    };

    const onTouchEnd = () => {
      isDragging = false;
      scrollXRef.current = current;
      if (current > snap / 2) goSecond();
      else goHome();
    };

    content.addEventListener("touchstart", onTouchStart);
    content.addEventListener("touchmove", onTouchMove);
    content.addEventListener("touchend", onTouchEnd);

    return () => {
      content.removeEventListener("touchstart", onTouchStart);
      content.removeEventListener("touchmove", onTouchMove);
      content.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-screen h-screen overflow-hidden bg-black relative">

      {/* HOME BUTTON — hanya muncul saat di panel Cube */}
      {isOnSecond && !isMobileTablet() && (
        <button
          onClick={goHome}
          className="fixed top-4 right-4 z-50 px-3 py-2 rounded-md bg-background/80 border text-sm font-semibold">
          Home
        </button>
      )}

      <div ref={contentRef} className="flex h-full" style={{ width: "200vw" }}>

        {/* PANEL 1 — HOME (tanpa navbar) */}
        <div className="w-screen h-screen">
          <Home hideNavbar />
        </div>

        {/* PANEL 2 — CUBE SWITCHER + NAVBAR */}
        <div className="w-screen h-screen relative overflow-hidden">

          {/* NAVBAR hanya tampil di panel CubeSwitcher */}
          {isOnSecond && (
            <Navbar mobileFull />
          )}

          <CubeSwitcher />
        </div>
      </div>
    </div>
  );

}
