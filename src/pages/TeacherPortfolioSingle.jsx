import React, { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  Download, ArrowDown, MapPin, Quote, Plane, Atom,
  GraduationCap, BookOpen, Award, MonitorPlay, Sparkles,
  FileSpreadsheet, Cloud, ClipboardCheck, Users, LineChart,
  MessageSquare, ChevronRight,
} from "lucide-react";
import { jsPDF } from "jspdf";
import * as THREE from "three";
import { Image } from "@/components/ui/image";

/* ═══════════════════════════════════════════════════════════
   PDF CV GENERATOR
   ═══════════════════════════════════════════════════════════ */
function downloadCV() {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = 595, M = 48;
  let y = 64;

  const line = (text, size = 11, style = "normal", gap = 16, color = [15, 23, 42]) => {
    doc.setFont("helvetica", style).setFontSize(size).setTextColor(...color);
    const rows = doc.splitTextToSize(text, W - M * 2);
    doc.text(rows, M, y);
    y += rows.length * (size * 1.35) + gap - 12;
  };

  doc.setFillColor(10, 15, 30).rect(0, 0, W, 120, "F");
  doc.setTextColor(248, 250, 252).setFont("helvetica", "bold").setFontSize(26).text("HAFIZ SHERAZ", M, 58);
  doc.setTextColor(245, 158, 11).setFontSize(10.5).setFont("helvetica", "bold");
  doc.text("PHYSICS & MATHEMATICS TEACHER  |  M.Sc. PHYSICS, B.Ed.  |  7+ YEARS EXPERIENCE", M, 82);
  doc.setTextColor(148, 163, 184).setFontSize(9).setFont("helvetica", "normal");
  doc.text("Multan, Punjab, Pakistan  |  Open to relocation — Kingdom of Saudi Arabia", M, 100);
  y = 156;

  line("PROFILE", 13, "bold", 8, [245, 158, 11]);
  line("Secondary School Teacher (SST Science, BPS-16) with the School Education Department, Government of Punjab, Pakistan, since March 2018. Over seven years of teaching Physics, Chemistry and Mathematics at the secondary level (grades 5-10), with a consistent record of strong board examination results. Currently serving as Deputy Headmaster, handling academic coordination, faculty collaboration and student record management.", 10.5, "normal", 20, [30, 41, 59]);

  line("EDUCATION", 13, "bold", 8, [245, 158, 11]);
  line("Master of Science (M.Sc.) in Physics", 11, "bold", 4);
  line("Bachelor of Education (B.Ed.)", 11, "bold", 20);

  line("EXPERIENCE", 13, "bold", 8, [245, 158, 11]);
  line("Government High School Jampur East, Multan — Jul 2020 to Present", 11, "bold", 4);
  line("SST Science (BPS-16) and Deputy Headmaster. Physics, Mathematics and Science instruction, board exam preparation, academic coordination, student records and administrative responsibilities.", 10.5, "normal", 14, [51, 65, 85]);
  line("Government High School Manzoorabad, Multan — Mar 2018 to Jul 2020", 11, "bold", 4);
  line("SST Science (BPS-16). Lesson planning, academic supervision and effective classroom management.", 10.5, "normal", 20, [51, 65, 85]);

  line("CORE SKILLS", 13, "bold", 8, [245, 158, 11]);
  line("Curriculum-based instruction · Lesson plan development · Formative & summative assessment · Student performance tracking · Classroom discipline · Parent-teacher communication · Board examination preparation", 10.5, "normal", 14, [51, 65, 85]);
  line("Smart classroom technology · Digital teaching tools · Microsoft Office · Google Workspace · AI-supported educational resources", 10.5, "normal", 20, [51, 65, 85]);

  line("CAREER OBJECTIVE", 13, "bold", 8, [245, 158, 11]);
  line("Seeking a Physics, Mathematics and Science teaching position in the Kingdom of Saudi Arabia to contribute to institutional goals, support student development and grow within a high-quality educational environment.", 10.5, "normal", 12, [51, 65, 85]);

  doc.save("Hafiz-Sheraz-CV.pdf");
}

/* ═══════════════════════════════════════════════════════════
   REUSABLE — SECTION REVEAL WRAPPER
   Fade + rise + blur-out on entering viewport (once)
   ═══════════════════════════════════════════════════════════ */
function RevealSection({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   THREE.JS — INTERACTIVE BOHR ATOM
   ═══════════════════════════════════════════════════════════ */
function AtomCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const w = el.clientWidth || 500;
    const h = el.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.z = 9;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    el.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // ── Nucleus
    const nucleusGeo = new THREE.IcosahedronGeometry(0.85, 2);
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.7,
      flatShading: true, metalness: 0.35, roughness: 0.25,
    });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    group.add(nucleus);

    // ── Orbits & Electrons
    const orbits = [];
    [[0, 0], [Math.PI / 3, Math.PI / 4], [-Math.PI / 3, -Math.PI / 4]].forEach(([rx, ry], i) => {
      const r = 2.6 + i * 0.45;
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.022, 12, 180),
        new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.6 })
      );
      ring.rotation.set(rx, ry, 0);

      const pivot = new THREE.Group();
      pivot.rotation.set(rx, ry, 0);

      const electron = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 20, 20),
        new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x60a5fa, emissiveIntensity: 1.4, roughness: 0.05 })
      );
      electron.position.x = r;
      pivot.add(electron);

      group.add(ring, pivot);
      orbits.push({ pivot, speed: 0.9 + i * 0.4 });
    });

    // ── Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const amberLight = new THREE.PointLight(0xf59e0b, 50, 50);
    amberLight.position.set(4, 4, 6);
    scene.add(amberLight);
    const blueLight = new THREE.PointLight(0x60a5fa, 25, 40);
    blueLight.position.set(-4, -3, 5);
    scene.add(blueLight);

    // ── Mouse Parallax
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e) => {
      mouse.y = (e.clientX / window.innerWidth - 0.5) * 1.3;
      mouse.x = (e.clientY / window.innerHeight - 0.5) * 0.9;
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Resize
    const onResize = () => {
      if (!el) return;
      const nw = el.clientWidth;
      const nh = el.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    // ── Animate
    const clock = new THREE.Clock();
    let raf;
    const animate = () => {
      const t = clock.getElapsedTime();
      group.rotation.x += (mouse.x - group.rotation.x) * 0.04;
      group.rotation.y += (mouse.y + t * 0.12 - group.rotation.y) * 0.04;
      nucleus.rotation.y = t * 0.65;
      nucleus.rotation.x = t * 0.3;
      orbits.forEach((o) => (o.pivot.rotation.z = t * o.speed));
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      nucleusGeo.dispose();
      nucleusMat.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={ref} className="absolute inset-0 pointer-events-none z-0" />;
}

/* ═══════════════════════════════════════════════════════════
   ANIMATED TIMELINE LINE (scroll-drawn horizontal line)
   ═══════════════════════════════════════════════════════════ */
function TimelineLine() {
  const lineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ["start 0.8", "end 0.3"],
  });
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const springWidth = useSpring(width, { stiffness: 60, damping: 20 });

  return (
    <div ref={lineRef} className="relative w-full h-1 my-12 rounded-full overflow-hidden bg-white/5">
      <motion.div
        style={{ width: springWidth }}
        className="absolute inset-y-0 left-0 rounded-full"
        // amber-to-blue gradient
      >
        <div className="w-full h-full bg-gradient-to-r from-[#F59E0B] via-[#F59E0B] to-[#60a5fa] rounded-full" />
      </motion.div>
      {/* Pulsing dots at endpoints */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#F59E0B] z-10 timeline-dot" />
      <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#F59E0B] z-10 timeline-dot" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#60a5fa] z-10 timeline-dot" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ASSETS
   ═══════════════════════════════════════════════════════════ */
const PORTRAIT = "/hafiz-sheraz.png";
const BG = "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=2000&q=80";
const GLASS_IMG = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80";

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function TeacherPortfolioSingle() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);

  // Hero parallax — background moves slower, scales up
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);
  const bgScale = useTransform(heroScroll, [0, 1], [1, 1.15]);
  // Hero text drifts down and fades
  const heroTextY = useTransform(heroScroll, [0, 0.6], [0, 120]);
  const heroTextOpacity = useTransform(heroScroll, [0, 0.5], [1, 0]);

  /* ── 3D Stagger for headline letters ── */
  const headlineVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.06, delayChildren: 0.5 },
    },
  };
  const letterVariants = {
    hidden: { opacity: 0, rotateX: 90, y: 40 },
    visible: {
      opacity: 1,
      rotateX: 0,
      y: 0,
      transition: { type: "spring", stiffness: 150, damping: 12 },
    },
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0A0F1E] text-[#F8FAFC] font-body relative overflow-x-hidden">
      {/* Background Grid */}
      <div className="fixed inset-0 physics-grid opacity-50 pointer-events-none z-0" />

      {/* ═══ NAVBAR ═══ */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-4 inset-x-4 z-50 mx-auto max-w-5xl"
      >
        <nav className="glass rounded-full px-5 sm:px-7 py-3 flex items-center justify-between bg-[#0A0F1E]/70 shadow-2xl">
          <a href="#top" className="font-heading font-bold tracking-[0.2em] text-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
            H<span className="text-[#F59E0B]">.</span>SHERAZ
          </a>
          <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-[#94A3B8]">
            {["Pedigree", "Journey", "Laboratory", "Mission"].map((s) => (
              <li key={s}>
                <a href={`#${s.toLowerCase()}`} className="hover:text-white transition-colors duration-200">{s}</a>
              </li>
            ))}
          </ul>
          <button
            onClick={downloadCV}
            className="inline-flex items-center gap-2 rounded-full bg-[#F59E0B] text-[#0A0F1E] text-xs sm:text-sm font-bold px-4 py-2 hover:bg-[#fbbf24] hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> CV
          </button>
        </nav>
      </motion.header>

      {/* ═══ HERO — "MOMENTUM" ═══ */}
      <section ref={heroRef} id="top" className="relative min-h-screen overflow-hidden flex items-center pt-28 pb-20">
        {/* Parallax Background */}
        <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0 pointer-events-none origin-center">
          <Image src={BG} alt="" className="w-full h-full object-cover opacity-[0.18]" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1E] via-[#0A0F1E]/90 to-[#0A0F1E]/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-transparent to-[#0A0F1E]/80 pointer-events-none" />

        <motion.div
          style={{ y: heroTextY, opacity: heroTextOpacity }}
          className="relative z-10 max-w-7xl mx-auto w-full px-6 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center"
        >
          {/* Left — Text */}
          <div className="perspective-[800px]">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] text-[11px] font-semibold uppercase tracking-[0.22em] mb-7"
            >
              <Atom className="w-3.5 h-3.5" />
              Secondary School Teacher · SST Science · Deputy Headmaster
            </motion.div>

            {/* 3D rotateX stagger headline */}
            <motion.h1
              variants={headlineVariants}
              initial="hidden"
              animate="visible"
              className="font-heading font-bold text-[clamp(3rem,8vw,7rem)] tracking-tight leading-[0.9] select-none"
              style={{ perspective: "800px" }}
            >
              <span className="block overflow-hidden">
                {Array.from("HAFIZ").map((ch, i) => (
                  <motion.span key={`h-${i}`} variants={letterVariants} className="inline-block" style={{ transformOrigin: "bottom" }}>
                    {ch}
                  </motion.span>
                ))}
              </span>
              <span className="block overflow-hidden mt-1">
                {Array.from("SHERAZ").map((ch, i) => (
                  <motion.span key={`s-${i}`} variants={letterVariants} className="inline-block" style={{ transformOrigin: "bottom" }}>
                    {ch}
                  </motion.span>
                ))}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-heading font-medium text-[#94A3B8] mt-4 tracking-tight"
            >
              Physics <span className="text-[#F59E0B]">&</span> Mathematics
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="mt-7 max-w-lg text-[#94A3B8] text-[17px] leading-relaxed"
            >
              M.Sc. Physics · B.Ed. · Seven years shaping scientific minds at the
              secondary level with the School Education Department, Government of
              Punjab, Pakistan.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={downloadCV}
                className="amber-glow inline-flex items-center gap-2.5 rounded-full bg-[#F59E0B] text-[#0A0F1E] font-bold px-7 py-3.5 hover:bg-[#fbbf24] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Full CV
              </button>
              <a
                href="#pedigree"
                className="glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-medium hover:bg-white/10 transition-all group"
              >
                Explore Credentials
                <ArrowDown className="w-4 h-4 text-[#F59E0B] group-hover:translate-y-0.5 transition-transform" />
              </a>
            </motion.div>
          </div>

          {/* Right — 3D Atom + Portrait */}
          <div className="relative h-[400px] sm:h-[520px] lg:h-[640px] flex items-center justify-center">
            <AtomCanvas />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 80, damping: 14 }}
              className="relative z-10 animate-float"
            >
              <div className="w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full p-[3px] bg-gradient-to-br from-[#F59E0B] via-[#60a5fa]/50 to-[#F59E0B]/20 shadow-[0_0_80px_rgba(245,158,11,0.25),0_0_120px_rgba(96,165,250,0.15)]">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#0A0F1E]">
                  <Image src={PORTRAIT} alt="Hafiz Sheraz" className="w-full h-full object-cover object-top scale-[1.08]" focalPointY={0.22} />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══ 01 · QUANTUM PEDIGREE ═══ */}
      <section id="pedigree" className="py-28 px-6 relative radial-blue">
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealSection>
            <p className="section-eyebrow">01 · Quantum Pedigree</p>
            <h2 className="section-title text-4xl md:text-6xl max-w-3xl">
              Credentials measured in <span className="text-[#F59E0B]">results</span>.
            </h2>
          </RevealSection>

          {/* Stat Cards */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              { value: "7+", label: "Years Experience", sub: "Since March 2018" },
              { value: "M.Sc", label: "Physics", sub: "Master of Science" },
              { value: "B.Ed", label: "Education", sub: "Bachelor of Education" },
              { value: "5–10", label: "Grades Taught", sub: "Physics · Chemistry · Maths" },
            ].map((s, i) => (
              <RevealSection key={s.label} delay={i * 0.1}>
                <div className="glass-card rounded-2xl p-6 md:p-8 h-full relative overflow-hidden group cursor-default">
                  <div className="absolute -top-4 -right-4 w-28 h-28 bg-[#F59E0B]/5 rounded-full blur-2xl group-hover:bg-[#F59E0B]/12 transition-all duration-500 pointer-events-none" />
                  <div className="font-heading font-bold text-5xl md:text-6xl text-[#F59E0B] tracking-tight leading-none">{s.value}</div>
                  <div className="mt-3 font-heading font-semibold text-lg">{s.label}</div>
                  <div className="text-sm text-[#94A3B8] mt-1">{s.sub}</div>
                </div>
              </RevealSection>
            ))}
          </div>

          {/* Feature Pillar Cards */}
          <div className="mt-8 grid md:grid-cols-2 gap-4 sm:gap-5">
            {[
              { icon: Atom, title: "Conceptual Physics", text: "Structured, syllabus-aligned lessons focused on deep conceptual understanding, critical thinking, and applied problem-solving." },
              { icon: GraduationCap, title: "Board Exam Results", text: "Extensive experience preparing students for Punjab board examinations with a consistent track record of strong achievement." },
              { icon: BookOpen, title: "Assessment & Planning", text: "Comprehensive lesson-plan development, formative and summative assessments, and continuous student-performance analysis." },
              { icon: Award, title: "Academic Leadership", text: "Deputy Headmaster: academic coordination, faculty collaboration, student records, and institutional administration." },
            ].map((p, i) => (
              <RevealSection key={p.title} delay={i * 0.1}>
                <div className="glass-card icon-hover-fill rounded-2xl p-7 flex gap-5 h-full group cursor-default">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center border border-[#F59E0B]/20 group-hover:bg-[#F59E0B]/20 transition-colors">
                    <p.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-xl">{p.title}</h3>
                    <p className="text-[#94A3B8] mt-2 leading-relaxed text-[15px]">{p.text}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 02 · TIMELINE OF IMPACT ═══ */}
      <section id="journey" className="py-28 px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealSection>
            <p className="section-eyebrow">02 · Timeline of Impact</p>
            <h2 className="section-title text-4xl md:text-6xl max-w-3xl">
              A trajectory of <span className="text-[#F59E0B]">service</span>.
            </h2>
            <p className="mt-4 text-[#94A3B8] max-w-2xl text-[17px]">
              Certified service with the School Education Department, Government of Punjab, Pakistan — from March 2018 to the present.
            </p>
          </RevealSection>

          {/* Animated line drawn on scroll */}
          <TimelineLine />

          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                period: "Mar 2018 — Jul 2020",
                place: "Government High School Manzoorabad",
                city: "Multan, Punjab",
                role: "SST Science · BPS-16",
                text: "Pivotal role in lesson planning, academic supervision, and effective classroom management across Physics, Chemistry, and Mathematics.",
              },
              {
                period: "Jul 2020 — Present",
                place: "Government High School Jampur East",
                city: "Multan, Punjab",
                role: "SST Science · Deputy Headmaster",
                text: "Teaching Physics, Mathematics, and Science while leading academic coordination, faculty collaboration, and student record management.",
              },
              {
                period: "Next Chapter",
                place: "Kingdom of Saudi Arabia",
                city: "Target destination",
                role: "Physics, Maths & Science Teacher",
                text: "Seeking to contribute to institutional goals, support student development, and grow within a high-quality educational environment.",
                future: true,
              },
            ].map((s, i) => (
              <RevealSection key={s.place} delay={i * 0.15}>
                <div className={`glass-card rounded-2xl p-7 h-full relative ${s.future ? "!border-[#F59E0B]/50 !border-dashed" : ""}`}>
                  {s.future && (
                    <span className="absolute top-4 right-4 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F59E0B]" />
                    </span>
                  )}
                  <div className="text-xs tracking-[0.2em] uppercase text-[#F59E0B] font-bold">{s.period}</div>
                  <h3 className="font-heading font-semibold text-2xl mt-3 leading-tight">{s.place}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-[#94A3B8] mt-2">
                    <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" /> {s.city}
                  </div>
                  <div className="mt-4 inline-block text-xs font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10">{s.role}</div>
                  <p className="text-[#94A3B8] mt-4 text-[15px] leading-relaxed">{s.text}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 03 · DIGITAL LABORATORY ═══ */}
      <section id="laboratory" className="py-28 px-6 relative radial-blue">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.4fr] gap-12 items-start relative z-10">
          {/* Sticky Left */}
          <RevealSection className="lg:sticky lg:top-32">
            <p className="section-eyebrow">03 · Digital Laboratory</p>
            <h2 className="section-title text-4xl md:text-5xl lg:text-6xl">
              Modern tools, <span className="text-[#F59E0B]">measurable</span> outcomes.
            </h2>
            <p className="mt-4 text-[#94A3B8] text-[17px] leading-relaxed">
              Proficient in smart-classroom technology, digital teaching tools, and AI-supported educational resources — applied to improve student understanding, not just to decorate lessons.
            </p>
            <div className="mt-10 rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)] group relative">
              <Image
                src={GLASS_IMG}
                alt="Frosted 3D geometry"
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
          </RevealSection>

          {/* Right — 2×4 Grid */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            {[
              { icon: MonitorPlay, name: "Smart Classroom", how: "Interactive boards and physics simulations to make abstract mechanics tangible." },
              { icon: Sparkles, name: "AI Educational Tools", how: "AI-supported resources for differentiated practice, adaptive quizzes, and instant feedback." },
              { icon: FileSpreadsheet, name: "Microsoft Office", how: "Structured lesson plans, automated mark-sheets, and student performance dashboards." },
              { icon: Cloud, name: "Google Workspace", how: "Shared drives, interactive forms, and seamless classroom collaboration across faculty." },
              { icon: ClipboardCheck, name: "Assessment Design", how: "Rigorous formative and summative assessments meticulously aligned to board syllabi." },
              { icon: LineChart, name: "Performance Tracking", how: "Continuous analytics to identify weak concepts and provide targeted remediation." },
              { icon: Users, name: "Classroom Management", how: "Disciplined, respectful environments where inquiry is encouraged and everyone participates." },
              { icon: MessageSquare, name: "Parent Communication", how: "Transparent, constructive parent–teacher engagement on student growth and goals." },
            ].map((t, i) => (
              <RevealSection key={t.name} delay={i * 0.07}>
                <div className="glass-card icon-hover-fill rounded-2xl p-6 h-full group cursor-default">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F59E0B]/20 to-[#60a5fa]/10 text-[#F59E0B] flex items-center justify-center border border-[#F59E0B]/15 group-hover:border-[#F59E0B]/40 transition-colors">
                    <t.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mt-5">{t.name}</h3>
                  <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">{t.how}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 04 · THE SAUDI MISSION — LETTER OF INTENT ═══ */}
      <section id="mission" className="py-28 px-6 relative radial-amber">
        <div className="max-w-4xl mx-auto relative z-10">
          <RevealSection className="text-center mb-14">
            <p className="section-eyebrow">04 · The Saudi Mission</p>
            <h2 className="section-title text-4xl md:text-6xl">Letter of Intent</h2>
            <p className="mt-3 text-[#94A3B8]">To the Hiring Committee & Academic Board</p>
          </RevealSection>

          <RevealSection delay={0.15}>
            <article className="glass rounded-3xl p-8 md:p-14 relative overflow-hidden">
              <Quote className="absolute top-8 right-8 w-14 h-14 text-[#F59E0B]/15" />

              <p className="font-heading text-[#F59E0B] font-semibold text-lg tracking-wide">
                As-Salam-o-Alaikum,
              </p>

              <div className="mt-6 space-y-5 text-[17px] text-[#e2e8f0] leading-relaxed">
                <p>
                  I am applying for the position of <strong className="text-white">Physics, Mathematics, and Science Teacher</strong> at your esteemed institution. I bring over seven years of dedicated teaching experience at the secondary level, backed by rigorous academic qualifications and a consistent record of student achievement.
                </p>
                <p>
                  I hold a <strong className="text-white">Master of Science (M.Sc.) in Physics</strong> and a <strong className="text-white">Bachelor of Education (B.Ed.)</strong>, serving actively with the School Education Department, Punjab, Pakistan. Throughout my tenure, I have instructed grades 5 through 10 in Physics, General Science, and Mathematics — crafting syllabus-aligned lesson plans that translate abstract formulas into deep conceptual understanding.
                </p>
                <p>
                  In my ongoing capacity as <strong className="text-white">Deputy Headmaster</strong>, I oversee academic coordination, faculty collaboration, institutional examinations, and student-record administration. My instructional toolbox includes smart boards, interactive simulations, Google Workspace, and AI-assisted educational aids.
                </p>
                <p>
                  As a passionate educator dedicated to professional integrity, academic rigor, and character development, I am eager to relocate to the <strong className="text-white">Kingdom of Saudi Arabia</strong> to foster scientific curiosity and inspire students to reach their highest potential.
                </p>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row sm:items-end justify-between gap-8 pt-6 border-t border-white/10">
                <div>
                  <p className="text-[#94A3B8] text-sm">Yours sincerely,</p>
                  <p className="font-heading font-bold text-2xl mt-1">Hafiz Sheraz</p>
                  <p className="text-sm text-[#F59E0B] font-semibold">M.Sc. Physics · B.Ed. · SST Science (BPS-16)</p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">Government High School Jampur East, Multan</p>
                </div>
                <button
                  onClick={downloadCV}
                  className="amber-glow inline-flex items-center justify-center gap-2 rounded-full bg-[#F59E0B] text-[#0A0F1E] font-bold px-7 py-3.5 hover:bg-[#fbbf24] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Full CV
                </button>
              </div>
            </article>
          </RevealSection>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/10 pt-20 pb-12 px-6 bg-[#060A16]/60 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Flight Journey Card */}
          <RevealSection>
            <div className="glass rounded-3xl p-8 md:p-12 grid md:grid-cols-[1fr_auto_1fr] items-center gap-8 text-center">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-[#94A3B8] font-bold">Origin</p>
                <p className="font-heading font-bold text-2xl md:text-3xl mt-2">Multan, Punjab</p>
                <p className="text-[#94A3B8] text-sm">Pakistan</p>
              </div>

              <div className="relative w-full md:w-80 h-20 flex items-center justify-center">
                <svg viewBox="0 0 320 70" className="w-full h-full overflow-visible">
                  <path d="M 12 55 Q 160 -10 308 55" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="7 5" opacity="0.6" />
                  <circle cx="12" cy="55" r="5" fill="#F59E0B" />
                  <circle cx="308" cy="55" r="5" fill="#F59E0B" />
                </svg>
                <motion.div
                  animate={{ x: [-60, 60, -60] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute text-[#F59E0B] -translate-y-6"
                >
                  <Plane className="w-6 h-6 -rotate-12" />
                </motion.div>
              </div>

              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-[#94A3B8] font-bold">Destination</p>
                <p className="font-heading font-bold text-2xl md:text-3xl mt-2">Saudi Arabia</p>
                <p className="text-[#94A3B8] text-sm">Kingdom of Saudi Arabia</p>
              </div>
            </div>
          </RevealSection>

          {/* Bottom Bar */}
          <div className="mt-14 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#94A3B8]">
            <p className="font-heading font-bold tracking-[0.2em] text-[#F8FAFC]">
              H<span className="text-[#F59E0B]">.</span>SHERAZ
            </p>
            <nav className="flex flex-wrap justify-center gap-6">
              {["Pedigree", "Journey", "Laboratory", "Mission"].map((s) => (
                <a key={s} href={`#${s.toLowerCase()}`} className="hover:text-white transition-colors">{s}</a>
              ))}
              <button onClick={downloadCV} className="hover:text-[#F59E0B] transition-colors cursor-pointer">CV</button>
            </nav>
            <p>© {new Date().getFullYear()} Hafiz Sheraz</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
