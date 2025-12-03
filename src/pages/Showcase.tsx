import { useEffect, useRef } from "react";
import Home from "./Home";
import CubeSwitcher from "@/components/CubeSwitcher";

export default function Showcase() {
  const container = useRef<HTMLDivElement>(null);

  const homeBg = useRef<HTMLDivElement>(null);
  const homeFg = useRef<HTMLDivElement>(null);
  const cubeBg = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleScroll() {
      const c = container.current;
      if (!c) return;

      const x = c.scrollLeft;

      // PARALLAX SPEEDS
      const bgSpeed = 0.25;
      const midSpeed = 0.5;
      const overlaySpeed = 0.15;

      // HOME SECTION PARALLAX
      if (homeBg.current) homeBg.current.style.transform = `translateX(${x * bgSpeed}px)`;
      if (homeFg.current) homeFg.current.style.transform = `translateX(${x * midSpeed}px)`;

      // CUBE SWITCHER PARALLAX
      if (cubeBg.current) cubeBg.current.style.transform = `translateX(${(x - window.innerWidth) * overlaySpeed}px)`;
    }

    const node = container.current;
    if (node) node.addEventListener("scroll", handleScroll);

    return () => node?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={container}
      className="w-screen h-screen flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
    >
      {/* ================= HOME SECTION ================= */}
      <section className="snap-start w-screen h-screen relative shrink-0 overflow-hidden">

        {/* BACKGROUND PARALLAX */}
        <div
          ref={homeBg}
          className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5"
          style={{ willChange: "transform" }}
        />

        {/* FOREGROUND PARALLAX */}
        <div
          ref={homeFg}
          className="absolute inset-0 pointer-events-none"
          style={{ willChange: "transform" }}
        >
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
        </div>

        <Home />
      </section>

      {/* ================= CUBE SWITCHER SECTION ================= */}
      <section className="snap-start w-screen h-screen relative shrink-0 overflow-hidden">

        {/* BACKGROUND PARALLAX */}
        <div
          ref={cubeBg}
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          style={{ willChange: "transform" }}
        />

        <CubeSwitcher />
      </section>
    </div>
  );
}
