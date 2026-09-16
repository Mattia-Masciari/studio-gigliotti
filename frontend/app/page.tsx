"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Buildings, Calculator, ChartBar, Briefcase, Play, ArrowUpRight, Target, Newspaper, LinkedinLogo, DownloadSimple, CheckCircle, TrendUp, Bell, Eye, Handshake, VideoCamera, CalendarPlus, Copy, ArrowLeft } from "@phosphor-icons/react";

export default function Home() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const mainSiteRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const flashOverlayRef = useRef<HTMLDivElement>(null);

  // To keep track if we are in dashboard or main site
  const isDashboardActive = useRef(true);

  // Booking State
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedService, setSelectedService] = useState("Consulenza Fiscale & Societaria");
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState("09:30");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientNotes, setClientNotes] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [generatedMeetUrl, setGeneratedMeetUrl] = useState("");
  const [gcalUrl, setGcalUrl] = useState("");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Hover tilt effect for dashboard interactivity
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDashboardActive.current || !gridContainerRef.current) return;
      const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
      gsap.to(gridContainerRef.current, {
        rotationY: -20 + (xAxis * 0.5),
        rotationX: 15 - (yAxis * 0.5),
        duration: 1,
        ease: "power1.out"
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const initiateExploration = (clickedCard: HTMLElement, targetSectionAnchor: string | null = null) => {
    if (!dashboardRef.current || !mainSiteRef.current || !flashOverlayRef.current) return;

    isDashboardActive.current = false;

    const tl = gsap.timeline({
      onComplete: () => {
        runSiteAnimations();
        // If a direct section was requested, auto-scroll after loading
        if (targetSectionAnchor) {
          const target = document.querySelector(targetSectionAnchor);
          if (target) {
            target.scrollIntoView({ behavior: 'instant', block: 'start' });
          }
        }
      }
    });

    // 1. Hide all non-clicked elements
    gsap.to('.dash-card', {
      filter: "blur(10px)",
      opacity: 0,
      z: -1000,
      duration: 0.6,
      ease: "power2.in"
    });

    // Bring the specific clicked target element to the absolute front override
    gsap.set(clickedCard, { zIndex: 9999, opacity: 1, filter: "none" });

    // 2. Grid straightening logic
    tl.to(gridContainerRef.current, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.8,
      ease: "power4.inOut"
    }, "-=0.4");

    // 3. Focused immersive zoom override for any chosen card
    tl.to(clickedCard, {
      z: 1200,
      scale: 3,
      rotationZ: 25,
      duration: 1,
      opacity: 1,
      ease: "expo.inOut"
    }, "-=0.6");

    // 4. Transition Mask
    tl.to(flashOverlayRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.in"
    }, "-=0.3");

    // 5. Reality Swap
    tl.set(dashboardRef.current, { display: 'none' });
    tl.set(mainSiteRef.current, { visibility: 'visible', opacity: 1 });
    tl.set('body', { overflowY: 'auto' });

    // 6. Unveil New Reality
    tl.to(flashOverlayRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });
  };

  const returnToDashboard = () => {
    if (!dashboardRef.current || !mainSiteRef.current || !flashOverlayRef.current) return;

    isDashboardActive.current = true;

    // Scroll to top instantly before transition
    window.scrollTo({ top: 0, behavior: 'instant' });

    const tl = gsap.timeline();

    // 1. Transition Mask
    tl.to(flashOverlayRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.in"
    });

    // 2. Reality Swap back to Dashboard
    tl.set(mainSiteRef.current, { visibility: 'hidden', opacity: 0 });
    tl.set(dashboardRef.current, { display: 'flex' });
    tl.set('body', { overflowY: 'hidden' });

    // 3. Reset Dashboard Grid elements
    gsap.set('.dash-card', { clearProps: "filter,opacity,z,zIndex,scale,rotationZ" });
    gsap.set('#active-card', { clearProps: "filter,opacity,z,zIndex,scale,rotationZ" });
    gsap.set(gridContainerRef.current, { clearProps: "rotationX,rotationY" });

    // 4. Unveil Dashboard
    tl.to(flashOverlayRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });
  };

  const runSiteAnimations = () => {
    const siteTl = gsap.timeline();

    siteTl.to("#hero-title", {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "expo.out"
    })
      .to("#hero-cta", {
        opacity: 1,
        duration: 1,
        ease: "power2.out"
      }, "-=1");

    setupScrollTriggers();
  };

  const setupScrollTriggers = () => {
    // Card Reveal Scroll
    gsap.utils.toArray('.card-reveal').forEach((card: any) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          scroller: "#main-site",
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out"
      });
    });

    // Image Scale Scrub
    gsap.to("#vision-img", {
      scrollTrigger: {
        trigger: ".image-container",
        scroller: "#main-site",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      },
      scale: 1,
      y: -20
    });
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, targetSection: string | null = null) => {
    initiateExploration(e.currentTarget, targetSection);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const target = document.querySelector(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomSlug = 'gigliotti-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 5);
    const meetUrl = `https://meet.google.com/${randomSlug}`;
    setGeneratedMeetUrl(meetUrl);

    const title = encodeURIComponent(`Consulenza Studio Gigliotti: ${selectedService}`);
    const details = encodeURIComponent(`Incontro Google Meet con Studio Gigliotti.\nPartecipanti: ${clientName} (${clientEmail}), william_gigliotti@arubapec.it\nLink Google Meet: ${meetUrl}\nNote: ${clientNotes || "Nessuna"}`);
    const dateClean = selectedDate.replace(/-/g, '');
    const timeClean = selectedTime.replace(':', '') + '00';
    const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateClean}T${timeClean}/${dateClean}T${timeClean}&details=${details}&add=william_gigliotti@arubapec.it,${clientEmail}`;

    setGcalUrl(gcal);
    setBookingConfirmed(true);
  };

  const copyMeetLink = () => {
    if (generatedMeetUrl) {
      navigator.clipboard.writeText(generatedMeetUrl);
      alert("Link Google Meet copiato negli appunti: " + generatedMeetUrl);
    }
  };

  const resetBookingForm = () => {
    setBookingConfirmed(false);
    setBookingStep(1);
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setClientCompany("");
    setClientNotes("");
  };

  return (
    <>
      {/* Backgrounds */}
      <div id="sky-bg"></div>
      <div id="flash-overlay" ref={flashOverlayRef}></div>

      {/* DASHBOARD LAYER */}
      <div id="dashboard" ref={dashboardRef} className="flex flex-col items-center justify-center pt-8">
        <div className="absolute top-5 w-full flex flex-col items-center justify-center text-center z-50 pointer-events-none">
          <Image src="/assets/logo.jpg" alt="Logo Studio Gigliotti" width={72} height={72} className="w-18 h-18 rounded-full border-2 border-white shadow-xl object-cover scale-110 hover:scale-125 transition-all duration-500 mb-1.5 pointer-events-auto" />
          <h2 className="text-3xl font-bold text-sky-950 drop-shadow-md">Studio Gigliotti</h2>
          <p className="text-sky-800 font-semibold text-sm mt-0.5 drop-shadow-md">Seleziona una Card per Esplorare il Sito</p>
        </div>

        <div className="grid-container mt-14" ref={gridContainerRef}>
          {/* Card 1: Expertise */}
          <div className="dash-card opacity-90 transform translate-y-8 cursor-pointer" onClick={(e) => handleCardClick(e, '#expertise')}>
            <Image src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=60" alt="Expertise" fill className="object-cover" />
            <div className="absolute bottom-4 left-4 bg-white/95 border border-white/90 py-1.5 px-3.5 rounded-full text-xs font-bold text-black shadow-md backdrop-blur flex items-center gap-2">
              <Briefcase size={16} className="text-black" />
              Expertise
            </div>
          </div>

          {/* Card 2: Our Vision */}
          <div className="dash-card opacity-90 transform translate-x-4 cursor-pointer" onClick={(e) => handleCardClick(e, '#vision')}>
            <Image src="/assets/tutti.jpg" alt="Vision" fill className="object-cover" />
            <div className="absolute bottom-4 left-4 bg-white/95 border border-white/90 py-1.5 px-3.5 rounded-full text-xs font-bold text-black shadow-md backdrop-blur flex items-center gap-2">
              <Eye size={16} className="text-black" />
              Our Vision
            </div>
          </div>

          {/* Card 3: Connect */}
          <div className="dash-card opacity-90 cursor-pointer" onClick={(e) => handleCardClick(e, '#contact')}>
            <Image src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=60" alt="Contact" fill className="object-cover" />
            <div className="absolute bottom-4 left-4 bg-white/95 border border-white/90 py-1.5 px-3.5 rounded-full text-xs font-bold text-black shadow-md backdrop-blur flex items-center gap-2">
              <Handshake size={16} className="text-black" />
              Connect
            </div>
          </div>

          {/* Card 4: Our Mission */}
          <div className="dash-card opacity-90 transform -translate-y-2 cursor-pointer" onClick={(e) => handleCardClick(e, '#mission')}>
            <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=60" alt="Our Mission" fill className="object-cover" />
            <div className="absolute bottom-4 left-4 bg-white/95 border border-white/90 py-1.5 px-3.5 rounded-full text-xs font-bold text-black shadow-md backdrop-blur flex items-center gap-2">
              <Target size={16} className="text-black" />
              Our Mission
            </div>
          </div>

          {/* Card 5: Utility & Calcolatori */}
          <div id="active-card" className="dash-card transform scale-110 z-20 border-4 border-white relative bg-black cursor-pointer" onClick={(e) => handleCardClick(e, '#utility')}>
            <Image src="https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=500&q=80" alt="Utility e Calcolatori" fill className="object-cover opacity-80 hover:opacity-100 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute bottom-4 left-4 z-10 flex flex-col items-start gap-1">
              <div className="bg-white/95 border border-white/90 py-1.5 px-3.5 rounded-full text-xs font-bold text-black shadow-md backdrop-blur flex items-center gap-2">
                <Calculator size={16} className="text-black" />
                Utility & Calcolatori
              </div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-white drop-shadow ml-1">Strumenti pratici & Metodo operativo</div>
            </div>
            <div className="primary-indicator z-10">
              <div className="bg-white text-black w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg">
                <Play weight="fill" />
              </div>
            </div>
          </div>

          {/* Card 6: News & Bandi */}
          <div className="dash-card opacity-90 transform -translate-y-8 cursor-pointer" onClick={(e) => handleCardClick(e, '#news')}>
            <Image src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=400&q=60" alt="News e Bandi" fill className="object-cover" />
            <div className="absolute bottom-4 left-4 bg-white/95 border border-white/90 py-1.5 px-3.5 rounded-full text-xs font-bold text-black shadow-md backdrop-blur flex items-center gap-2">
              <Newspaper size={16} className="text-black" />
              News & Bandi
            </div>
          </div>
        </div>
      </div>

      {/* MAIN SITE LAYER */}
      <div id="main-site" ref={mainSiteRef}>
        {/* Navigation */}
        <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border border-white/20 bg-black flex items-center justify-center cursor-pointer" onClick={returnToDashboard} title="Back to Workspace">
            <Image src="/assets/logo.jpg" alt="GIO Logo" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
          </div>

          <div className="hidden lg:flex items-center space-x-6 px-8 py-3 glass-nav rounded-full">
            <a href="#expertise" onClick={(e) => scrollToSection(e, '#expertise')} className="text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors">Expertise</a>
            <a href="#vision" onClick={(e) => scrollToSection(e, '#vision')} className="text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors">Vision</a>
            <a href="#mission" onClick={(e) => scrollToSection(e, '#mission')} className="text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors">Mission</a>
            <a href="#utility" onClick={(e) => scrollToSection(e, '#utility')} className="text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors">Utility & Metodo</a>
            <a href="#news" onClick={(e) => scrollToSection(e, '#news')} className="text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors">News & Bandi</a>
            <a href="#contact" onClick={(e) => scrollToSection(e, '#contact')} className="text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors">Contatti</a>
          </div>

          <button onClick={returnToDashboard} className="px-6 py-3 bg-white text-black text-xs uppercase tracking-widest font-bold rounded-full hover:bg-neutral-200 transition-colors">
            Dashboard
          </button>
        </nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-36 pb-20 px-6 overflow-hidden">
          {/* Subtle backdrop glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="w-full max-w-5xl text-center flex flex-col items-center relative z-10">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sky-400 text-xs uppercase tracking-widest font-bold mb-8 shadow-inner">
              <Buildings size={16} /> Studio Commercialista & Advisory Firm
            </div>

            {/* Main Title */}
            <h1 id="hero-title" className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              <span className="block text-white">Chiarezza Fiscale e</span>
              <span className="block bg-gradient-to-r from-sky-300 via-sky-100 to-white bg-clip-text text-transparent">Strategia Finanziaria per l&apos;Impresa</span>
            </h1>

            {/* Subtitle in Italian */}
            <p className="text-neutral-300 text-lg md:text-xl max-w-3xl leading-relaxed mb-10 font-normal">
              Affianchiamo aziende, startup e professionisti nell&apos;ottimizzazione del carico fiscale, nel controllo di gestione e nell&apos;accesso alle migliori opportunità di finanza agevolata.
            </p>

            {/* CTAs */}
            <div id="hero-cta" className="flex flex-col sm:flex-row items-center gap-5 mb-16">
              <a href="#contact" onClick={(e) => scrollToSection(e, '#contact')} className="group px-8 py-4 bg-sky-500 hover:bg-sky-400 text-black font-extrabold rounded-full transition-all flex items-center gap-3 shadow-lg shadow-sky-500/25 scale-100 hover:scale-105">
                <VideoCamera size={20} /> Prenota una Call su Google Meet
              </a>
              <a href="#utility" onClick={(e) => scrollToSection(e, '#utility')} className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white rounded-full font-bold transition-all flex items-center gap-2 backdrop-blur-md">
                <Calculator size={18} className="text-sky-400" /> Calcolatori & Utility
              </a>
            </div>

            {/* Value Proposition Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mt-4">
              <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/10 backdrop-blur-lg">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400 flex items-center justify-center mb-4">
                  <VideoCamera size={20} />
                </div>
                <h3 className="text-white font-bold text-base mb-1">100% Consulenza Remota</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">Video call dedicate su Google Meet e condivisione sicura dei documenti in cloud.</p>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/10 backdrop-blur-lg">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 flex items-center justify-center mb-4">
                  <Target size={20} />
                </div>
                <h3 className="text-white font-bold text-base mb-1">Finanza Agevolata & Bandi</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">Supporto per Transizione 5.0, crediti d&apos;imposta e contributi a fondo perduto.</p>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/10 backdrop-blur-lg">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/20 text-purple-400 flex items-center justify-center mb-4">
                  <TrendUp size={20} />
                </div>
                <h3 className="text-white font-bold text-base mb-1">Pianificazione & Controllo</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">Analisi dei flussi di cassa e reportistica per decisioni aziendali trasparenti e sicure.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Expertise */}
        <section id="expertise" className="py-32 md:py-48 px-6 max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="text-xs uppercase tracking-widest text-sky-400 font-bold">Aree di Intervento</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2">Le Nostre Competenze Core</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[300px] gap-6 grid-flow-dense">
            {/* Main Card */}
            <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-neutral-900 rounded-3xl p-10 flex flex-col justify-end border border-white/5 card-reveal">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
              <Image src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" alt="Advisory" fill className="object-cover opacity-60 grayscale group-hover:scale-105 transition-transform duration-700 ease-out" />
              <div className="relative z-20">
                <Buildings className="text-5xl mb-6 text-white" />
                <h3 className="text-3xl font-semibold mb-4">Corporate Advisory</h3>
                <p className="text-neutral-400 text-lg max-w-md">Strategic structuring, global governance, and high-level risk architecture.</p>
              </div>
            </div>

            {/* Detail Card 1 */}
            <div className="md:col-span-2 md:row-span-1 relative group overflow-hidden bg-neutral-900 rounded-3xl p-8 flex flex-col justify-between border border-white/5 card-reveal">
              <div className="flex justify-between items-start">
                <Calculator className="text-3xl text-white" />
                <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity text-xl text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Tax Engineering</h3>
                <p className="text-neutral-400">Optimized cross-border systems and corporate tax mitigation strategies.</p>
              </div>
            </div>

            {/* Detail Card 2 */}
            <div className="md:col-span-1 md:row-span-1 relative group overflow-hidden bg-neutral-900 rounded-3xl p-8 flex flex-col justify-between border border-white/5 card-reveal">
              <ChartBar className="text-3xl text-white" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Auditing</h3>
                <p className="text-neutral-500 text-sm">Precision predictive auditing frameworks.</p>
              </div>
            </div>

            {/* Detail Card 3 */}
            <div className="md:col-span-1 md:row-span-1 relative group overflow-hidden bg-white text-black rounded-3xl p-8 flex flex-col justify-between card-reveal">
              <Briefcase className="text-3xl" />
              <div>
                <h3 className="text-xl font-bold mb-2">Wealth</h3>
                <p className="text-neutral-600 text-sm">Private legacy wealth advisory and estate management.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Our Vision */}
        <section id="vision" className="relative py-32 px-6 bg-brand-dark overflow-hidden min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative h-[70vh] rounded-3xl overflow-hidden image-container">
              <Image id="vision-img" src="/assets/tutti.jpg" alt="GIO Team" fill className="object-cover grayscale brightness-75 contrast-125 transform scale-110" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-sky-400 font-bold">La Nostra Visione</span>
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-tight mb-8 tracking-tight text-reveal mt-2">
                A legacy of <br /><span className="font-light italic gradient-text">precision</span> & trust.
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed mb-12 max-w-lg opacity-70">
                We bridge rigorous mathematical transparency with high-impact visionary strategy. Decades of guiding elite capital markets and private enterprise.
              </p>
              <div className="w-full h-px bg-white/10 mb-8"></div>
              <div className="flex gap-16">
                <div>
                  <span className="block text-5xl font-bold mb-2 tracking-tighter">25+</span>
                  <span className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">Years Experience</span>
                </div>
                <div>
                  <span className="block text-5xl font-bold mb-2 tracking-tighter">€2B+</span>
                  <span className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">Assets Protected</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Our Mission (NUOVA SEZIONE) */}
        <section id="mission" className="py-32 md:py-48 px-6 max-w-7xl mx-auto border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Target size={16} />
                Our Mission
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Guida Strategica & Valore Sostenibile.
              </h2>
              <p className="text-neutral-400 text-lg leading-relaxed mb-8">
                La nostra mission è affiancare aziende ed imprenditori con soluzioni finanziarie e tributarie ad alto impatto. Uniamo il rigore dell&apos;analisi alla visione strategica, trasformando ogni complessità fiscale in una leva di crescita.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-white/5">
                  <div className="p-3 bg-sky-500/10 rounded-xl text-sky-400">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg">Trasparenza & Accuratezza</h4>
                    <p className="text-neutral-400 text-sm mt-1">Audit rigorosi e reportistica chiara per decisioni aziendali informate e tempestive.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-white/5">
                  <div className="p-3 bg-sky-500/10 rounded-xl text-sky-400">
                    <TrendUp size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg">Pianificazione Proattiva</h4>
                    <p className="text-neutral-400 text-sm mt-1">Anticipiamo i cambiamenti normativi creando modelli di sviluppo su misura per ogni cliente.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-neutral-900 p-8 rounded-3xl border border-white/5 flex flex-col justify-between h-72">
                <span className="text-4xl font-light text-sky-400">01</span>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Presidio Fiscale globale</h3>
                  <p className="text-neutral-400 text-sm">Tutela costante del patrimonio aziendale e personale con metodologie d&apos;eccellenza.</p>
                </div>
              </div>

              <div className="bg-neutral-900 p-8 rounded-3xl border border-white/5 flex flex-col justify-between h-72 md:translate-y-8">
                <span className="text-4xl font-light text-sky-400">02</span>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Digital Accounting</h3>
                  <p className="text-neutral-400 text-sm">Integrazione di strumenti tecnologici avanzati per una gestione contabile in tempo reale.</p>
                </div>
              </div>

              <div className="bg-neutral-900 p-8 rounded-3xl border border-white/5 flex flex-col justify-between h-72">
                <span className="text-4xl font-light text-sky-400">03</span>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Governance & M&A</h3>
                  <p className="text-neutral-400 text-sm">Supporto in operazioni straordinarie, riassetti societari e finanza straordinaria.</p>
                </div>
              </div>

              <div className="bg-neutral-900 p-8 rounded-3xl border border-white/5 flex flex-col justify-between h-72 md:translate-y-8">
                <span className="text-4xl font-light text-sky-400">04</span>
                <div>
                  <h3 className="text-2xl font-bold mb-2">ESG & Sostenibilità</h3>
                  <p className="text-neutral-400 text-sm">Accompagnamento nei percorsi di sostenibilità e compliance ai nuovi standard europei.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Utility & Calcolatori (NUOVA SEZIONE) */}
        <section id="utility" className="py-32 md:py-48 px-6 max-w-7xl mx-auto border-t border-white/10 bg-neutral-950/40 rounded-3xl my-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4">
              <Calculator size={16} />
              Utility & Calcolatori
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Strumenti Pratici & Metodo Operativo</h2>
            <p className="text-neutral-400 text-lg">
              Mettiamo a disposizione dei nostri clienti risorse interattive, simulazioni d&apos;impatto finanziario e la nostra metodologia di lavoro in 4 step per garantire chiarezza in ogni fase.
            </p>
          </div>

          {/* Utility Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {/* Utility 1 */}
            <div className="bg-neutral-900/90 border border-white/10 p-8 rounded-3xl flex flex-col justify-between hover:border-white/30 transition-all group">
              <div>
                <div className="p-4 bg-white/5 rounded-2xl w-fit mb-6 text-sky-400 group-hover:scale-110 transition-transform">
                  <Calculator size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-3">Simulatore di Budgeting & Imposte</h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  Calcola in autonomia una stima orientativa della pressione fiscale e proietta i flussi di cassa operativi per il prossimo trimestre.
                </p>
              </div>
              <button className="w-full py-3.5 bg-white/10 hover:bg-white text-white hover:text-black rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                Avvia Calcolatore <ArrowRight size={14} />
              </button>
            </div>

            {/* Utility 2 */}
            <div className="bg-neutral-900/90 border border-white/10 p-8 rounded-3xl flex flex-col justify-between hover:border-white/30 transition-all group">
              <div>
                <div className="p-4 bg-white/5 rounded-2xl w-fit mb-6 text-sky-400 group-hover:scale-110 transition-transform">
                  <DownloadSimple size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-3">Checklist Documentale</h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  Download immediato delle pratiche e dei modelli necessari per bilanci, dichiarazioni e adempimenti periodici.
                </p>
              </div>
              <button className="w-full py-3.5 bg-white/10 hover:bg-white text-white hover:text-black rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                Scarica Kit Risorse <DownloadSimple size={14} />
              </button>
            </div>

            {/* Utility 3 */}
            <div className="bg-neutral-900/90 border border-white/10 p-8 rounded-3xl flex flex-col justify-between hover:border-white/30 transition-all group">
              <div>
                <div className="p-4 bg-white/5 rounded-2xl w-fit mb-6 text-sky-400 group-hover:scale-110 transition-transform">
                  <TrendUp size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-3">Analisi Convenienza Bando</h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  Test rapido di pre-fattibilità per verificare l&apos;idoneità della tua impresa ai finanziamenti agevolati del PNRR e regionali.
                </p>
              </div>
              <button className="w-full py-3.5 bg-white/10 hover:bg-white text-white hover:text-black rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                Verifica Requisiti <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Metodo Operativo */}
          <div className="border border-white/10 rounded-3xl p-8 md:p-12 bg-neutral-900/50">
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">Come Opera lo Studio Gigliotti</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                <span className="text-sky-400 font-mono text-sm">STEP 01</span>
                <h4 className="font-bold text-lg mt-2 mb-1">Check-up Iniziale</h4>
                <p className="text-neutral-400 text-xs">Analisi preliminare della situazione contabile e rilevazione delle criticità.</p>
              </div>
              <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                <span className="text-sky-400 font-mono text-sm">STEP 02</span>
                <h4 className="font-bold text-lg mt-2 mb-1">Piano Strategico</h4>
                <p className="text-neutral-400 text-xs">Definizione della roadmap fiscale e degli obiettivi economico-patrimoniali.</p>
              </div>
              <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                <span className="text-sky-400 font-mono text-sm">STEP 03</span>
                <h4 className="font-bold text-lg mt-2 mb-1">Esecuzione Digitale</h4>
                <p className="text-neutral-400 text-xs">Gestione continua delle pratiche con condivisione cloud e controllo costi.</p>
              </div>
              <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                <span className="text-sky-400 font-mono text-sm">STEP 04</span>
                <h4 className="font-bold text-lg mt-2 mb-1">Monitoring & Optimization</h4>
                <p className="text-neutral-400 text-xs">Revisioni periodiche e riallineamento costante in base alle novità normative.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: News & Bandi (NUOVA SEZIONE CON LINKEDIN SYNC) */}
        <section id="news" className="py-32 md:py-48 px-6 max-w-7xl mx-auto border-t border-white/10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-950 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider mb-4">
                <LinkedinLogo size={16} />
                LinkedIn Live Integration
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">News & Bandi</h2>
              <p className="text-neutral-400 text-lg mt-3 max-w-2xl">
                Aggiornamenti in tempo reale, circolari operative e opportunità di finanza agevolata. Questa sezione è direttamente collegata alla pagina LinkedIn di Studio Gigliotti.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-neutral-900 border border-white/10 px-5 py-3 rounded-2xl">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-mono text-neutral-300">Sincronizzazione Automatica LinkedIn Attiva</span>
            </div>
          </div>

          {/* News Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* News 1 */}
            <div className="bg-neutral-900 rounded-3xl border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-sky-500/50 transition-all">
              <div className="p-8">
                <div className="flex justify-between items-center text-xs text-neutral-500 mb-4 font-mono">
                  <span className="text-sky-400 font-bold uppercase">Bando Attivo</span>
                  <span>28 Luglio 2026</span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-sky-400 transition-colors">
                  Transizione 5.0: Pubblicate le nuove linee guida operative per il credito d&apos;imposta
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  Focus sui requisiti di efficientamento energetico e digitalizzazione. Le imprese possono prenotare le risorse per i progetti avviati nel 2026.
                </p>
              </div>
              <div className="p-6 bg-black/40 border-t border-white/5 flex justify-between items-center text-xs">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <LinkedinLogo size={16} className="text-sky-400" />
                  Postato su LinkedIn
                </span>
                <a href="https://www.linkedin.com/company/studio-gigliotti/?originalSubdomain=it" target="_blank" rel="noreferrer" className="text-sky-400 font-bold hover:underline flex items-center gap-1">
                  Leggi su LinkedIn <ArrowUpRight size={14} />
                </a>
              </div>
            </div>

            {/* News 2 */}
            <div className="bg-neutral-900 rounded-3xl border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-sky-500/50 transition-all">
              <div className="p-8">
                <div className="flex justify-between items-center text-xs text-neutral-500 mb-4 font-mono">
                  <span className="text-amber-400 font-bold uppercase">Fisco & Bilancio</span>
                  <span>24 Luglio 2026</span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-sky-400 transition-colors">
                  Scadenziario Fiscale Luglio/Agosto: proroghe e versamenti per i soggetti ISA
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  Sintesi operativa delle principali scadenze di mezza estate e indicazioni per la rateizzazione delle imposte derivanti dal Modello REDDITI.
                </p>
              </div>
              <div className="p-6 bg-black/40 border-t border-white/5 flex justify-between items-center text-xs">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <LinkedinLogo size={16} className="text-sky-400" />
                  Postato su LinkedIn
                </span>
                <a href="https://www.linkedin.com/company/studio-gigliotti/?originalSubdomain=it" target="_blank" rel="noreferrer" className="text-sky-400 font-bold hover:underline flex items-center gap-1">
                  Leggi su LinkedIn <ArrowUpRight size={14} />
                </a>
              </div>
            </div>

            {/* News 3 */}
            <div className="bg-neutral-900 rounded-3xl border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-sky-500/50 transition-all">
              <div className="p-8">
                <div className="flex justify-between items-center text-xs text-neutral-500 mb-4 font-mono">
                  <span className="text-emerald-400 font-bold uppercase">Finanza Agevolata</span>
                  <span>20 Luglio 2026</span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-sky-400 transition-colors">
                  Fondo Impresa Femminile & StartUp Innovative: nuovi contributi a fondo perduto
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  Aperti i termini per la presentazione delle domande di agevolazione. Lo Studio Gigliotti offre assistenza dedicata alla redazione del business plan.
                </p>
              </div>
              <div className="p-6 bg-black/40 border-t border-white/5 flex justify-between items-center text-xs">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <LinkedinLogo size={16} className="text-sky-400" />
                  Postato su LinkedIn
                </span>
                <a href="https://www.linkedin.com/company/studio-gigliotti/?originalSubdomain=it" target="_blank" rel="noreferrer" className="text-sky-400 font-bold hover:underline flex items-center gap-1">
                  Leggi su LinkedIn <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Banner LinkedIn Sync Explanation */}
          <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-sky-950/60 via-neutral-900 to-black border border-sky-500/30 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-sky-500 text-black rounded-2xl">
                <LinkedinLogo size={32} weight="fill" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Pagina Ufficiale LinkedIn Studio Gigliotti</h4>
                <p className="text-neutral-400 text-sm mt-1">Ogni nuovo bando o circolare pubblicata sulla pagina LinkedIn ufficiale di Studio Gigliotti compare automaticamente qui in tempo reale.</p>
              </div>
            </div>
            <a href="https://www.linkedin.com/company/studio-gigliotti/?originalSubdomain=it" target="_blank" rel="noreferrer" className="px-6 py-3 bg-sky-500 text-black hover:bg-sky-400 rounded-full font-bold text-xs uppercase tracking-wider shrink-0 flex items-center gap-2">
              Segui la Pagina LinkedIn <ArrowUpRight size={16} />
            </a>
          </div>
        </section>

        {/* Footer Call to Action */}
        <footer id="contact" className="py-48 text-center relative bg-black flex flex-col items-center justify-center px-6">
          <h2 className="text-[clamp(3.5rem,8vw,8rem)] font-bold leading-[0.9] tracking-tighter mb-16">
            Build your <br /> financial fortress.
          </h2>
          <button className="px-12 py-6 bg-white text-black text-xl font-bold rounded-full shadow-2xl hover:scale-105 transition-transform duration-500 flex items-center gap-4">
            Initiate Connection <ArrowRight />
          </button>

          <div className="mt-48 w-full max-w-7xl border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center text-neutral-500 text-sm">
            <div className="text-white font-bold tracking-wider mb-4 md:mb-0 text-xl">GIO.</div>
            <div className="flex gap-8 flex-wrap justify-center">
              <a href="#expertise" onClick={(e) => scrollToSection(e, '#expertise')} className="hover:text-white transition-colors">Expertise</a>
              <a href="#vision" onClick={(e) => scrollToSection(e, '#vision')} className="hover:text-white transition-colors">Vision</a>
              <a href="#mission" onClick={(e) => scrollToSection(e, '#mission')} className="hover:text-white transition-colors">Mission</a>
              <a href="#utility" onClick={(e) => scrollToSection(e, '#utility')} className="hover:text-white transition-colors">Utility</a>
              <a href="#news" onClick={(e) => scrollToSection(e, '#news')} className="hover:text-white transition-colors">News & Bandi</a>
            </div>
            <div className="mt-4 md:mt-0">&copy; 2026 Studio Gigliotti. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </>
  );
}
