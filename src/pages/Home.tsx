import Navbar from "@/components/Navbar";
import Logo3D from "@/components/Logo3D";

export default function Home() {
  return (
    <div className="h-screen w-full relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="h-screen w-full relative flex items-center justify-center overflow-hidden">

        {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
          </div>
        </div>

        {/* Glowing Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl pointer-events-auto">

          {/* Logo 3D */}
          <div className="flex justify-center -mt-4 md:-mt-8 lg:-mt-8 mb-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 pointer-events-none">
            <div className="scale-[0.92] md:scale-100 lg:scale-105">
              <Logo3D modelPath={import.meta.env.BASE_URL + 'models/logo.glb'} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 pointer-events-none">
            PROFESSIONAL ARCHITECTURE SOLUTIONS
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 pointer-events-none">
            Premium GRC materials and structural solutions for modern architecture. 
            Building excellence with innovation and precision.
          </p>

          {/* CTA Button */}
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
            <a 
              id="go-cubes"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg 
                        font-semibold text-base hover:scale-105 transition-transform shadow-lg"
            >
              Explore Our Solutions
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce pointer-events-none">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
          </div>
        </div>

      </section>
    </div>
  );
}
