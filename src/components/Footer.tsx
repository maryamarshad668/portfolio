import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  const [stars, setStars] = useState<{ x: number; y: number; size: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 5,
      duration: 2 + Math.random() * 4,
    }));
    setStars(generated);
  }, []);

  return (
    <footer className="relative py-24 overflow-hidden" style={{ background: '#050505' }}>
      {/* Stars */}
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              background: 'rgba(110,231,255,0.4)',
              animation: `star-twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {/* MA initials */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <span
            className="text-glow-blue inline-block"
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              fontWeight: 800,
              color: '#6EE7FF',
              letterSpacing: '0.05em',
            }}
          >
            MA
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xs tracking-[0.2em] uppercase mb-8"
          style={{ color: '#888888', fontFamily: 'Inter, sans-serif' }}
        >
          Architect of Intelligence
        </motion.p>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex justify-center gap-8 mb-12"
        >
          {[
            { name: 'Email', href: 'mailto:maryamarshad668@gmail.com' },
            { name: 'LinkedIn', href: 'https://linkedin.com/in/maryam-arshad668' },
          ].map(link => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="pointer"
              className="text-xs tracking-wider uppercase transition-colors hover:text-[#6EE7FF]"
              style={{ color: '#888888', fontFamily: 'Inter, sans-serif' }}
            >
              {link.name}
            </a>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="section-divider mb-8" />

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-[10px] tracking-wider"
          style={{ color: 'rgba(136,136,136,0.4)', fontFamily: 'Inter, sans-serif' }}
        >
          &copy; {new Date().getFullYear()} Maryam Arshad. Designed with intention.
        </motion.p>
      </div>
    </footer>
  );
}
