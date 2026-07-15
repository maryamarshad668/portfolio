import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const educationRecords = [
  {
    title: 'BS Computer Science',
    institution: 'Information Technology University, Lahore',
    period: '2024 – 2028',
    description: 'Focused on AI, software engineering, and systems design with hands-on projects in machine learning, APIs, and intelligent user experiences.',
    highlights: ['Artificial Intelligence', 'Software Engineering', 'Advanced Databases', 'Digital Logic Design'],
  },
];

export default function EducationSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} id="education" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(110,231,255,0.04), transparent 40%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 100% 80%, rgba(212,175,55,0.04), transparent 45%)' }} />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <span className="text-xs tracking-[0.3em] uppercase font-medium"
            style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(110,231,255,0.5)' }}>
            02 — Education
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
          <span style={{ color: '#F4F4F4' }}>Academic </span>
          <span style={{ color: '#6EE7FF' }}>Foundations</span>
        </motion.h2>

        <div className="grid grid-cols-1 mt-14">
          {educationRecords.map((record, index) => (
            <motion.div
              key={record.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
              className="rounded-3xl p-8 lg:p-10"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div className="lg:grid lg:grid-cols-[2fr_1fr] gap-8 items-start">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
                    style={{ background: 'rgba(110,231,255,0.08)', border: '1px solid rgba(110,231,255,0.1)' }}>
                    <span className="text-[10px] tracking-[0.15em] uppercase" style={{ color: '#6EE7FF', fontFamily: 'Inter, sans-serif' }}>
                      {record.period}
                    </span>
                  </div>

                  <h3 className="text-2xl font-semibold mb-2" style={{ color: '#F4F4F4', fontFamily: 'Syne, sans-serif' }}>
                    {record.title}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: '#888888', fontFamily: 'Inter, sans-serif', lineHeight: 1.7 }}>
                    {record.institution}
                  </p>
                  <p className="text-sm mb-6" style={{ color: '#DADADA', fontFamily: 'Inter, sans-serif', lineHeight: 1.8 }}>
                    {record.description}
                  </p>
                </div>

                <div className="grid gap-3 pt-4 lg:pt-0">
                  {record.highlights.map((item) => (
                    <div key={item} className="inline-flex items-center gap-3 text-xs" style={{ color: '#888888', fontFamily: 'Inter, sans-serif' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6EE7FF' }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
