import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const [textIndex, setTextIndex]   = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [isZooming, setIsZooming]   = useState(false);

  // Scroll-driven exit
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // As user scrolls hero out: text dissolves, section fades
  const contentY    = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const canvasOpacity  = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const texts = [
    { text: 'Maryam Arshad',           type: 'name'     },
    { text: 'AI Engineer.',            type: 'title'    },
    { text: 'Building Intelligence.',  type: 'subtitle' },
    { text: 'Designing Experiences.',  type: 'subtitle' },
  ];

  // ── Particle canvas ──────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    const mouse = { x: W / 2, y: H / 2 };
    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('mousemove', onMove);

    // Particles
    const COUNT = Math.min(100, Math.floor((W * H) / 12000));
    const pts = Array.from({ length: COUNT }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      s:  Math.random() * 1.8 + 0.4,
      o:  Math.random() * 0.35 + 0.08,
      hue: Math.random() > 0.7 ? 270 : 195,  // purple or blue
    }));

    // Floating geometric shapes
    const shapes = Array.from({ length: 5 }, () => ({
      x:        Math.random() * W,
      y:        Math.random() * H,
      size:     Math.random() * 100 + 40,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.001,
      sides:    Math.floor(Math.random() * 3) + 3,
      opacity:  Math.random() * 0.025 + 0.008,
      vx:       (Math.random() - 0.5) * 0.1,
      vy:       (Math.random() - 0.5) * 0.1,
    }));

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, W, H);

      // Shapes
      shapes.forEach(sh => {
        sh.rotation += sh.rotSpeed;
        sh.x = (sh.x + sh.vx + W) % W;
        sh.y = (sh.y + sh.vy + H) % H;
        ctx.save();
        ctx.translate(sh.x, sh.y);
        ctx.rotate(sh.rotation);
        ctx.beginPath();
        for (let i = 0; i <= sh.sides; i++) {
          const angle = (i * Math.PI * 2) / sh.sides;
          const px = Math.cos(angle) * sh.size;
          const py = Math.sin(angle) * sh.size;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(110,231,255,${sh.opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.restore();
      });

      // Particles + mouse repulsion
      pts.forEach(p => {
        const dx   = p.x - mouse.x;
        const dy   = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 0) {
          const force = (200 - dist) / 200;
          p.vx += (dx / dist) * force * 0.04;
          p.vy += (dy / dist) * force * 0.04;
        }
        p.vx *= 0.994;
        p.vy *= 0.994;
        p.x   = (p.x + p.vx + W) % W;
        p.y   = (p.y + p.vy + H) % H;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},80%,75%,${p.o})`;
        ctx.fill();
      });

      // Connection lines
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(110,231,255,${0.07 * (1 - d / 110)})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Text reveal sequence (staggered)
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    texts.forEach((_, i) => {
      timers.push(setTimeout(() => setTextIndex(i + 1), 600 + i * 1000));
    });
    timers.push(setTimeout(() => setShowButton(true), 600 + texts.length * 1000 + 400));
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleEnter = () => {
    setIsZooming(true);
    setTimeout(() => {
      const el = document.getElementById('about');
      if (el) {
        window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
      }
    }, 700);
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* Canvas bg */}
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ opacity: canvasOpacity }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, #050505 90%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-48 z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(to top, #050505, transparent)' }} />

      {/* Floating ambient orbs */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {[
          { top: '20%', left: '15%', color: '110,231,255', dur: 8,  delay: 0 },
          { top: '60%', left: '75%', color: '139,92,246',  dur: 11, delay: 2 },
          { top: '40%', left: '60%', color: '212,175,55',  dur: 14, delay: 5 },
        ].map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              top: orb.top, left: orb.left,
              width: 400, height: 400,
              background: `radial-gradient(circle, rgba(${orb.color},0.04) 0%, transparent 70%)`,
              animation: `float ${orb.dur}s ease-in-out ${orb.delay}s infinite`,
              transform: 'translate(-50%,-50%)',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 w-full max-w-5xl mx-auto"
        style={{
          y:       contentY,
          opacity: contentOpacity,
          scale:   isZooming ? 1.4 : 1,
          transition: isZooming ? 'transform 0.7s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease' : undefined,
        }}
      >
        {/* Chapter label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: textIndex >= 1 ? 1 : 0, y: textIndex >= 1 ? 0 : -10 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] tracking-[0.22em] uppercase"
            style={{
              fontFamily: 'Inter, sans-serif',
              color: '#6EE7FF',
              background: 'rgba(110,231,255,0.06)',
              border: '1px solid rgba(110,231,255,0.15)',
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#6EE7FF', display: 'inline-block', boxShadow: '0 0 6px #6EE7FF' }} />
            AI Engineer · ITU Lahore
          </span>
        </motion.div>

        {/* Text lines */}
        <div>
          {texts.map((item, i) => (
            <div key={item.text} style={{ overflow: 'hidden' }}>
              {i < textIndex && (
                <motion.div
                  initial={{ y: 80, opacity: 0, filter: 'blur(12px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  {item.type === 'name' && (
                    <h1 style={{
                      fontFamily: 'Syne, Inter, sans-serif',
                      fontSize: 'clamp(3rem, 7vw, 5rem)',
                      fontWeight: 900,
                      lineHeight: 0.95,
                      letterSpacing: '-0.04em',
                     background: 'linear-gradient(135deg, #FFFFFF 0%, #C8F4FF 60%, #6EE7FF 100%)',
                     WebkitBackgroundClip: 'text',
                     WebkitTextFillColor: 'transparent',
                     backgroundClip: 'text',
                      textShadow: '0 0 60px rgba(110,231,255,0.12)',
                      marginBottom: '0.1em',
                    }}>
                      Maryam Arshad
                    </h1>
                  )}
                  {item.type === 'title' && (
                    <h2 style={{
                      fontFamily: 'Syne, Inter, sans-serif',
                      fontSize: 'clamp(2rem, 5vw, 5rem)',
                      fontWeight: 600,
                      lineHeight: 1.05,
                      letterSpacing: '-0.03em',
                      background: 'linear-gradient(135deg, #6EE7FF 0%, #8B5CF6 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      marginBottom: '0.5em',
                    }}>
                      AI/ML| Python Developer
                    </h2>
                  )}
                  {item.type === 'subtitle' && (
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'clamp(0.9rem, 2vw, 1.4rem)',
                      fontWeight: 300,
                      color: '#555555',
                      letterSpacing: '0.08em',
                      marginBottom: '0.3em',
                    }}>
                      {item.text}
                    </p>
                  )}
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* CTA button */}
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14"
          >
            <button
              onClick={handleEnter}
              data-cursor="pointer"
              className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full overflow-hidden"
              style={{
                background: 'rgba(110,231,255,0.06)',
                border: '1px solid rgba(110,231,255,0.15)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Rotating conic glow on hover */}
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: 'conic-gradient(from 0deg, transparent, rgba(110,231,255,0.08), transparent, rgba(139,92,246,0.08), transparent)',
                  animation: 'portal-spin 4s linear infinite',
                }}
              />
              <span
                className="relative text-sm tracking-[0.22em] uppercase font-medium"
                style={{ fontFamily: 'Inter, sans-serif', color: '#6EE7FF' }}
              >
                Enter My Universe
              </span>
              <motion.svg
                className="relative w-4 h-4"
                animate={{ x: [0, 3, 0], y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                fill="none" viewBox="0 0 24 24" stroke="#6EE7FF" strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </motion.svg>
            </button>
          </motion.div>
        )}

        {/* Scroll indicator */}
        {showButton && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, letterSpacing: '0.25em', color: '#333', textTransform: 'uppercase' }}>
              scroll
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 18, height: 30,
                border: '1px solid rgba(110,231,255,0.15)',
                borderRadius: 9,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                padding: '4px 0',
              }}
            >
              <div style={{ width: 3, height: 6, borderRadius: 2, background: 'rgba(110,231,255,0.4)' }} />
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}