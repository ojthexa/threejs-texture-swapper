import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Viewer3D from "./pages/Viewer3D";
import NotFound from "./pages/NotFound";
import Showcase from "./pages/Showcase";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          {/* SHOWCASE JADI HALAMAN UTAMA */}
          <Route path="/" element={<Showcase />} />

          {/* OPSIONAL */}
          <Route path="/showcase" element={<Showcase />} />

          <Route path="/3d-viewer" element={<Viewer3D />} />

          {/* fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
