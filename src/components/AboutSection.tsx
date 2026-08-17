import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// ── Data ────────────────────────────────────────────────────
const FLOATING_LABELS = [
  { label: 'AI',          color: '#6EE7FF', size: 'lg', depth: 35, angle: 0   },
  { label: 'ML',          color: '#8B5CF6', size: 'md', depth: 22, angle: 62  },
  { label: 'Engineering', color: '#6EE7FF', size: 'sm', depth: 48, angle: 128 },
  { label: 'Research',    color: '#D4AF37', size: 'md', depth: 30, angle: 195 },
  { label: 'Creativity',  color: '#8B5CF6', size: 'sm', depth: 40, angle: 252 },
  { label: 'Vision',      color: '#6EE7FF', size: 'lg', depth: 28, angle: 310 },
];

const STATS = [
  { value: '3+',   label: 'AI Projects',    color: '#6EE7FF', delay: 0    },
  { value: '5+',   label: 'LLM APIs',       color: '#8B5CF6', delay: 0.12 },
  { value: '4+',   label: 'Competitions',   color: '#D4AF37', delay: 0.24 },
];

const BIO = `Computer Science undergraduate at ITU Lahore with hands-on experience building and integrating AI/ML systems using Python, PyTorch, and LLM APIs. Developed production-oriented projects spanning computer vision, real-time data pipelines, and LLM-powered features.`;

const BIO_2 = `Experienced in writing clean, documented code and collaborating across technical and non-technical teams. Eager to contribute to an AI engineering team, learn from senior engineers, and ship intelligent systems in a fast-moving environment.`;

// ── Holographic Portrait ─────────────────────────────────────
function HolographicPortrait({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const tiltX = mouseY * 12;   // degrees
  const tiltY = -mouseX * 12;

  return (
    <motion.div
      className="relative"
      style={{
        width: 260,
        height: 320,
        transform: `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transition: 'transform 0.4s cubic-bezier(0.19,1,0.22,1)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Glow behind the card */}
      <div
        className="absolute -inset-8 rounded-3xl opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(110,231,255,0.15), rgba(139,92,246,0.1), transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Main glass card */}
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 0 40px rgba(110,231,255,0.06), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        {/* Portrait photo — replace src with your actual photo */}
        <img
         src={`${import.meta.env.BASE_URL}images/myimage.jpeg`}
          alt="Maryam Arshad"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 1,
          }}
          onLoad={() => {
            const placeholder = document.getElementById('portrait-placeholder');
            if (placeholder) placeholder.style.display = 'none';
          }}
          onError={() => {
            console.log('Image not found.');
          }}
        />

        {/* Placeholder (hidden when photo loads) */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(160deg, rgba(110,231,255,0.05), rgba(139,92,246,0.05))' }}
          id="portrait-placeholder"
        >
          <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-20 h-20 rounded-full mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(110,231,255,0.2), rgba(139,92,246,0.2))',
              border: '1px solid rgba(110,231,255,0.25)',
            }}
          />
          <p>
            Loading Portrait...
          </p>

          <p>
            public/images/myimage.jpg
          </p>
</div>
        {/* Holographic shimmer overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              'linear-gradient(135deg, rgba(110,231,255,0.04) 0%, rgba(139,92,246,0.02) 50%, rgba(212,175,55,0.03) 100%)',
              'linear-gradient(225deg, rgba(110,231,255,0.06) 0%, rgba(139,92,246,0.04) 50%, rgba(212,175,55,0.02) 100%)',
              'linear-gradient(135deg, rgba(110,231,255,0.04) 0%, rgba(139,92,246,0.02) 50%, rgba(212,175,55,0.03) 100%)',
            ],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        {/* Scan line */}
        <motion.div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(110,231,255,0.25), transparent)' }}
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />

        {/* Horizontal scan lines texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(110,231,255,1) 3px, rgba(110,231,255,1) 4px)',
          }}
        />

        {/* Bottom overlay removed to clean up portrait text */}
      </div>

      {/* Corner brackets — top left */}
      <div className="absolute top-0 left-0 w-5 h-5 pointer-events-none" style={{ borderTop: '2px solid rgba(110,231,255,0.6)', borderLeft: '2px solid rgba(110,231,255,0.6)' }} />
      {/* Corner brackets — top right */}
      <div className="absolute top-0 right-0 w-5 h-5 pointer-events-none" style={{ borderTop: '2px solid rgba(110,231,255,0.6)', borderRight: '2px solid rgba(110,231,255,0.6)' }} />
      {/* Corner brackets — bottom left */}
      <div className="absolute bottom-0 left-0 w-5 h-5 pointer-events-none" style={{ borderBottom: '2px solid rgba(110,231,255,0.6)', borderLeft: '2px solid rgba(110,231,255,0.6)' }} />
      {/* Corner brackets — bottom right */}
      <div className="absolute bottom-0 right-0 w-5 h-5 pointer-events-none" style={{ borderBottom: '2px solid rgba(110,231,255,0.6)', borderRight: '2px solid rgba(110,231,255,0.6)' }} />
    </motion.div>
  );
}

// ── Floating Label ───────────────────────────────────────────
function FloatingLabel({
  label, color, size, depth, angle, mouseX, mouseY, index, inView,
}: {
  label: string; color: string; size: string; depth: number;
  angle: number; mouseX: number; mouseY: number; index: number; inView: boolean;
}) {
  const rad    = (angle * Math.PI) / 180;
  const radius = size === 'lg' ? 200 : size === 'md' ? 175 : 155;
  const baseX  = Math.cos(rad) * radius;
  const baseY  = Math.sin(rad) * radius;
  const px     = baseX + mouseX * depth;
  const py     = baseY + mouseY * depth;

  const fontSize  = size === 'lg' ? 12 : size === 'md' ? 11 : 10;
  const padX      = size === 'lg' ? 14 : 12;
  const padY      = size === 'lg' ? 8  : 6;
  const opacity   = size === 'lg' ? 0.85 : size === 'md' ? 0.65 : 0.45;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `calc(50% + ${px}px)`,
        top:  `calc(50% + ${py}px)`,
        transform: 'translate(-50%, -50%)',
        transition: 'left 0.35s cubic-bezier(0.19,1,0.22,1), top 0.35s cubic-bezier(0.19,1,0.22,1)',
        zIndex: size === 'lg' ? 3 : size === 'md' ? 2 : 1,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: 0.6 + index * 0.12, duration: 0.6, type: 'spring', stiffness: 200 }}
    >
      <motion.div
        animate={{
          y:      [0, size === 'lg' ? -10 : size === 'md' ? -7 : -5, 0],
          rotate: [0, size === 'lg' ? 3 : 5, -3, 0],
        }}
        transition={{ duration: 4 + index * 0.7, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize,
          fontWeight: size === 'lg' ? 500 : 400,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color,
          opacity,
          background: `${color}08`,
          border: `1px solid ${color}${size === 'lg' ? '30' : '18'}`,
          borderRadius: '100px',
          padding: `${padY}px ${padX}px`,
          backdropFilter: 'blur(8px)',
          whiteSpace: 'nowrap',
          boxShadow: size === 'lg' ? `0 0 20px ${color}10` : 'none',
        }}
      >
        {label}
      </motion.div>
    </motion.div>
  );
}

// ── Typewriter with natural pauses ───────────────────────────
function Typewriter({ text, isActive, delay = 0, onDone }: { text: string; isActive: boolean; delay?: number; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone]           = useState(false);

  useEffect(() => {
    if (!isActive) return;
    setDisplayed('');
    setDone(false);
    let i = 0;

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          setDone(true);
          clearInterval(interval);
          onDone?.();
        }
      }, 14);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isActive]);

  return (
    <span>
      {displayed}
      {!done && isActive && (
        <span
          style={{
            display: 'inline-block',
            width: 2,
            height: '1em',
            marginLeft: 2,
            verticalAlign: 'middle',
            background: '#6EE7FF',
            animation: 'blink-caret 0.75s step-end infinite',
          }}
        />
      )}
    </span>
  );
}

// ── Stat Counter ─────────────────────────────────────────────
function StatCounter({ value, label, color, delay, inView }: {
  value: string; label: string; color: string; delay: number; inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 1.4 + delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative text-center p-5 rounded-2xl overflow-hidden group"
      style={{
        background: `${color}06`,
        border: `1px solid ${color}15`,
        transition: 'all 0.3s ease',
      }}
      whileHover={{
        background: `${color}10`,
        borderColor: `${color}30`,
        y: -3,
        boxShadow: `0 0 30px ${color}10`,
      }}
    >
      {/* Corner dot */}
      <div style={{ position: 'absolute', top: 8, right: 8, width: 4, height: 4, borderRadius: '50%', background: color, opacity: 0.4 }} />

      <motion.div
        style={{
          fontFamily: 'Syne, Inter, sans-serif',
          fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
          fontWeight: 700,
          color,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          textShadow: `0 0 20px ${color}40`,
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 1.5 + delay, duration: 0.5, type: 'spring', stiffness: 300 }}
      >
        {value}
      </motion.div>

      <div style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: 10,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: '#555',
        marginTop: 6,
      }}>
        {label}
      </div>
    </motion.div>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inView     = useInView(contentRef, { once: true, margin: '-15%' });

  const [mousePos, setMousePos]     = useState({ x: 0, y: 0 });
  const [para2Active, setPara2]     = useState(false);

  // Mouse parallax — normalized -0.5 to 0.5
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width  - 0.5,
        y: (e.clientY - rect.top)  / rect.height - 0.5,
      });
    };
    section.addEventListener('mousemove', onMove);
    return () => section.removeEventListener('mousemove', onMove);
  }, []);

  // Scroll parallax on section title
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const titleY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen py-32 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          style={{
            position: 'absolute',
            top: '30%', left: '20%',
            width: 500, height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(110,231,255,0.04), transparent 70%)',
            transform: 'translate(-50%,-50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '60%', left: '70%',
            width: 400, height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.04), transparent 70%)',
            transform: 'translate(-50%,-50%)',
          }}
        />
      </div>

      <div ref={contentRef} className="max-w-6xl mx-auto px-6">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 11,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(110,231,255,0.5)',
          }}>
            01 — About
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* ── LEFT: Portrait + floating labels ── */}
          <div className="relative flex items-center justify-center" style={{ minHeight: 520 }}>

            {/* Floating orbit rings */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 420, height: 420,
                border: '1px solid rgba(110,231,255,0.04)',
                top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 340, height: 340,
                border: '1px dashed rgba(139,92,246,0.05)',
                top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            />

            {/* Floating labels — depth-sorted */}
            {FLOATING_LABELS.map((item, i) => (
              <FloatingLabel
                key={item.label}
                {...item}
                mouseX={mousePos.x}
                mouseY={mousePos.y}
                index={i}
                inView={inView}
              />
            ))}

            {/* Portrait */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, filter: 'blur(20px)' }}
              animate={inView ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <HolographicPortrait mouseX={mousePos.x} mouseY={mousePos.y} />
            </motion.div>
          </div>

          {/* ── RIGHT: Bio text ── */}
          <div>

            {/* Heading */}
            <motion.div style={{ y: titleY }}>
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'Syne, Inter, sans-serif',
                  fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  marginBottom: '0.2em',
                }}
              >
                <span style={{ color: '#F4F4F4' }}>The </span>
                <span style={{
                  background: 'linear-gradient(135deg, #6EE7FF, #8B5CF6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Architect
                </span>
                <br />
                <span style={{ color: '#F4F4F4' }}>of Intelligence</span>
              </motion.h2>
            </motion.div>

            {/* Typewriter bio */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="mt-8 mb-4"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
                color: '#888888',
                lineHeight: 1.85,
              }}
            >
              <Typewriter
                text={BIO}
                isActive={inView}
                delay={0}
                onDone={() => setTimeout(() => setPara2(true), 200)}
              />
            </motion.div>

            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
                color: '#666666',
                lineHeight: 1.85,
                minHeight: '4.5em',
              }}
            >
              <AnimatePresence>
                {para2Active && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typewriter text={BIO_2} isActive={para2Active} delay={0} />
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Info pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-3 mt-8"
            >
              {[
                { icon: '📍', text: 'Lahore, Pakistan', color: '#6EE7FF' },
                { icon: '🎓', text: 'ITU Lahore',        color: '#8B5CF6' },
                { icon: '🔬', text: 'AI / ML Systems',   color: '#D4AF37' },
              ].map((item) => (
                <motion.div
                  key={item.text}
                  whileHover={{ y: -2, borderColor: `${item.color}40` }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{
                    background: `${item.color}06`,
                    border: `1px solid ${item.color}15`,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: 13 }}>{item.icon}</span>
                  <span style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 11,
                    letterSpacing: '0.08em',
                    color: item.color,
                    opacity: 0.8,
                  }}>
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {STATS.map((s) => (
                <StatCounter key={s.label} {...s} inView={inView} />
              ))}
            </div>

            {/* Coursework line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="mt-8 pt-6"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
            >
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 10,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#333',
                marginBottom: 10,
              }}>
                Relevant Coursework
              </p>
              <div className="flex flex-wrap gap-2">
                {['Artificial Intelligence', 'Software Engineering', 'Advanced Databases', 'Digital Logic Design'].map((c) => (
                  <span
                    key={c}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 10,
                      padding: '3px 10px',
                      borderRadius: '100px',
                      background: 'rgba(139,92,246,0.06)',
                      border: '1px solid rgba(139,92,246,0.12)',
                      color: 'rgba(139,92,246,0.6)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}