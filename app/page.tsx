"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Buildings,
  Calculator,
  ChartBar,
  Briefcase,
  Play,
  ArrowUpRight,
  Target,
  Newspaper,
  LinkedinLogo,
  DownloadSimple,
  CheckCircle,
  TrendUp,
  Eye,
  Handshake,
  VideoCamera,
  CalendarPlus,
  Copy,
  ArrowLeft,
  List,
  X,
  EnvelopeSimple
} from "@phosphor-icons/react";

export default function Home() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const mainSiteRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const flashOverlayRef = useRef<HTMLDivElement>(null);

  // Active layer state
  const isDashboardActive = useRef(true);

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Booking State
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedService, setSelectedService] = useState("Consulenza Fiscale & Societaria");
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
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

    // Desktop Mouse Tilt
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDashboardActive.current || !gridContainerRef.current) return;
      const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
      gsap.to(gridContainerRef.current, {
        rotationY: -20 + xAxis * 0.5,
        rotationX: 15 - yAxis * 0.5,
        duration: 1,
        ease: "power1.out",
      });
    };

    // Mobile Touch Tilt
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDashboardActive.current || !gridContainerRef.current || !e.touches[0]) return;
      const touch = e.touches[0];
      const xAxis = (window.innerWidth / 2 - touch.clientX) / 15;
      const yAxis = (window.innerHeight / 2 - touch.clientY) / 15;
      gsap.to(gridContainerRef.current, {
        rotationY: -8 + xAxis * 0.3,
        rotationX: 8 - yAxis * 0.3,
        duration: 0.5,
        ease: "power1.out",
      });
    };

    // Interactive scroll & swipe motion logic for cards
    let scrollShift = 0;
    let targetScrollShift = 0;
    let isTouching = false;
    let lastTouchY = 0;
    let lastTouchX = 0;

    const handleWheel = (e: WheelEvent) => {
      if (!isDashboardActive.current) return;
      targetScrollShift += e.deltaY * 0.45;
      targetScrollShift = Math.max(-60, Math.min(60, targetScrollShift));
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!isDashboardActive.current || !e.touches[0]) return;
      isTouching = true;
      lastTouchY = e.touches[0].clientY;
      lastTouchX = e.touches[0].clientX;
    };

    const handleTouchMoveScroll = (e: TouchEvent) => {
      if (!isDashboardActive.current || !e.touches[0]) return;
      const deltaY = lastTouchY - e.touches[0].clientY;
      const deltaX = lastTouchX - e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
      lastTouchX = e.touches[0].clientX;

      targetScrollShift += deltaY * 0.7 + deltaX * 0.4;
      targetScrollShift = Math.max(-60, Math.min(60, targetScrollShift));
    };

    const handleTouchEnd = () => {
      isTouching = false;
    };

    let animFrameId: number;
    const updateDashboardMotion = () => {
      if (isDashboardActive.current && gridContainerRef.current) {
        scrollShift += (targetScrollShift - scrollShift) * 0.12;
        if (!isTouching) {
          targetScrollShift *= 0.93;
        }
        gridContainerRef.current.style.setProperty("--scroll-shift", `${scrollShift.toFixed(2)}px`);
      }
      animFrameId = requestAnimationFrame(updateDashboardMotion);
    };
    animFrameId = requestAnimationFrame(updateDashboardMotion);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMoveScroll, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMoveScroll);
      window.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animFrameId);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const initiateExploration = (clickedCard: HTMLElement, targetSectionAnchor: string | null = null) => {
    if (!dashboardRef.current || !mainSiteRef.current || !flashOverlayRef.current) return;

    isDashboardActive.current = false;

    const tl = gsap.timeline({
      onComplete: () => {
        runSiteAnimations();
        if (targetSectionAnchor) {
          const target = document.querySelector(targetSectionAnchor);
          if (target) {
            target.scrollIntoView({ behavior: "instant", block: "start" });
          }
        }
      },
    });

    // 1. Blur non-clicked cards
    gsap.to(".dash-card", {
      filter: "blur(10px)",
      opacity: 0,
      z: -1000,
      duration: 0.6,
      ease: "power2.in",
    });

    // Bring clicked card to top
    gsap.set(clickedCard, { zIndex: 9999, opacity: 1, filter: "none" });

    // 2. Straighten 3D Grid
    tl.to(
      gridContainerRef.current,
      {
        rotationX: 0,
        rotationY: 0,
        duration: 0.8,
        ease: "power4.inOut",
      },
      "-=0.4"
    );

    // 3. Zoom into card
    tl.to(
      clickedCard,
      {
        z: 1200,
        scale: 3,
        rotationZ: 25,
        duration: 1,
        opacity: 1,
        ease: "expo.inOut",
      },
      "-=0.6"
    );

    // 4. White flash overlay
    tl.to(
      flashOverlayRef.current,
      {
        opacity: 1,
        duration: 0.4,
        ease: "power2.in",
      },
      "-=0.3"
    );

    // 5. Swap to Main Site
    tl.set(dashboardRef.current, { display: "none" });
    tl.set(mainSiteRef.current, { visibility: "visible", opacity: 1 });
    tl.set("body", { overflowY: "auto" });

    // 6. Reveal Main Site
    tl.to(flashOverlayRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  const returnToDashboard = () => {
    if (!dashboardRef.current || !mainSiteRef.current || !flashOverlayRef.current) return;

    isDashboardActive.current = true;
    setIsMobileMenuOpen(false);

    window.scrollTo({ top: 0, behavior: "instant" });

    const tl = gsap.timeline();

    tl.to(flashOverlayRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.in",
    });

    tl.set(mainSiteRef.current, { visibility: "hidden", opacity: 0 });
    tl.set(dashboardRef.current, { display: "flex" });
    tl.set("body", { overflowY: "hidden" });

    gsap.set(".dash-card", { clearProps: "filter,opacity,z,zIndex,scale,rotationZ" });
    gsap.set("#active-card", { clearProps: "filter,opacity,z,zIndex,scale,rotationZ" });
    gsap.set(gridContainerRef.current, { clearProps: "rotationX,rotationY" });

    tl.to(flashOverlayRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  const runSiteAnimations = () => {
    const siteTl = gsap.timeline();

    siteTl
      .to("#hero-title", {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "expo.out",
      })
      .to(
        "#hero-cta",
        {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        },
        "-=1"
      );

    setupScrollTriggers();
  };

  const setupScrollTriggers = () => {
    gsap.utils.toArray(".card-reveal").forEach((card: any) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          scroller: "#main-site",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
      });
    });

    gsap.to("#vision-img", {
      scrollTrigger: {
        trigger: ".image-container",
        scroller: "#main-site",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
      scale: 1,
      y: -20,
    });
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, targetSection: string | null = null) => {
    initiateExploration(e.currentTarget, targetSection);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const target = document.querySelector(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomSlug =
      "gigliotti-" +
      Math.random().toString(36).substring(2, 6) +
      "-" +
      Math.random().toString(36).substring(2, 5);
    const meetUrl = `https://meet.google.com/${randomSlug}`;
    setGeneratedMeetUrl(meetUrl);

    const title = encodeURIComponent(`Consulenza Studio Gigliotti: ${selectedService}`);
    const details = encodeURIComponent(
      `Incontro Google Meet con Studio Gigliotti.\nPartecipanti: ${clientName} (${clientEmail}), william_gigliotti@arubapec.it\nLink Google Meet: ${meetUrl}\nNote: ${
        clientNotes || "Nessuna"
      }`
    );
    const dateClean = selectedDate.replace(/-/g, "");
    const timeClean = selectedTime.replace(":", "") + "00";
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
      <div id="dashboard" ref={dashboardRef} className="flex flex-col items-center justify-center pt-4 sm:pt-8 px-3 sm:px-6">
        {/* Header Header Info */}
        <div className="absolute top-4 sm:top-6 w-full flex flex-col items-center justify-center text-center z-50 pointer-events-none px-4">
          <Image
            src="/assets/logo.jpg"
            alt="Logo Studio Gigliotti"
            width={72}
            height={72}
            className="w-14 h-14 sm:w-18 sm:h-18 rounded-full border-2 border-white shadow-xl object-cover scale-100 sm:scale-110 hover:scale-125 transition-all duration-500 mb-1 sm:mb-2 pointer-events-auto"
          />
          <h2 className="text-2xl sm:text-3xl font-bold text-sky-950 drop-shadow-md tracking-tight">Studio Gigliotti</h2>
          <p className="text-sky-900 font-semibold text-xs sm:text-sm mt-0.5 drop-shadow-md">
            Seleziona una Card per Esplorare il Sito
          </p>
        </div>

        {/* 3D Grid */}
        <div className="grid-container mt-12 sm:mt-16" ref={gridContainerRef}>
          {/* Card 1: Expertise */}
          <div
            className="dash-card opacity-90 cursor-pointer"
            style={{ "--offset-y": "20px" } as React.CSSProperties}
            onClick={(e) => handleCardClick(e, "#expertise")}
          >
            <Image
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=60"
              alt="Expertise"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white/95 border border-white/90 py-1 px-2.5 sm:py-1.5 sm:px-3.5 rounded-full text-[10px] sm:text-xs font-bold text-black shadow-md backdrop-blur flex items-center gap-1.5 card-badge">
              <Briefcase size={16} className="text-black shrink-0" />
              Expertise
            </div>
          </div>

          {/* Card 2: Our Vision */}
          <div
            className="dash-card opacity-90 cursor-pointer"
            style={{ "--offset-x": "10px" } as React.CSSProperties}
            onClick={(e) => handleCardClick(e, "#vision")}
          >
            <Image src="/assets/tutti.jpg" alt="Vision" fill className="object-cover" />
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white/95 border border-white/90 py-1 px-2.5 sm:py-1.5 sm:px-3.5 rounded-full text-[10px] sm:text-xs font-bold text-black shadow-md backdrop-blur flex items-center gap-1.5 card-badge">
              <Eye size={16} className="text-black shrink-0" />
              Our Vision
            </div>
          </div>

          {/* Card 3: Connect */}
          <div
            className="dash-card opacity-90 cursor-pointer"
            onClick={(e) => handleCardClick(e, "#contact")}
          >
            <Image
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=60"
              alt="Contact"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white/95 border border-white/90 py-1 px-2.5 sm:py-1.5 sm:px-3.5 rounded-full text-[10px] sm:text-xs font-bold text-black shadow-md backdrop-blur flex items-center gap-1.5 card-badge">
              <Handshake size={16} className="text-black shrink-0" />
              Connect
            </div>
          </div>

          {/* Card 4: Our Mission */}
          <div
            className="dash-card opacity-90 cursor-pointer"
            style={{ "--offset-y": "-10px" } as React.CSSProperties}
            onClick={(e) => handleCardClick(e, "#mission")}
          >
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=60"
              alt="Our Mission"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white/95 border border-white/90 py-1 px-2.5 sm:py-1.5 sm:px-3.5 rounded-full text-[10px] sm:text-xs font-bold text-black shadow-md backdrop-blur flex items-center gap-1.5 card-badge">
              <Target size={16} className="text-black shrink-0" />
              Our Mission
            </div>
          </div>

          {/* Card 5: Utility & Calcolatori */}
          <div
            className="dash-card opacity-90 cursor-pointer"
            onClick={(e) => handleCardClick(e, "#utility")}
          >
            <Image
              src="https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=400&q=60"
              alt="Utility e Calcolatori"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white/95 border border-white/90 py-1 px-2.5 sm:py-1.5 sm:px-3.5 rounded-full text-[10px] sm:text-xs font-bold text-black shadow-md backdrop-blur flex items-center gap-1.5 card-badge">
              <Calculator size={16} className="text-black shrink-0" />
              Utility & Calcolatori
            </div>
          </div>

          {/* Card 6: News & Bandi */}
          <div
            className="dash-card opacity-90 cursor-pointer"
            style={{ "--offset-y": "-30px" } as React.CSSProperties}
            onClick={(e) => handleCardClick(e, "#news")}
          >
            <Image
              src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=400&q=60"
              alt="News e Bandi"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white/95 border border-white/90 py-1 px-2.5 sm:py-1.5 sm:px-3.5 rounded-full text-[10px] sm:text-xs font-bold text-black shadow-md backdrop-blur flex items-center gap-1.5 card-badge">
              <Newspaper size={16} className="text-black shrink-0" />
              News & Bandi
            </div>
          </div>
        </div>
      </div>

      {/* MAIN SITE LAYER */}
      <div id="main-site" ref={mainSiteRef}>
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 w-full z-50 p-4 sm:p-6 flex justify-between items-center glass-nav">
          <div
            className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-white/20 bg-black flex items-center justify-center cursor-pointer shrink-0"
            onClick={returnToDashboard}
            title="Torna alla Dashboard"
          >
            <Image
              src="/assets/logo.jpg"
              alt="Studio Gigliotti Logo"
              fill
              className="object-cover hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-6 px-8 py-3 bg-white/5 border border-white/10 backdrop-blur-md rounded-full">
            <a
              href="#expertise"
              onClick={(e) => scrollToSection(e, "#expertise")}
              className="text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors font-medium"
            >
              Expertise
            </a>
            <a
              href="#vision"
              onClick={(e) => scrollToSection(e, "#vision")}
              className="text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors font-medium"
            >
              Vision
            </a>
            <a
              href="#mission"
              onClick={(e) => scrollToSection(e, "#mission")}
              className="text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors font-medium"
            >
              Mission
            </a>
            <a
              href="#utility"
              onClick={(e) => scrollToSection(e, "#utility")}
              className="text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors font-medium"
            >
              Utility & Metodo
            </a>
            <a
              href="#news"
              onClick={(e) => scrollToSection(e, "#news")}
              className="text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors font-medium"
            >
              News & Bandi
            </a>
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, "#contact")}
              className="text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors font-medium"
            >
              Prenota Call
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={returnToDashboard}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-white text-black text-[11px] sm:text-xs uppercase tracking-widest font-bold rounded-full hover:bg-neutral-200 transition-colors shadow-md"
            >
              Dashboard
            </button>

            {/* Mobile Hamburger Drawer Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 bg-white/10 text-white rounded-full border border-white/20 hover:bg-white/20 transition-colors flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <List size={22} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl pt-28 px-6 pb-10 flex flex-col justify-between">
            <div className="flex flex-col space-y-6 text-center">
              <a
                href="#expertise"
                onClick={(e) => scrollToSection(e, "#expertise")}
                className="text-lg uppercase tracking-widest text-neutral-200 hover:text-sky-400 font-bold py-2 border-b border-white/10"
              >
                Expertise
              </a>
              <a
                href="#vision"
                onClick={(e) => scrollToSection(e, "#vision")}
                className="text-lg uppercase tracking-widest text-neutral-200 hover:text-sky-400 font-bold py-2 border-b border-white/10"
              >
                Vision
              </a>
              <a
                href="#mission"
                onClick={(e) => scrollToSection(e, "#mission")}
                className="text-lg uppercase tracking-widest text-neutral-200 hover:text-sky-400 font-bold py-2 border-b border-white/10"
              >
                Mission
              </a>
              <a
                href="#utility"
                onClick={(e) => scrollToSection(e, "#utility")}
                className="text-lg uppercase tracking-widest text-neutral-200 hover:text-sky-400 font-bold py-2 border-b border-white/10"
              >
                Utility & Metodo
              </a>
              <a
                href="#news"
                onClick={(e) => scrollToSection(e, "#news")}
                className="text-lg uppercase tracking-widest text-neutral-200 hover:text-sky-400 font-bold py-2 border-b border-white/10"
              >
                News & Bandi
              </a>
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, "#contact")}
                className="text-lg uppercase tracking-widest text-sky-400 font-bold py-2 border-b border-white/10 flex items-center justify-center gap-2"
              >
                <VideoCamera size={20} /> Prenota Call Google Meet
              </a>
            </div>

            <div className="text-center pt-6">
              <button
                onClick={returnToDashboard}
                className="w-full py-4 bg-sky-500 text-black font-extrabold rounded-full uppercase tracking-wider text-sm shadow-xl"
              >
                Torna alla Dashboard 3D
              </button>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-sky-500/10 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none"></div>

          <div className="w-full max-w-5xl text-center flex flex-col items-center relative z-10">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sky-400 text-[10px] sm:text-xs uppercase tracking-widest font-bold mb-6 sm:mb-8 shadow-inner">
              <Buildings size={16} /> Studio Commercialista & Advisory Firm
            </div>

            {/* Main Title */}
            <h1
              id="hero-title"
              className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 sm:mb-8 leading-[1.15]"
            >
              <span className="block text-white">Chiarezza Fiscale e</span>
              <span className="block bg-gradient-to-r from-sky-300 via-sky-100 to-white bg-clip-text text-transparent">
                Strategia Finanziaria per l&apos;Impresa
              </span>
            </h1>

            {/* Subtitle in Italian */}
            <p className="text-neutral-300 text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed mb-8 sm:mb-10 font-normal px-2">
              Affianchiamo aziende, startup e professionisti nell&apos;ottimizzazione del carico fiscale, nel controllo di gestione e nell&apos;accesso alle migliori opportunità di finanza agevolata.
            </p>

            {/* CTAs */}
            <div id="hero-cta" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5 mb-12 sm:mb-16 w-full sm:w-auto px-4 sm:px-0">
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, "#contact")}
                className="group px-6 py-3.5 sm:px-8 sm:py-4 bg-sky-500 hover:bg-sky-400 text-black font-extrabold rounded-full transition-all flex items-center justify-center gap-3 shadow-lg shadow-sky-500/25 scale-100 hover:scale-105 text-sm sm:text-base"
              >
                <VideoCamera size={20} /> Prenota Call Google Meet
              </a>
              <a
                href="#utility"
                onClick={(e) => scrollToSection(e, "#utility")}
                className="px-6 py-3.5 sm:px-8 sm:py-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white rounded-full font-bold transition-all flex items-center justify-center gap-2 backdrop-blur-md text-sm sm:text-base"
              >
                <Calculator size={18} className="text-sky-400" /> Calcolatori & Utility
              </a>
            </div>

            {/* Value Proposition Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full text-left mt-2">
              <div className="p-5 sm:p-6 rounded-2xl bg-neutral-900/60 border border-white/10 backdrop-blur-lg">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400 flex items-center justify-center mb-3 sm:mb-4">
                  <VideoCamera size={20} />
                </div>
                <h3 className="text-white font-bold text-base mb-1">100% Consulenza Remota</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                  Video call dedicate su Google Meet e condivisione sicura dei documenti in cloud.
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-neutral-900/60 border border-white/10 backdrop-blur-lg">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 flex items-center justify-center mb-3 sm:mb-4">
                  <Target size={20} />
                </div>
                <h3 className="text-white font-bold text-base mb-1">Finanza Agevolata & Bandi</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                  Supporto per Transizione 5.0, crediti d&apos;imposta e contributi a fondo perduto.
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-neutral-900/60 border border-white/10 backdrop-blur-lg">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/20 text-purple-400 flex items-center justify-center mb-3 sm:mb-4">
                  <TrendUp size={20} />
                </div>
                <h3 className="text-white font-bold text-base mb-1">Pianificazione & Controllo</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                  Analisi dei flussi di cassa e reportistica per decisioni aziendali trasparenti e sicure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Expertise */}
        <section id="expertise" className="py-20 md:py-36 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="mb-10 sm:mb-12">
            <span className="text-xs uppercase tracking-widest text-sky-400 font-bold">Aree di Intervento</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2">Le Nostre Competenze Core</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] sm:auto-rows-[300px] gap-4 sm:gap-6 grid-flow-dense">
            <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-neutral-900 rounded-3xl p-6 sm:p-10 flex flex-col justify-end border border-white/5 card-reveal">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                alt="Advisory"
                fill
                className="object-cover opacity-60 grayscale group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="relative z-20">
                <Buildings className="text-4xl sm:text-5xl mb-4 sm:mb-6 text-white" />
                <h3 className="text-2xl sm:text-3xl font-semibold mb-2 sm:mb-4">Corporate Advisory</h3>
                <p className="text-neutral-400 text-sm sm:text-lg max-w-md">
                  Strutturazione strategica, governance globale e architettura di gestione del rischio aziendale.
                </p>
              </div>
            </div>

            <div className="md:col-span-2 md:row-span-1 relative group overflow-hidden bg-neutral-900 rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-white/5 card-reveal">
              <div className="flex justify-between items-start">
                <Calculator className="text-2xl sm:text-3xl text-white" />
                <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity text-xl text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2">Tax Engineering</h3>
                <p className="text-neutral-400 text-xs sm:text-sm">
                  Pianificazione fiscale transfrontaliera e ottimizzazione del carico tributario societario.
                </p>
              </div>
            </div>

            <div className="md:col-span-1 md:row-span-1 relative group overflow-hidden bg-neutral-900 rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-white/5 card-reveal">
              <ChartBar className="text-2xl sm:text-3xl text-white" />
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1">Auditing</h3>
                <p className="text-neutral-500 text-xs sm:text-sm">Audit predittivo e revisione contabile d&apos;eccellenza.</p>
              </div>
            </div>

            <div className="md:col-span-1 md:row-span-1 relative group overflow-hidden bg-white text-black rounded-3xl p-6 sm:p-8 flex flex-col justify-between card-reveal">
              <Briefcase className="text-2xl sm:text-3xl" />
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-1">Wealth & Estate</h3>
                <p className="text-neutral-600 text-xs sm:text-sm">Protezione patrimoniale e passaggio generazionale.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Our Vision */}
        <section id="vision" className="relative py-20 sm:py-32 px-4 sm:px-6 bg-black overflow-hidden min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-20 items-center">
            <div className="relative h-[40vh] sm:h-[60vh] lg:h-[70vh] rounded-3xl overflow-hidden image-container">
              <Image
                id="vision-img"
                src="/assets/tutti.jpg"
                alt="GIO Team"
                fill
                className="object-cover grayscale brightness-75 contrast-125 transform scale-110"
              />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-sky-400 font-bold">La Nostra Visione</span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold leading-tight mb-6 sm:mb-8 tracking-tight mt-2">
                Un'eredità di <br />
                <span className="font-light italic gradient-text">precisione</span> & fiducia.
              </h2>
              <p className="text-base sm:text-xl text-gray-400 leading-relaxed mb-8 sm:mb-12 max-w-lg">
                Uniamo il rigore matematico con la strategia finanziaria ad alto impatto. Decenni di affiancamento a capitali privati ed imprese.
              </p>
              <div className="w-full h-px bg-white/10 mb-8"></div>
              <div className="flex gap-10 sm:gap-16">
                <div>
                  <span className="block text-4xl sm:text-5xl font-bold mb-1 sm:mb-2 tracking-tighter text-white">25+</span>
                  <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-widest font-semibold">Anni di Esperienza</span>
                </div>
                <div>
                  <span className="block text-4xl sm:text-5xl font-bold mb-1 sm:mb-2 tracking-tighter text-white">€2B+</span>
                  <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-widest font-semibold">Patrimonio Assistito</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Our Mission */}
        <section id="mission" className="py-20 sm:py-36 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Target size={16} />
                Our Mission
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6">
                Guida Strategica & Valore Sostenibile.
              </h2>
              <p className="text-neutral-400 text-base sm:text-lg leading-relaxed mb-8">
                La nostra mission è affiancare aziende ed imprenditori con soluzioni finanziarie e tributarie ad alto impatto. Uniamo il rigore dell&apos;analisi alla visione strategica, trasformando ogni complessità fiscale in una leva di crescita.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-white/5">
                  <div className="p-3 bg-sky-500/10 rounded-xl text-sky-400 shrink-0">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-base sm:text-lg">Trasparenza & Accuratezza</h4>
                    <p className="text-neutral-400 text-xs sm:text-sm mt-1">Audit rigorosi e reportistica chiara per decisioni aziendali informate e tempestive.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-white/5">
                  <div className="p-3 bg-sky-500/10 rounded-xl text-sky-400 shrink-0">
                    <TrendUp size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-base sm:text-lg">Pianificazione Proattiva</h4>
                    <p className="text-neutral-400 text-xs sm:text-sm mt-1">Anticipiamo i cambiamenti normativi creando modelli di sviluppo su misura per ogni cliente.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-white/5 flex flex-col justify-between h-60 sm:h-72">
                <span className="text-3xl sm:text-4xl font-light text-sky-400">01</span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">Presidio Fiscale globale</h3>
                  <p className="text-neutral-400 text-xs sm:text-sm">Tutela costante del patrimonio aziendale e personale con metodologie d&apos;eccellenza.</p>
                </div>
              </div>

              <div className="bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-white/5 flex flex-col justify-between h-60 sm:h-72 sm:translate-y-8">
                <span className="text-3xl sm:text-4xl font-light text-sky-400">02</span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">Digital Accounting</h3>
                  <p className="text-neutral-400 text-xs sm:text-sm">Integrazione di strumenti tecnologici avanzati per una gestione contabile in tempo reale.</p>
                </div>
              </div>

              <div className="bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-white/5 flex flex-col justify-between h-60 sm:h-72">
                <span className="text-3xl sm:text-4xl font-light text-sky-400">03</span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">Governance & M&A</h3>
                  <p className="text-neutral-400 text-xs sm:text-sm">Supporto in operazioni straordinarie, riassetti societari e finanza straordinaria.</p>
                </div>
              </div>

              <div className="bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-white/5 flex flex-col justify-between h-60 sm:h-72 sm:translate-y-8">
                <span className="text-3xl sm:text-4xl font-light text-sky-400">04</span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">ESG & Sostenibilità</h3>
                  <p className="text-neutral-400 text-xs sm:text-sm">Accompagnamento nei percorsi di sostenibilità e compliance ai nuovi standard europei.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Utility & Calcolatori */}
        <section id="utility" className="py-20 sm:py-36 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10 bg-neutral-950/60 rounded-3xl my-8 sm:my-12">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4">
              <Calculator size={16} />
              Utility & Calcolatori
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">Strumenti Pratici & Metodo Operativo</h2>
            <p className="text-neutral-400 text-base sm:text-lg px-2">
              Mettiamo a disposizione dei nostri clienti risorse interattive, simulazioni d&apos;impatto finanziario e la nostra metodologia di lavoro in 4 step per garantire chiarezza in ogni fase.
            </p>
          </div>

          {/* Utility Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-20">
            {/* Utility 1 */}
            <div className="bg-neutral-900/90 border border-white/10 p-6 sm:p-8 rounded-3xl flex flex-col justify-between hover:border-white/30 transition-all group">
              <div>
                <div className="p-4 bg-white/5 rounded-2xl w-fit mb-6 text-sky-400 group-hover:scale-110 transition-transform">
                  <Calculator size={32} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3">Simulatore di Budgeting & Imposte</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6">
                  Calcola in autonomia una stima orientativa della pressione fiscale e proietta i flussi di cassa operativi per il prossimo trimestre.
                </p>
              </div>
              <button className="w-full py-3.5 bg-white/10 hover:bg-white text-white hover:text-black rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                Avvia Calcolatore <ArrowRight size={14} />
              </button>
            </div>

            {/* Utility 2 */}
            <div className="bg-neutral-900/90 border border-white/10 p-6 sm:p-8 rounded-3xl flex flex-col justify-between hover:border-white/30 transition-all group">
              <div>
                <div className="p-4 bg-white/5 rounded-2xl w-fit mb-6 text-sky-400 group-hover:scale-110 transition-transform">
                  <DownloadSimple size={32} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3">Checklist Documentale</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6">
                  Download immediato delle pratiche e dei modelli necessari per bilanci, dichiarazioni e adempimenti periodici.
                </p>
              </div>
              <button className="w-full py-3.5 bg-white/10 hover:bg-white text-white hover:text-black rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                Scarica Kit Risorse <DownloadSimple size={14} />
              </button>
            </div>

            {/* Utility 3 */}
            <div className="bg-neutral-900/90 border border-white/10 p-6 sm:p-8 rounded-3xl flex flex-col justify-between hover:border-white/30 transition-all group">
              <div>
                <div className="p-4 bg-white/5 rounded-2xl w-fit mb-6 text-sky-400 group-hover:scale-110 transition-transform">
                  <TrendUp size={32} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3">Analisi Convenienza Bando</h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6">
                  Test rapido di pre-fattibilità per verificare l&apos;idoneità della tua impresa ai finanziamenti agevolati del PNRR e regionali.
                </p>
              </div>
              <button className="w-full py-3.5 bg-white/10 hover:bg-white text-white hover:text-black rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                Verifica Requisiti <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Metodo Operativo */}
          <div className="border border-white/10 rounded-3xl p-6 sm:p-12 bg-neutral-900/50">
            <h3 className="text-xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Come Opera lo Studio Gigliotti</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-5 sm:p-6 bg-black/40 rounded-2xl border border-white/5">
                <span className="text-sky-400 font-mono text-xs sm:text-sm font-bold">STEP 01</span>
                <h4 className="font-bold text-base sm:text-lg mt-2 mb-1">Check-up Iniziale</h4>
                <p className="text-neutral-400 text-xs">Analisi preliminare della situazione contabile e rilevazione delle criticità.</p>
              </div>
              <div className="p-5 sm:p-6 bg-black/40 rounded-2xl border border-white/5">
                <span className="text-sky-400 font-mono text-xs sm:text-sm font-bold">STEP 02</span>
                <h4 className="font-bold text-base sm:text-lg mt-2 mb-1">Piano Strategico</h4>
                <p className="text-neutral-400 text-xs">Definizione della roadmap fiscale e degli obiettivi economico-patrimoniali.</p>
              </div>
              <div className="p-5 sm:p-6 bg-black/40 rounded-2xl border border-white/5">
                <span className="text-sky-400 font-mono text-xs sm:text-sm font-bold">STEP 03</span>
                <h4 className="font-bold text-base sm:text-lg mt-2 mb-1">Esecuzione Digitale</h4>
                <p className="text-neutral-400 text-xs">Gestione continua delle pratiche con condivisione cloud e controllo costi.</p>
              </div>
              <div className="p-5 sm:p-6 bg-black/40 rounded-2xl border border-white/5">
                <span className="text-sky-400 font-mono text-xs sm:text-sm font-bold">STEP 04</span>
                <h4 className="font-bold text-base sm:text-lg mt-2 mb-1">Monitoring & Audit</h4>
                <p className="text-neutral-400 text-xs">Revisioni periodiche e riallineamento costante in base alle novità normative.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: News & Bandi (LinkedIn Live Integration) */}
        <section id="news" className="py-20 sm:py-36 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 sm:mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-950 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider mb-4">
                <LinkedinLogo size={16} />
                LinkedIn Live Integration
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight">News & Bandi</h2>
              <p className="text-neutral-400 text-base sm:text-lg mt-3 max-w-2xl">
                Aggiornamenti in tempo reale, circolari operative e opportunità di finanza agevolata. Questa sezione è direttamente collegata alla pagina LinkedIn di Studio Gigliotti.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-neutral-900 border border-white/10 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shrink-0"></div>
              <span className="text-xs font-mono text-neutral-300">Sincronizzazione Automatica LinkedIn Attiva</span>
            </div>
          </div>

          {/* News Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* News 1 */}
            <div className="bg-neutral-900 rounded-3xl border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-sky-500/50 transition-all">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center text-xs text-neutral-500 mb-4 font-mono">
                  <span className="text-sky-400 font-bold uppercase">Bando Attivo</span>
                  <span>28 Luglio 2026</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 group-hover:text-sky-400 transition-colors">
                  Transizione 5.0: Pubblicate le nuove linee guida operative per il credito d&apos;imposta
                </h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6">
                  Focus sui requisiti di efficientamento energetico e digitalizzazione. Le imprese possono prenotare le risorse per i progetti avviati nel 2026.
                </p>
              </div>
              <div className="p-5 sm:p-6 bg-black/40 border-t border-white/5 flex justify-between items-center text-xs">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <LinkedinLogo size={16} className="text-sky-400 shrink-0" />
                  Postato su LinkedIn
                </span>
                <a
                  href="https://www.linkedin.com/company/studio-gigliotti/?originalSubdomain=it"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 font-bold hover:underline flex items-center gap-1"
                >
                  Leggi su LinkedIn <ArrowUpRight size={14} />
                </a>
              </div>
            </div>

            {/* News 2 */}
            <div className="bg-neutral-900 rounded-3xl border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-sky-500/50 transition-all">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center text-xs text-neutral-500 mb-4 font-mono">
                  <span className="text-amber-400 font-bold uppercase">Fisco & Bilancio</span>
                  <span>24 Luglio 2026</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 group-hover:text-sky-400 transition-colors">
                  Scadenziario Fiscale Luglio/Agosto: proroghe e versamenti per i soggetti ISA
                </h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6">
                  Sintesi operativa delle principali scadenze di mezza estate e indicazioni per la rateizzazione delle imposte derivanti dal Modello REDDITI.
                </p>
              </div>
              <div className="p-5 sm:p-6 bg-black/40 border-t border-white/5 flex justify-between items-center text-xs">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <LinkedinLogo size={16} className="text-sky-400 shrink-0" />
                  Postato su LinkedIn
                </span>
                <a
                  href="https://www.linkedin.com/company/studio-gigliotti/?originalSubdomain=it"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 font-bold hover:underline flex items-center gap-1"
                >
                  Leggi su LinkedIn <ArrowUpRight size={14} />
                </a>
              </div>
            </div>

            {/* News 3 */}
            <div className="bg-neutral-900 rounded-3xl border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-sky-500/50 transition-all">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center text-xs text-neutral-500 mb-4 font-mono">
                  <span className="text-emerald-400 font-bold uppercase">Finanza Agevolata</span>
                  <span>20 Luglio 2026</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 group-hover:text-sky-400 transition-colors">
                  Fondo Impresa Femminile & StartUp Innovative: nuovi contributi a fondo perduto
                </h3>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6">
                  Aperti i termini per la presentazione delle domande di agevolazione. Lo Studio Gigliotti offre assistenza dedicata alla redazione del business plan.
                </p>
              </div>
              <div className="p-5 sm:p-6 bg-black/40 border-t border-white/5 flex justify-between items-center text-xs">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <LinkedinLogo size={16} className="text-sky-400 shrink-0" />
                  Postato su LinkedIn
                </span>
                <a
                  href="https://www.linkedin.com/company/studio-gigliotti/?originalSubdomain=it"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 font-bold hover:underline flex items-center gap-1"
                >
                  Leggi su LinkedIn <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Banner LinkedIn Sync */}
          <div className="mt-8 sm:mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-950/60 via-neutral-900 to-black border border-sky-500/30 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-sky-500 text-black rounded-2xl shrink-0">
                <LinkedinLogo size={32} weight="fill" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-white">Pagina Ufficiale LinkedIn Studio Gigliotti</h4>
                <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                  Ogni nuovo bando o circolare pubblicata sulla pagina LinkedIn ufficiale di Studio Gigliotti compare automaticamente qui in tempo reale.
                </p>
              </div>
            </div>
            <a
              href="https://www.linkedin.com/company/studio-gigliotti/?originalSubdomain=it"
              target="_blank"
              rel="noreferrer"
              className="w-full md:w-auto text-center px-6 py-3.5 bg-sky-500 text-black hover:bg-sky-400 rounded-full font-bold text-xs uppercase tracking-wider shrink-0 flex items-center justify-center gap-2"
            >
              Segui la Pagina LinkedIn <ArrowUpRight size={16} />
            </a>
          </div>
        </section>

        {/* Section 6: Google Meet Booking System (#contact) */}
        <section id="contact" className="py-20 sm:py-36 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/10">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-400 text-xs uppercase tracking-widest font-bold mb-4">
              <VideoCamera size={18} /> Video Call 1-to-1 Google Meet
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
              Prenota una Consulenza in Video Call
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto">
              Scegli il servizio, la data e l&apos;orario più comodo per te. Riceverai istantaneamente l&apos;invito su <strong>Google Meet</strong> con le notifiche inviate a <code className="text-sky-300 font-mono">william_gigliotti@arubapec.it</code>.
            </p>
          </div>

          {/* BOOKING CONTAINER */}
          <div className="bg-neutral-900/90 border border-white/10 rounded-3xl p-6 sm:p-10 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-72 sm:w-96 h-72 sm:h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {!bookingConfirmed ? (
              <div className="relative z-10">
                {/* Stepper Header */}
                <div className="flex items-center justify-between max-w-2xl mx-auto mb-8 sm:mb-12 border-b border-white/10 pb-4 sm:pb-6 gap-2">
                  <div className={`flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold ${bookingStep >= 1 ? "text-sky-400" : "text-neutral-500"}`}>
                    <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black ${bookingStep >= 1 ? "bg-sky-500 text-black" : "bg-neutral-800 text-neutral-400"}`}>1</span>
                    <span className="hidden sm:inline">Servizio</span>
                  </div>
                  <div className={`flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold ${bookingStep >= 2 ? "text-sky-400" : "text-neutral-500"}`}>
                    <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black ${bookingStep >= 2 ? "bg-sky-500 text-black" : "bg-neutral-800 text-neutral-400"}`}>2</span>
                    <span className="hidden sm:inline">Data & Orario</span>
                  </div>
                  <div className={`flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold ${bookingStep >= 3 ? "text-sky-400" : "text-neutral-500"}`}>
                    <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black ${bookingStep >= 3 ? "bg-sky-500 text-black" : "bg-neutral-800 text-neutral-400"}`}>3</span>
                    <span className="hidden sm:inline">I Tuoi Dati</span>
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit}>
                  {/* STEP 1: SERVICE */}
                  {bookingStep === 1 && (
                    <div className="space-y-6">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-4">1. Seleziona la tipologia di consulenza</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        <div
                          onClick={() => {
                            setSelectedService("Consulenza Fiscale & Societaria");
                            setTimeout(() => setBookingStep(2), 160);
                          }}
                          className={`cursor-pointer bg-black/60 border p-5 sm:p-6 rounded-2xl transition-all relative overflow-hidden group ${
                            selectedService === "Consulenza Fiscale & Societaria" ? "border-sky-400 ring-2 ring-sky-400/20" : "border-white/10 hover:border-sky-400"
                          }`}
                        >
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400 flex items-center justify-center mb-4">
                            <Briefcase size={22} />
                          </div>
                          <div className="font-bold text-white text-base sm:text-lg mb-1">Consulenza Fiscale & Societaria</div>
                          <div className="text-xs text-sky-400 font-semibold mb-3">30 Minuti • Google Meet</div>
                          <p className="text-neutral-400 text-xs leading-relaxed">
                            Analisi posizioni fiscali, adempimenti societari e consulenza strategica per imprese e professionisti.
                          </p>
                        </div>

                        <div
                          onClick={() => {
                            setSelectedService("Controllo di Gestione & Budget");
                            setTimeout(() => setBookingStep(2), 160);
                          }}
                          className={`cursor-pointer bg-black/60 border p-5 sm:p-6 rounded-2xl transition-all relative overflow-hidden group ${
                            selectedService === "Controllo di Gestione & Budget" ? "border-emerald-400 ring-2 ring-emerald-400/20" : "border-white/10 hover:border-emerald-400"
                          }`}
                        >
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 flex items-center justify-center mb-4">
                            <ChartBar size={22} />
                          </div>
                          <div className="font-bold text-white text-base sm:text-lg mb-1">Controllo di Gestione & Budget</div>
                          <div className="text-xs text-emerald-400 font-semibold mb-3">45 Minuti • Google Meet</div>
                          <p className="text-neutral-400 text-xs leading-relaxed">
                            Ottimizzazione dei flussi di cassa, marginalità aziendale e reportistica direzionale.
                          </p>
                        </div>

                        <div
                          onClick={() => {
                            setSelectedService("Finanza Agevolata & Bandi");
                            setTimeout(() => setBookingStep(2), 160);
                          }}
                          className={`cursor-pointer bg-black/60 border p-5 sm:p-6 rounded-2xl transition-all relative overflow-hidden group ${
                            selectedService === "Finanza Agevolata & Bandi" ? "border-purple-400 ring-2 ring-purple-400/20" : "border-white/10 hover:border-purple-400"
                          }`}
                        >
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/10 border border-purple-400/20 text-purple-400 flex items-center justify-center mb-4">
                            <Target size={22} />
                          </div>
                          <div className="font-bold text-white text-base sm:text-lg mb-1">Finanza Agevolata & Bandi</div>
                          <div className="text-xs text-purple-400 font-semibold mb-3">45 Minuti • Google Meet</div>
                          <p className="text-neutral-400 text-xs leading-relaxed">
                            Valutazione di fattibilità per Transizione 5.0, crediti R&S e bandi di contributo a fondo perduto.
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end pt-6">
                        <button
                          type="button"
                          onClick={() => setBookingStep(2)}
                          className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          Continua (Data & Orario) <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: DATE & TIME */}
                  {bookingStep === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-4">2. Seleziona la Data e l&apos;Orario della Call</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/50 p-5 sm:p-6 rounded-2xl border border-white/10">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-3">
                            Seleziona la Data (Lun - Ven)
                          </label>
                          <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            required
                            className="w-full bg-neutral-900 border border-white/20 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-3">
                            Orari Disponibili (Google Meet)
                          </label>
                          <div className="grid grid-cols-3 gap-2.5">
                            {["09:30", "11:00", "14:30", "16:00", "17:30"].map((time) => (
                              <button
                                key={time}
                                type="button"
                                onClick={() => setSelectedTime(time)}
                                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                  selectedTime === time
                                    ? "bg-sky-500 text-black font-extrabold shadow-md"
                                    : "bg-neutral-900 border border-white/10 text-white hover:border-sky-400"
                                }`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-6 gap-4">
                        <button
                          type="button"
                          onClick={() => setBookingStep(1)}
                          className="px-6 py-3 bg-neutral-800 text-white font-bold rounded-full hover:bg-neutral-700 transition-colors flex items-center gap-2 text-xs sm:text-sm"
                        >
                          <ArrowLeft size={16} /> Indietro
                        </button>
                        <button
                          type="button"
                          onClick={() => setBookingStep(3)}
                          className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-colors flex items-center gap-2 text-xs sm:text-sm"
                        >
                          Inserisci i Dati <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: DETAILS */}
                  {bookingStep === 3 && (
                    <div className="space-y-6">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-4">3. I tuoi dati di contatto</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-2">
                            Nome e Cognome *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Mario Rossi"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-2">
                            Email (per invito Google Meet) *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="mario.rossi@azienda.it"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-2">
                            Telefono / WhatsApp *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+39 340 123 4567"
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-2">
                            Ragione Sociale / P.IVA (Opzionale)
                          </label>
                          <input
                            type="text"
                            placeholder="Rossi S.r.l."
                            value={clientCompany}
                            onChange={(e) => setClientCompany(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-neutral-400 font-bold mb-2">
                          Oggetto / Breve nota per la Call
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Descrivi brevemente l'argomento principale su cui vorresti focalizzare la video call..."
                          value={clientNotes}
                          onChange={(e) => setClientNotes(e.target.value)}
                          className="w-full bg-black/60 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-400"
                        ></textarea>
                      </div>

                      <div className="p-4 bg-sky-950/40 border border-sky-400/20 rounded-xl flex items-center gap-3 text-xs text-sky-200">
                        <EnvelopeSimple size={20} className="text-sky-400 shrink-0" />
                        <span>
                          Le notifiche ed i dettagli della prenotazione verranno inviati a:{" "}
                          <strong className="font-mono text-sky-300">william_gigliotti@arubapec.it</strong>
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4">
                        <button
                          type="button"
                          onClick={() => setBookingStep(2)}
                          className="w-full sm:w-auto px-6 py-3 bg-neutral-800 text-white font-bold rounded-full hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
                        >
                          <ArrowLeft size={16} /> Indietro
                        </button>
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-8 py-4 bg-sky-500 hover:bg-sky-400 text-black font-extrabold rounded-full transition-all flex items-center justify-center gap-3 shadow-lg shadow-sky-500/20 text-xs sm:text-sm"
                        >
                          <VideoCamera size={20} /> Conferma & Genera Google Meet
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            ) : (
              /* CONFIRMATION SCREEN */
              <div className="relative z-10 text-center py-6 sm:py-10 space-y-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-400/30">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl sm:text-4xl font-bold text-white">Prenotazione Video Call Confermata!</h3>
                <p className="text-neutral-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                  Grazie <strong>{clientName}</strong>. La tua richiesta per <strong>{selectedService}</strong> in data{" "}
                  <strong>{selectedDate}</strong> alle <strong>{selectedTime}</strong> è stata elaborata con successo.
                </p>

                {/* Meet Link Box */}
                <div className="p-6 bg-black/80 border border-sky-400/40 rounded-2xl max-w-xl mx-auto space-y-4 text-left">
                  <div className="text-xs uppercase tracking-wider text-sky-400 font-bold flex items-center gap-2">
                    <VideoCamera size={16} /> Stanza Google Meet Ufficiale
                  </div>
                  <div className="flex items-center justify-between bg-neutral-900 p-3 rounded-xl border border-white/10 gap-2">
                    <span className="font-mono text-xs sm:text-sm text-sky-300 truncate">{generatedMeetUrl}</span>
                    <button
                      onClick={copyMeetLink}
                      className="px-3 py-1.5 bg-sky-500 text-black rounded-lg text-xs font-bold hover:bg-sky-400 flex items-center gap-1.5 shrink-0"
                    >
                      <Copy size={14} /> Copia
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                  <a
                    href={gcalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 bg-sky-500 text-black font-extrabold rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-sky-400 transition-colors"
                  >
                    <CalendarPlus size={18} /> Aggiungi a Google Calendar
                  </a>
                  <button
                    onClick={resetBookingForm}
                    className="w-full sm:w-auto px-6 py-3.5 bg-neutral-800 text-white font-bold rounded-full text-xs uppercase tracking-wider hover:bg-neutral-700 transition-colors"
                  >
                    Nuova Prenotazione
                  </button>
                </div>

                <p className="text-[11px] text-neutral-500 pt-4">
                  Notifica inviata a: <code className="text-neutral-400">william_gigliotti@arubapec.it</code>
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-24 sm:py-36 text-center relative bg-black flex flex-col items-center justify-center px-4 sm:px-6 border-t border-white/10">
          <h2 className="text-4xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tighter mb-10 sm:mb-16">
            Construisci la tua <br /> fortezza finanziaria.
          </h2>
          <a
            href="#contact"
            onClick={(e) => scrollToSection(e, "#contact")}
            className="px-8 py-4 sm:px-12 sm:py-6 bg-white text-black text-lg sm:text-xl font-bold rounded-full shadow-2xl hover:scale-105 transition-transform duration-500 flex items-center gap-3"
          >
            Prenota una Call <ArrowRight />
          </a>

          <div className="mt-24 sm:mt-36 w-full max-w-7xl border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-neutral-500 text-xs sm:text-sm gap-4">
            <div className="text-white font-bold tracking-wider text-xl">STUDIO GIGLIOTTI</div>
            <div className="flex gap-6 flex-wrap justify-center">
              <a href="#expertise" onClick={(e) => scrollToSection(e, "#expertise")} className="hover:text-white transition-colors">
                Expertise
              </a>
              <a href="#vision" onClick={(e) => scrollToSection(e, "#vision")} className="hover:text-white transition-colors">
                Vision
              </a>
              <a href="#mission" onClick={(e) => scrollToSection(e, "#mission")} className="hover:text-white transition-colors">
                Mission
              </a>
              <a href="#utility" onClick={(e) => scrollToSection(e, "#utility")} className="hover:text-white transition-colors">
                Utility
              </a>
              <a href="#news" onClick={(e) => scrollToSection(e, "#news")} className="hover:text-white transition-colors">
                News & Bandi
              </a>
            </div>
            <div>&copy; 2026 Studio Gigliotti. Referente: william_gigliotti@arubapec.it</div>
          </div>
        </footer>
      </div>
    </>
  );
}
