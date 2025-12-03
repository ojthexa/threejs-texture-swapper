import Navbar from "@/components/Navbar";
import Logo3D from "@/components/Logo3D";

export default function Home() {
  return (
    <div className="h-screen w-full overflow-y-auto snap-y snap-mandatory">
      <Navbar />

      {/* Hero Section */}
      <section className="h-screen w-full snap-start relative flex items-center justify-center overflow-hidden">
        
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5">
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
          </div>
        </div>

        {/* Glowing orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse delay-1000" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl">
          
          {/* 3D Logo */}
          <div className="mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 flex justify-center">
            <Logo3D modelPath={import.meta.env.BASE_URL + "models/logo.glb"} />
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            PROFESSIONAL ARCHITECTURE SOLUTIONS
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            Premium GRC materials and structural solutions for modern architecture. 
            Building excellence with innovation and precision.
          </p>

          {/* Button */}
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
            <a 
              href="#services" 
              className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(0,255,255,0.3)] hover:shadow-[0_0_50px_rgba(0,255,255,0.5)]"
            >
              Explore Our Solutions
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>
    </div>
  );
}
