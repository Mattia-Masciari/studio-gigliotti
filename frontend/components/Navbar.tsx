"use client";

import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center">
      <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/20 bg-black">
        <Image 
          src="/assets/logo.jpg" 
          alt="GIO Logo" 
          fill 
          className="object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-500"
        />
      </div>
      
      <div className="hidden md:flex items-center space-x-8 px-8 py-4 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
        <a href="#expertise" className="text-sm uppercase tracking-widest hover:text-white/70 transition-colors">Expertise</a>
        <a href="#vision" className="text-sm uppercase tracking-widest hover:text-white/70 transition-colors">Vision</a>
        <a href="#contact" className="text-sm uppercase tracking-widest hover:text-white/70 transition-colors">Contact</a>
      </div>

      <button className="px-6 py-3 bg-white text-black text-sm uppercase tracking-widest font-semibold rounded-full hover:bg-white/90 transition-colors">
        Client Portal
      </button>
    </nav>
  );
}
