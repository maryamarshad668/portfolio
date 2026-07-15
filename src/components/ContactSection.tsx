import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

const socials = [
  { name: 'Email', href: 'mailto:maryamarshad668@gmail.com', icon: '✉️' },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/maryam-arshad668', icon: '💼' },
  { name: 'GitHub', href: 'https://github.com/maryamarshad668', icon: '🐙' },
];

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Portal particle effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isInView) return;
    const ctx = canvas.getContext('2d')!;

    let W = 600;
    let H = 600;
    canvas.width = W;
    canvas.height = H;

    const centerX = W / 2;
    const centerY = H / 2;

    // Portal particles orbiting the center
    const portalParticles = Array.from({ length: 60 }, (_, i) => {
      const angle = (i / 60) * Math.PI * 2;
      const radius = 80 + Math.random() * 60;
      return {
        angle,
        radius,
        speed: 0.002 + Math.random() * 0.003,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        hue: Math.random() > 0.6 ? 270 : 195,
      };
    });

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, W, H);

      // Central glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 120);
      gradient.addColorStop(0, 'rgba(110,231,255,0.06)');
      gradient.addColorStop(0.3, 'rgba(139,92,246,0.03)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);

      // Orbiting particles
      portalParticles.forEach(p => {
        p.angle += p.speed;
        const x = centerX + Math.cos(p.angle) * p.radius;
        const y = centerY + Math.sin(p.angle) * p.radius;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.opacity})`;
        ctx.fill();
      });

      // Connections between nearby orbiting particles
      for (let i = 0; i < portalParticles.length; i++) {
        const p1 = portalParticles[i];
        const x1 = centerX + Math.cos(p1.angle) * p1.radius;
        const y1 = centerY + Math.sin(p1.angle) * p1.radius;
        for (let j = i + 1; j < portalParticles.length; j++) {
          const p2 = portalParticles[j];
          const x2 = centerX + Math.cos(p2.angle) * p2.radius;
          const y2 = centerY + Math.sin(p2.angle) * p2.radius;
          const d = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
          if (d < 50) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(110,231,255,${0.06 * (1 - d / 50)})`;
            ctx.lineWidth = 0.3;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(raf);
  }, [isInView]);

  return (
    <section ref={ref} className="relative flex items-center justify-center py-24 overflow-hidden">
      {/* Portal background */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* CSS portal rings */}
        {[100, 140, 180, 220, 260].map((size, i) => (
          <motion.div
            key={size}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.2 + i * 0.15 }}
            className="portal-ring absolute"
            style={{
              width: size,
              height: size,
              borderColor: i % 2 === 0
                ? `rgba(110,231,255,${0.12 - i * 0.018})`
                : `rgba(139,92,246,${0.08 - i * 0.012})`,
              animationDuration: `${8 + i * 3}s`,
              animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
            }}
          />
        ))}

        {/* Canvas particle portal */}
        <motion.canvas
          ref={canvasRef}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 2 }}
          className="absolute"
          style={{
            width: 600,
            height: 600,
            maxWidth: '90vw',
            maxHeight: '90vw',
            pointerEvents: 'none',
          }}
        />

        {/* Center glow pulse */}
        <motion.div
          animate={{
            boxShadow: [
              '0 0 60px rgba(110,231,255,0.05), 0 0 120px rgba(139,92,246,0.03)',
              '0 0 80px rgba(110,231,255,0.1), 0 0 160px rgba(139,92,246,0.05)',
              '0 0 60px rgba(110,231,255,0.05), 0 0 120px rgba(139,92,246,0.03)',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-48 h-48 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(110,231,255,0.08) 0%, rgba(139,92,246,0.04) 40%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <span className="text-xs tracking-[0.3em] uppercase font-medium"
            style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(110,231,255,0.4)' }}>
            09 — Connect
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}
        >
          <span style={{ color: '#F4F4F4' }}>Let&apos;s Build Something</span>
          <br />
          <span className="gradient-text-blue" style={{ WebkitTextFillColor: 'initial' }}>
            <span className="text-glow-blue" style={{ color: '#6EE7FF' }}>Extraordinary</span>
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 text-sm md:text-base"
          style={{ color: '#888888', fontFamily: 'Inter, sans-serif', lineHeight: 1.7 }}
        >
          Ready to collaborate on intelligent systems that push boundaries.
          Let&apos;s connect and create the future.
        </motion.p>

        {/* Glass panel with social links */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 inline-block p-8 rounded-3xl"
          style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Social icons row */}
          <div className="flex items-center justify-center gap-6 mb-8">
            {socials.map((social, i) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.2 + i * 0.15, type: 'spring' }}
                data-cursor="pointer"
                className="group w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(110,231,255,0.06)',
                  border: '1px solid rgba(110,231,255,0.12)',
                  transition: 'all 0.3s ease',
                }}
                whileHover={{
                  scale: 1.15,
                  boxShadow: '0 0 25px rgba(110,231,255,0.2)',
                }}
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{social.icon}</span>
                <span className="absolute -bottom-7 text-[9px] tracking-wider uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: '#6EE7FF', fontFamily: 'Inter, sans-serif' }}>
                  {social.name}
                </span>
              </motion.a>
            ))}
          </div>

          {/* Email link */}
          <motion.a
            href="mailto:maryamarshad668@gmail.com"
            data-cursor="pointer"
            className="inline-block px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase font-medium transition-all group"
            style={{
              background: 'rgba(110,231,255,0.08)',
              border: '1px solid rgba(110,231,255,0.2)',
              color: '#6EE7FF',
              fontFamily: 'Inter, sans-serif',
            }}
            whileHover={{
              boxShadow: '0 0 40px rgba(110,231,255,0.15)',
              scale: 1.02,
            }}
          >
            <span className="group-hover:tracking-[0.2em] transition-all duration-300">
              Get In Touch
            </span>
          </motion.a>
        </motion.div>

        {/* Location */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="mt-12 text-xs tracking-wider"
          style={{ color: '#888888', fontFamily: 'Inter, sans-serif' }}
        >
          Lahore, Pakistan &middot; Open to remote & global opportunities
        </motion.p>

        {/* Phone numbers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 2 }}
          className="mt-3 flex justify-center gap-6"
        >
        </motion.div>
      </div>
    </section>
  );
}
