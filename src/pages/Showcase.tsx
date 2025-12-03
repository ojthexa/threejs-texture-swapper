import { useEffect, useRef, useState } from "react";
import Home from "./Home";
import CubeSwitcher from "@/components/CubeSwitcher";

export default function Showcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollXRef = useRef(0);
  const [isOnSecond, setIsOnSecond] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    let sectionWidth = container.offsetWidth;
    let maxScroll = sectionWidth;
    const snapThreshold = 12;

    const updateIsOnSecond = () => {
      const isSecond = scrollXRef.current >= maxScroll - snapThreshold;
      setIsOnSecond(isSecond);
    };

    /* ----------------------
       DESKTOP WHEEL HANDLER
    ----------------------- */
    function onWheel(e: WheelEvent) {
      const alreadyOnSecond = scrollXRef.current >= maxScroll - snapThreshold;
      if (alreadyOnSecond) return;

      e.preventDefault();

      scrollXRef.current += e.deltaY;
      scrollXRef.current = Math.max(0, Math.min(scrollXRef.current, maxScroll));

      content.style.transform = `translateX(-${scrollXRef.current}px)`;
      content.style.transition = "transform 0.3s ease-out";

      updateIsOnSecond();
    }

    container.addEventListener("wheel", onWheel, { passive: false });

    /* -------------------------
        MOBILE TOUCH SCROLL
    -------------------------- */

    let touchStartX = 0;

    function onTouchStart(e: TouchEvent) {
      touchStartX = e.touches[0].clientX;
    }

    function onTouchMove(e: TouchEvent) {
      const deltaX = touchStartX - e.touches[0].clientX;

      const alreadyOnSecond = scrollXRef.current >= maxScroll - snapThreshold;
      if (alreadyOnSecond) return;

      e.preventDefault();

      scrollXRef.current += deltaX;
      scrollXRef.current = Math.max(0, Math.min(scrollXRef.current, maxScroll));

      content.style.transform = `translateX(-${scrollXRef.current}px)`;
      content.style.transition = "transform 0.25s ease-out";

      touchStartX = e.touches[0].clientX;

      updateIsOnSecond();
    }

    container.addEventListener("touchstart", onTouchStart, { passive: false });
    container.addEventListener("touchmove", onTouchMove, { passive: false });

    /* -------------------------
        EXPLORE BUTTON
    -------------------------- */

    const setupExploreButton = () => {
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

    const t = setTimeout(setupExploreButton, 100);

    /* -------------------------
        RESPONSIVE FIX
    -------------------------- */
    function handleResize() {
      const newWidth = container.offsetWidth;

      // jika sedang di panel 2, tetap di panel 2
      if (scrollXRef.current >= maxScroll - snapThreshold) {
        scrollXRef.current = newWidth;
        content.style.transform = `translateX(-${scrollXRef.current}px)`;
      }

      sectionWidth = newWidth;
      maxScroll = newWidth;
    }

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(t);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

      <div
        ref={contentRef}
        className="flex h-full"
        style={{ width: "200vw", willChange: "transform" }}
      >
        {/* SECTION 1 */}
        <div className="min-w-[100vw] min-h-[100vh]">
          <Home hideNavbar />
        </div>

        {/* SECTION 2 */}
        <div className="min-w-[100vw] min-h-[100vh] overflow-hidden">
          <CubeSwitcher />
        </div>
      </div>
    </div>
  );
}
