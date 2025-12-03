import { useEffect, useRef, useState } from "react";
import Home from "./Home";
import CubeSwitcher from "@/components/CubeSwitcher";

export default function Showcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // scrollXRef agar update tanpa render
  const scrollXRef = useRef(0);

  // state untuk UI (tombol Home) — render only when needed
  const [isOnSecond, setIsOnSecond] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const sectionWidth = window.innerWidth;
    const maxScroll = sectionWidth;
    const snapThreshold = 8; // toleransi px untuk menentukan "on second"

    function updateIsOnSecond() {
      const isSecond = scrollXRef.current >= maxScroll - snapThreshold;
      setIsOnSecond(isSecond);
    }

    // -------------------------
    //  SCROLL HANDLER
    // -------------------------
    function onWheel(e: WheelEvent) {

      const isMobileOrTablet = window.innerWidth <= 1024;
      if (isMobileOrTablet) {
        // STOP panel horizontal, langsung biarkan canvas menerima event
        return; 
      }

      const alreadyOnSecond = scrollXRef.current >= maxScroll - snapThreshold;
      if (alreadyOnSecond) return;

      e.preventDefault();
      scrollXRef.current += e.deltaY;
      scrollXRef.current = Math.max(0, Math.min(scrollXRef.current, maxScroll));
      content.style.transform = `translateX(-${scrollXRef.current}px)`;
      content.style.transition = "transform 0.32s ease-out";
      updateIsOnSecond();
    }

    container.addEventListener("wheel", onWheel, { passive: false });

    // -------------------------
    //  BUTTON "Explore" (already in Home)
    //  Ensure its click exists after DOM renders
    // -------------------------
    const setupExploreButton = () => {
      const btn = document.getElementById("go-cubes");
      if (btn) {
        btn.onclick = () => {
          scrollXRef.current = maxScroll;
          content.style.transform = `translateX(-${scrollXRef.current}px)`;
          content.style.transition =
            "transform 0.55s cubic-bezier(0.25, 0.8, 0.25, 1)";
          // ensure state updated
          setTimeout(() => setIsOnSecond(true), 60);
        };
      }
    };

    // small timeout to wait for Home DOM (button) to appear
    const t = setTimeout(setupExploreButton, 80);

    // handle resize: update layout (section width) and clamp scroll
    function handleResize() {
      const newWidth = window.innerWidth;
      // if section width changed (responsive), we need to adjust max and current scroll
      // naive approach: if new width differs, remap scroll to either 0 or newWidth if near edges
      // keep behavior simple: if we were at second, keep at second
      if (scrollXRef.current >= maxScroll - snapThreshold) {
        // snap to new second
        scrollXRef.current = newWidth;
        content.style.transform = `translateX(-${scrollXRef.current}px)`;
      }
    }
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      clearTimeout(t);
      container.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // -------------------------
  //  HOME BUTTON (visible only on second panel)
  // -------------------------
  const handleGoHome = () => {
    const content = contentRef.current;
    if (!content) return;
    // animate back to 0
    scrollXRef.current = 0;
    content.style.transform = `translateX(-0px)`;
    content.style.transition = "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)";
    setIsOnSecond(false);
  };

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen overflow-hidden bg-black relative"
    >
      {/* Home button shown when on CubeSwitcher (panel 2) */}
      {isOnSecond && (
        <button
          onClick={handleGoHome}
          className="fixed top-4 right-4 z-50 px-3 py-2 rounded-md bg-background/80 backdrop-blur border border-primary/30 text-sm font-semibold text-foreground shadow"
          aria-label="Back to Home"
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
        <div className="w-screen h-screen">
          {/* hide navbar so CubeSwitcher will not show burger etc. */}
          <Home hideNavbar />
        </div>

        {/* SECTION 2 */}
        <div className="w-screen h-screen">
          <CubeSwitcher />
        </div>
      </div>
    </div>
  );
}
