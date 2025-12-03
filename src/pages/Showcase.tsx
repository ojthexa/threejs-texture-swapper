import { useEffect, useRef, useState } from "react";
import Home from "./Home";
import CubeSwitcher from "@/components/CubeSwitcher";

export default function Showcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollXRef = useRef(0);
  const [isOnSecond, setIsOnSecond] = useState(false);

  // === Detect mobile & tablet live ===
  const isMobileTablet = () => window.innerWidth <= 1024;
  const mq = window.matchMedia("(max-width:1024px)");

  // === Navigation helper ===
  const scrollTo = (x: number, anim = true) => {
    const el = contentRef.current;
    if (!el) return;
    scrollXRef.current = x;
    el.style.transform = `translateX(-${x}px)`;
    el.style.transition = anim
      ? "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)"
      : "none";
  };

  const goSecond = () => {
    scrollTo(window.innerWidth);
    setTimeout(() => setIsOnSecond(true), 80);
  };

  const goHome = () => {
    scrollTo(0);
    setIsOnSecond(false);
  };

  // =============================================
  // Initial Setup
  // =============================================
  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const maxScroll = window.innerWidth;
    const snap = 8;

    const updateSecondState = () => {
      setIsOnSecond(scrollXRef.current >= maxScroll - snap);
    };

    // --- Wheel Handler with Mobile Stopper ---
    const onWheel = (e: WheelEvent) => {
      if (isMobileTablet()) return; // stopper aktif di mobile/tablet

      const alreadySecond = scrollXRef.current >= maxScroll - snap;
      if (alreadySecond) return;

      e.preventDefault();
      scrollXRef.current = Math.min(maxScroll, Math.max(0, scrollXRef.current + e.deltaY));
      scrollTo(scrollXRef.current);
      updateSecondState();
    };

    container.addEventListener("wheel", onWheel, { passive: false });

    // --- Setup Explore Button in Home ---
    const timer = setTimeout(() => {
      const btn = document.getElementById("go-cubes");
      btn && (btn.onclick = goSecond);
    }, 80);

    // --- Handle Responsive Resize + matchMedia change ---
    const handleResponsive = () => {
      if (isMobileTablet()) {
        scrollTo(0, false);
        setIsOnSecond(false);
      } else if (scrollXRef.current > 0) {
        goSecond();
      }
    };

    window.addEventListener("resize", handleResponsive);
    mq.addEventListener("change", handleResponsive);

    return () => {
      clearTimeout(timer);
      container.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", handleResponsive);
      mq.removeEventListener("change", handleResponsive);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-screen h-screen overflow-hidden bg-black relative">

      {/* Back button only when panel-2 */}
      {isOnSecond && (
        <button
          onClick={goHome}
          className="fixed top-4 right-4 z-50 px-3 py-2 rounded-md bg-background/80 backdrop-blur border border-primary/30 text-sm shadow font-semibold">
          Home
        </button>
      )}

      <div
        ref={contentRef}
        className="flex h-full"
        style={{ width: isMobileTablet() ? "100vw" : "200vw", willChange: "transform" }}>

        {/* Panel 1 */}
        <div className="w-screen h-screen">
          <Home hideNavbar />
        </div>

        {/* Panel 2 */}
        {!isMobileTablet() && (
          <div className="w-screen h-screen">
            <CubeSwitcher />
          </div>
        )}
      </div>
    </div>
  );
}
