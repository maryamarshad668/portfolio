import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';


const achievements = [
  { year: '2026', title: 'HEC Generative AI Training', desc: 'Selected for national AI training program', icon: '🏛️' },
  { year: '2026', title: 'APMO — Asia-Pacific Mathematics Olympiad', desc: 'Represented at GIKI', icon: '🔢' },
  { year: '2024', title: 'HACK XVI Hackathon, LUMS', desc: 'Competitive hackathon experience', icon: '💻' },
  { year: '2024', title: 'Web Development Competition, ITU', desc: 'Built and shipped web solutions under time pressure', icon: '🌐' },
];

const experiences = [
  {
    role: 'Teaching Assistant — Digital Logic Design',
    company: 'Information Technology University',
    period: 'Sep 2025 – Dec 2025',
    points: [
      'Communicated complex technical concepts to undergraduates — same skill needed to document experiments and findings for engineering teams',
      'Managed queries and faculty coordination independently across a full semester',
    ],
    color: '#6EE7FF',
  },
  {
    role: 'Content Writing Intern',
    company: 'InAmigos Foundation',
    period: '2025',
    points: [
      'Delivered professional written output on deadline, translating technical and organizational requirements into clear documentation',
    ],
    color: '#8B5CF6',
  },
];


export default function JourneySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Backgrounds */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(158, 110, 255, 0.03) 0%, transparent 50%)' }} />

      <div className="max-w-6xl mx-auto px-6">
        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <span className="text-xs tracking-[0.3em] uppercase font-medium"
            style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(110,231,255,0.5)' }}>
            04 — Constellations
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          <span style={{ color: ' #8B5CF6' }}>Achievements </span>
        </motion.h2>

        {/* Achievement cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {achievements.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              data-cursor="pointer"
              className="group relative p-6 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              {/* Star dots */}
              <div className="absolute -top-1 -right-1 w-8 h-8">
                {[...Array(5)].map((_, j) => (
                  <div
                    key={j}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      background: '#6EE7FF',
                      opacity: 0.3 + Math.random() * 0.5,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animation: `star-twinkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite`,
                    }}
                  />
                ))}
              </div>

              <div className="text-2xl mb-3">{a.icon}</div>
              <div className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: '#6EE7FF', fontFamily: 'Inter, sans-serif' }}>
                {a.year}
              </div>
              <h4 className="text-sm font-semibold mb-2" style={{ color: '#F4F4F4', fontFamily: 'Inter, sans-serif', lineHeight: 1.4 }}>
                {a.title}
              </h4>
              <p className="text-xs" style={{ color: '#888888', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>
                {a.desc}
              </p>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: '0 0 30px rgba(110,231,255,0.05)' }}
              />
            </motion.div>
          ))}
        </div>

        {/* Section divider */}
        <div className="section-divider my-24" />

        {/* Experience */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-8"
        >
          <span className="text-xs tracking-[0.3em] uppercase font-medium"
            style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(139,92,246,0.5)' }}>
            05 — Experience
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          <span style={{ color: '#6EE7FF' }}>Experience </span>
        </motion.h2>

        {/* Experience cards - Building metaphor */}
        <div className="grid lg:grid-cols-2 gap-8 mt-16">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.role}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.9 + i * 0.2 }}
              className="group relative rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${exp.color}15`,
              }}
              data-cursor="pointer"
            >
              {/* Building silhouette effect */}
              <div className="absolute top-0 right-0 w-24 h-full opacity-[0.03]"
                style={{
                  background: `repeating-linear-gradient(0deg, transparent, transparent 30px, ${exp.color} 30px, ${exp.color} 31px)`,
                }}
              />

              <div className="relative p-8">
                {/* Period badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
                  style={{ background: `${exp.color}08`, border: `1px solid ${exp.color}15` }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: exp.color, boxShadow: `0 0 8px ${exp.color}60` }} />
                  <span className="text-[10px] tracking-[0.15em] uppercase" style={{ color: exp.color, fontFamily: 'Inter, sans-serif' }}>
                    {exp.period}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-1" style={{ color: '#F4F4F4', fontFamily: 'Syne, sans-serif' }}>
                  {exp.role}
                </h3>
                <p className="text-sm mb-4" style={{ color: exp.color, fontFamily: 'Inter, sans-serif' }}>
                  {exp.company}
                </p>

                <ul className="space-y-3">
                  {exp.points.map((point, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 1.1 + i * 0.2 + j * 0.1 }}
                      className="flex gap-3 text-sm"
                      style={{ color: '#888888', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}
                    >
                      <span className="mt-2 flex-shrink-0 w-1 h-1 rounded-full" style={{ background: exp.color }} />
                      {point}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ boxShadow: `0 0 40px ${exp.color}08` }}
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
