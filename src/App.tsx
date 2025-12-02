import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Viewer3D from "./pages/Viewer3D";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        {/* Fullscreen snap scrolling wrapper */}
        <div
          className="
            h-screen w-screen 
            overflow-y-scroll overflow-x-hidden 
            snap-y snap-mandatory 
            no-scrollbar 
            scroll-smooth
          "
          style={{
            scrollBehavior: "smooth",
            scrollSnapType: "y mandatory",
          }}
        >
          <Routes>
            <Route
              path="/"
              element={
                <section className="snap-start h-screen w-full">
                  <Home />
                </section>
              }
            />

            <Route
              path="/3d-viewer"
              element={
                <section className="snap-start h-screen w-full">
                  <Viewer3D />
                </section>
              }
            />

            <Route
              path="*"
              element={
                <section className="snap-start h-screen w-full">
                  <NotFound />
                </section>
              }
            />
          </Routes>
        </div>

      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
