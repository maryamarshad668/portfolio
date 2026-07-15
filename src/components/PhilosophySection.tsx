import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const quotes = [
  { text: "I don\u2019t just build software. I design experiences." },
];

export default function PhilosophySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(110,231,255,0.03) 0%, transparent 50%)',
      }} />

      <div className="max-w-5xl mx-auto px-6">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <span className="text-xs tracking-[0.3em] uppercase font-medium"
            style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(110,231,255,0.4)' }}>
            08 — Philosophy
          </span>
        </motion.div>

        {/* Quotes */}
        <div className="space-y-32">
          {quotes.map((quote, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.3 + i * 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Large quote mark */}
              <div className="absolute -top-8 -left-4 font-serif opacity-[0.03]"
                style={{ color: '#6EE7FF', fontSize: 120, lineHeight: 0.8 }}>
                {'"'}
              </div>

              <h3
                className="relative text-glow-blue"
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 'clamp(1.8rem, 5vw, 4rem)',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: '#F4F4F4',
                  letterSpacing: '-0.02em',
                }}
              >
                {quote.text}
              </h3>

              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: 60 } : {}}
                transition={{ duration: 0.8, delay: 0.8 + i * 0.4 }}
                className="h-px mt-8 mb-4"
                style={{ background: 'linear-gradient(90deg, rgba(110,231,255,0.3), transparent)' }}
              />

            </motion.div>
          ))}
        </div>

        {/* Closing statement */}
      </div>
    </section>
  );
}
