import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import IntroScene from './components/IntroScene';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import EducationSection from './components/EducationSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import JourneySection from './components/JourneySection';
import CreativePlayground from './components/CreativePlayground';
import PhilosophySection from './components/PhilosophySection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

// ─────────────────────────────────────────────────────────────
// SCROLL PROGRESS BAR
// ─────────────────────────────────────────────────────────────
function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handler = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[1px]" style={{ background: 'rgba(255,255,255,0.04)' }}>
      <div
        style={{
          height: '100%',
          width: `${progress * 100}%`,
          background: 'linear-gradient(90deg, #6EE7FF, #8B5CF6, #D4AF37)',
          boxShadow: '0 0 8px rgba(110,231,255,0.4)',
          transition: 'width 0.1s linear',
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// NAV DOTS
// ─────────────────────────────────────────────────────────────
const SECTIONS = [
  { label: 'Hero',        id: 'hero' },
  { label: 'About',       id: 'about' },
  { label: 'Education',   id: 'education' },
  { label: 'Skills',      id: 'skills' },
  { label: 'Projects',    id: 'projects' },
  { label: 'Journey',     id: 'journey' },
  { label: 'Creative',    id: 'creative' },
  { label: 'Philosophy',  id: 'philosophy' },
  { label: 'Contact',     id: 'contact' },
];

function NavDots({ visible }: { visible: boolean }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = SECTIONS.findIndex(s => s.id === entry.target.id);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { threshold: 0.4 }
    );
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [visible]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-4"
    >
      {SECTIONS.map((s, i) => (
        <button
          key={s.id}
          onClick={() => {
            const el = document.getElementById(s.id);
            if (el) {
              window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
            }
          }}
          className="group flex items-center gap-3 justify-end"
          title={s.label}
        >
          <span
            className="text-[9px] tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 select-none"
            style={{ color: '#888888', fontFamily: 'Inter, sans-serif' }}
          >
            {s.label}
          </span>
          <motion.div
            layout
            initial={false}
            animate={active === i ? {
              width: 20,
              background: 'linear-gradient(90deg, #6EE7FF, #8B5CF6)',
              boxShadow: '0 0 8px rgba(110,231,255,0.5)',
            } : {
              width: 4,
              background: 'rgba(255,255,255,0.15)',
              boxShadow: 'none',
            }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ height: 4, borderRadius: 2 }}
          />
        </button>
      ))}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// REVEAL — scroll-linked entrance for each chapter section.
// Instead of a one-shot fade, every section rises out of a soft
// blur/tilt/scale as it is dragged into view by the scrollbar,
// then settles flush. Feels physically pulled into place.
// ─────────────────────────────────────────────────────────────
function Reveal({
  children,
  id,
  intensity = 1,
}: {
  children: React.ReactNode;
  id: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 95%', 'start 30%'],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  const opacity   = useTransform(smooth, [0, 1], [0, 1]);
  const y         = useTransform(smooth, [0, 1], [110 * intensity, 0]);
  const scale     = useTransform(smooth, [0, 1], [0.86, 1]);
  const rotateX   = useTransform(smooth, [0, 1], [10 * intensity, 0]);
  const blurPx    = useTransform(smooth, [0, 1], [14, 0]);
  const filter    = useTransform(blurPx, (b) => `blur(${b}px)`);

  return (
    <motion.section
      id={id}
      ref={ref}
      style={{
        opacity,
        y,
        scale,
        rotateX,
        filter,
        transformPerspective: 1400,
        transformOrigin: 'center bottom',
        willChange: 'transform, filter, opacity',
      }}
    >
      {children}
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// CHAPTER TRANSITION — between sections
// Canvas dissolve + light beam, now scroll-reactive: the whole
// divider "charges up" as it crosses the middle of the viewport,
// with a widening beam, a traveling glow orb, and a clip-path
// wipe line, instead of firing once and sitting static.
// ─────────────────────────────────────────────────────────────
interface TransitionProps {
  color?: string;
  type?: 'beam' | 'particles' | 'warp' | 'liquid';
}

function ChapterTransition({ color = '#6EE7FF', type = 'beam' }: TransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // 0 → 1 as this divider crosses through the viewport center
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start end', 'end start'],
  });
  const charge = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const chargeSmooth = useSpring(charge, { stiffness: 90, damping: 20 });

  const beamWidth   = useTransform(chargeSmooth, [0, 1], ['1px', '3px']);
  const glowScale   = useTransform(chargeSmooth, [0, 1], [0.6, 1.6]);
  const glowOpacity = useTransform(chargeSmooth, [0, 1], [0.15, 0.9]);
  const wipeScaleX  = useTransform(scrollYProgress, [0.15, 0.75], [0, 1]);
  const orbX        = useTransform(scrollYProgress, [0, 1], ['-8%', '108%']);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width  = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let t = 0;
    let intensity = 0.4; // driven up while the divider is "charged"

    const unsub = chargeSmooth.on('change', (v) => { intensity = 0.35 + v * 1.4; });

    const render = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.02;

      if (type === 'beam') {
        const grd = ctx.createLinearGradient(W / 2 - 90, 0, W / 2 + 90, 0);
        grd.addColorStop(0,   'transparent');
        grd.addColorStop(0.4, hexAlpha(color, (0.015 + 0.012 * Math.sin(t)) * intensity));
        grd.addColorStop(0.5, hexAlpha(color, (0.05  + 0.025 * Math.sin(t)) * intensity));
        grd.addColorStop(0.6, hexAlpha(color, (0.015 + 0.012 * Math.sin(t)) * intensity));
        grd.addColorStop(1,   'transparent');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);

        // Two counter-traveling scan pulses on the beam
        const scanY1 = (t * 70) % H;
        const scanY2 = H - ((t * 55) % H);
        [scanY1, scanY2].forEach((sy, i) => {
          ctx.beginPath();
          ctx.arc(W / 2, sy, 2 + intensity, 0, Math.PI * 2);
          ctx.fillStyle = hexAlpha(color, (i === 0 ? 0.55 : 0.35) * intensity);
          ctx.fill();
        });
      }

      if (type === 'particles') {
        const count = Math.round(6 + intensity * 10);
        for (let i = 0; i < count; i++) {
          const x = W * 0.15 + Math.random() * W * 0.7;
          const y = H * 0.5 - ((t * (30 + intensity * 20) + i * 40) % H);
          const r = Math.random() * 1.8 + 0.5;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = hexAlpha(color, Math.random() * 0.35 * intensity);
          ctx.fill();
        }
      }

      if (type === 'warp') {
        const lines = Math.round(12 + intensity * 10);
        for (let i = 0; i < lines; i++) {
          const angle = (i / lines) * Math.PI * 2 + t * 0.12;
          const len = (20 + Math.sin(t + i) * 10) * intensity;
          ctx.beginPath();
          ctx.moveTo(W / 2, H / 2);
          ctx.lineTo(W / 2 + Math.cos(angle) * len * 4, H / 2 + Math.sin(angle) * len * 4);
          ctx.strokeStyle = hexAlpha(color, 0.04 * intensity);
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      if (type === 'liquid') {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 4) {
          const y = H / 2
            + Math.sin((x * 0.02) + t * 2) * 8 * intensity
            + Math.sin((x * 0.005) + t) * 20 * intensity;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = hexAlpha(color, 0.07 * intensity);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      raf = requestAnimationFrame(render);
    };
    render();
    return () => { cancelAnimationFrame(raf); unsub(); };
  }, [color, type, chargeSmooth]);

  return (
    <div ref={wrapRef} className="relative overflow-hidden" style={{ height: 220 }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Ambient glow that swells as the divider crosses the viewport */}
      <motion.div
        className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
        style={{
          width: 260,
          height: 260,
          x: '-50%',
          y: '-50%',
          scale: glowScale,
          opacity: glowOpacity,
          background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
          filter: 'blur(6px)',
        }}
      />

      {/* Core divider line, its stroke width breathing with scroll */}
      <motion.div
        className="absolute inset-x-0 top-1/2"
        style={{
          height: beamWidth,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          filter: 'blur(0.5px)',
          opacity: 0.9,
        }}
      />

      {/* Clip-path wipe that reveals the divider left → right on scroll */}
      <motion.div
        className="absolute inset-x-0 top-1/2 h-px origin-left"
        style={{
          scaleX: wipeScaleX,
          background: `linear-gradient(90deg, ${color}, transparent)`,
          boxShadow: `0 0 12px ${color}`,
        }}
      />

      {/* Traveling glow orb tracking overall scroll progress through the divider */}
      <motion.span
        className="absolute top-1/2 block w-2 h-2 -translate-y-1/2 rounded-full"
        style={{ left: orbX, background: color, boxShadow: `0 0 22px ${color}` }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const bodyStyleRef = useRef({ overflow: '', position: '', top: '', width: '' });

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
  }, []);

  useLayoutEffect(() => {
    let cancelled = false;

    const restoreBodyStyles = () => {
      document.body.style.overflow = bodyStyleRef.current.overflow;
      document.body.style.position = bodyStyleRef.current.position;
      document.body.style.top = bodyStyleRef.current.top;
      document.body.style.width = bodyStyleRef.current.width;
    };

    if (!introComplete) {
      bodyStyleRef.current = {
        overflow: document.body.style.overflow,
        position: document.body.style.position,
        top: document.body.style.top,
        width: document.body.style.width,
      };
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      window.scrollTo(0, 0);
      return () => {
        cancelled = true;
        restoreBodyStyles();
      };
    }

    const unlock = () => {
      if (cancelled) return;
      restoreBodyStyles();

      const prevHtmlScrollBehavior = document.documentElement.style.scrollBehavior;
      const prevBodyScrollBehavior = document.body.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      document.documentElement.style.scrollBehavior = prevHtmlScrollBehavior;
      document.body.style.scrollBehavior = prevBodyScrollBehavior;
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) unlock();
      });
    } else {
      unlock();
    }

    return () => {
      cancelled = true;
      restoreBodyStyles();
    };
  }, [introComplete]);

  return (
    <div style={{ background: '#050505', color: '#F4F4F4', minHeight: '100vh' }}>
      <CustomCursor />
      <ScrollProgress />

      {/* Intro */}
      <AnimatePresence>
        {!introComplete && (
          <IntroScene onComplete={() => setIntroComplete(true)} />
        )}
      </AnimatePresence>

      <NavDots visible={introComplete} />

      <main style={{ perspective: 1400 }}>
          {/* ─── CHAPTER 1: HERO ─────────────────────────────── */}
          <motion.section
            id="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          >
            <HeroSection />
          </motion.section>

          {/* TRANSITION: Hero → About (particles drift up, beam appears) */}
          <ChapterTransition color="#6EE7FF" type="particles" />

          {/* ─── CHAPTER 2: ABOUT ────────────────────────────── */}
          <Reveal id="about">
            <AboutSection />
          </Reveal>

          {/* TRANSITION: About → Education */}
          <ChapterTransition color="#10B981" type="liquid" />

          <Reveal id="education">
            <EducationSection />
          </Reveal>

          {/* TRANSITION: Education → Skills */}
          <ChapterTransition color="#8B5CF6" type="beam" />

          {/* ─── CHAPTER 3: SKILLS ───────────────────────────── */}
          <Reveal id="skills">
            <SkillsSection />
          </Reveal>

          {/* TRANSITION: Skills → Projects (network collapses to cube, warp) */}
          <ChapterTransition color="#D4AF37" type="warp" />

          {/* ─── CHAPTER 4: PROJECTS ─────────────────────────── */}
          <Reveal id="projects" intensity={1.15}>
            <ProjectsSection />
          </Reveal>

          {/* TRANSITION: Projects → Journey (galaxy stars emerge) */}
          <ChapterTransition color="#6EE7FF" type="particles" />

          {/* ─── CHAPTER 5: JOURNEY / EXPERIENCE ────────────── */}
          <Reveal id="journey">
            <JourneySection />
          </Reveal>

          {/* TRANSITION: Journey → Creative (liquid dissolve) */}
          <ChapterTransition color="#8B5CF6" type="liquid" />

          {/* ─── CHAPTER 6: CREATIVE ─────────────────────────── */}
          <Reveal id="creative" intensity={1.2}>
            <CreativePlayground />
          </Reveal>

          {/* TRANSITION: Creative → Philosophy (warp speed white lines) */}
          <ChapterTransition color="#D4AF37" type="warp" />

          {/* ─── CHAPTER 7: PHILOSOPHY ───────────────────────── */}
          <Reveal id="philosophy">
            <PhilosophySection />
          </Reveal>

          {/* TRANSITION: Philosophy → Contact (portal opens) */}
          <ChapterTransition color="#6EE7FF" type="beam" />

          {/* ─── CHAPTER 8: CONTACT ──────────────────────────── */}
          <Reveal id="contact">
            <ContactSection />
          </Reveal>

          <Footer />
        </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function hexAlpha(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}