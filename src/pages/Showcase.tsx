import { useEffect, useRef, useState } from "react";
import Home from "./Home";
import CubeSwitcher from "@/components/CubeSwitcher";

export default function Showcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // scroll X value tanpa trigger render
  const scrollXRef = useRef(0);

  // untuk tombol Home (jika sudah sampai panel CubeSwitcher)
  const [isOnSecond, setIsOnSecond] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    /* ==========================================
       HITUNG LEBAR PANEL
       ========================================== */
    let panelWidth = window.innerWidth; // 100vw
    let maxScroll = panelWidth;         // pindah 1 panel ke kanan

    const snapThreshold = 12;

    const updateIsOnSecond = () => {
      setIsOnSecond(scrollXRef.current >= maxScroll - snapThreshold);
    };

    /* ==========================================
       DESKTOP WHEEL SCROLL
       ========================================== */
    function onWheel(e: WheelEvent) {
      const atSecond = scrollXRef.current >= maxScroll - snapThreshold;

      if (atSecond) {
        // biarkan wheel ke OrbitControls
        return;
      }

      e.preventDefault();

      scrollXRef.current += e.deltaY;
      scrollXRef.current = Math.max(0, Math.min(scrollXRef.current, maxScroll));

      content.style.transform = `translateX(-${scrollXRef.current}px)`;
      content.style.transition = "transform 0.3s ease-out";

      updateIsOnSecond();
    }

    container.addEventListener("wheel", onWheel, { passive: false });

    /* ==========================================
       MOBILE TOUCH SWIPE 
       ========================================== */
    let touchX = 0;

    function onTouchStart(e: TouchEvent) {
      touchX = e.touches[0].clientX;
    }

    function onTouchMove(e: TouchEvent) {
      const delta = touchX - e.touches[0].clientX;

      const atSecond = scrollXRef.current >= maxScroll - snapThreshold;
      if (atSecond) return; // biarkan canvas

      e.preventDefault();

      scrollXRef.current += delta;
      scrollXRef.current = Math.max(0, Math.min(scrollXRef.current, maxScroll));

      content.style.transform = `translateX(-${scrollXRef.current}px)`;
      content.style.transition = "transform 0.25s ease-out";

      touchX = e.touches[0].clientX;

      updateIsOnSecond();
    }

    container.addEventListener("touchstart", onTouchStart, { passive: false });
    container.addEventListener("touchmove", onTouchMove, { passive: false });

    /* ==========================================
       EXPLORE BUTTON DI HOME
       ========================================== */
    const setupButton = () => {
      const btn = document.getElementById("go-cubes");
      if (btn) {
        btn.onclick = () => {
          scrollXRef.current = maxScroll;
          content.style.transform = `translateX(-${scrollXRef.current}px)`;
          content.style.transition =
            "transform 0.55s cubic-bezier(0.25, 0.8, 0.25, 1)";
          setTimeout(() => setIsOnSecond(true), 60);
        };
      }
    };

    const t = setTimeout(setupButton, 100);

    /* ==========================================
       RESPONSIVE RESIZE
       ========================================== */
    function handleResize() {
      panelWidth = window.innerWidth;
      maxScroll = panelWidth;

      // Bila sedang di panel 2 → tetap di panel 2 setelah resize
      if (scrollXRef.current >= maxScroll - snapThreshold) {
        scrollXRef.current = maxScroll;
        content.style.transform = `translateX(-${scrollXRef.current}px)`;
      }
    }

    window.addEventListener("resize", handleResize);

    /* CLEANUP */
    return () => {
      clearTimeout(t);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* ==========================================
     TOMBOL HOME (BACK TO PANEL 1)
     ========================================== */
  const handleGoHome = () => {
    const content = contentRef.current;
    if (!content) return;

    scrollXRef.current = 0;

    content.style.transform = `translateX(0px)`;
    content.style.transition = "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)";

    setIsOnSecond(false);
  };

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen overflow-hidden bg-black relative"
    >
      {isOnSecond && (
        <button
          onClick={handleGoHome}
          className="fixed top-4 right-4 z-50 px-3 py-2 rounded-md bg-background/80 backdrop-blur border border-primary/30 text-sm font-semibold text-foreground shadow"
        >
          Home
        </button>
      )}

      {/* ==========================================
          HORIZONTAL 2-PANEL LAYOUT (SOLID & RESPONSIVE)
         ========================================== */}
      <div
        ref={contentRef}
        className="flex h-full"
        style={{ willChange: "transform" }}
      >
        {/* PANEL 1 (HOME) */}
        <div className="w-[100vw] h-[100vh] shrink-0">
          <Home hideNavbar />
        </div>

        {/* PANEL 2 (CUBESWITCHER) */}
        <div className="w-[100vw] h-[100vh] shrink-0 overflow-hidden">
          <CubeSwitcher />
        </div>
      </div>
    </div>
  );
}
