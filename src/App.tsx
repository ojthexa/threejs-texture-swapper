import { useRef } from "react";
import Home from "./pages/Home";
import Viewer3D from "./pages/Viewer3D";

const App = () => {
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      className="
        h-screen w-screen 
        overflow-y-scroll 
        snap-y snap-mandatory 
        scrollbar-hide 
        scroll-smooth
      "
      style={{
        transition: "all 0.6s ease-in-out",
      }}
    >
      {/* Section 1 */}
      <section className="snap-start h-screen w-full">
        <Home />
      </section>

      {/* Section 2 */}
      <section className="snap-start h-screen w-full">
        <Viewer3D />
      </section>
    </div>
  );
};

export default App;
