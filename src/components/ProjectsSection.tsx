import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  tech: string[];
  gradient: string;
  accentColor: string;
  icon: string;
  image: string; // path to the project's screenshot / cover image
}




const projects: Project[] = [
  {
    id: 'ai-crimescope-pk',
    name: 'AI CrimeScope PK',
    category: 'AI Investigation',
    description: 'AI-driven crime pattern detection and case insights for Pakistan.',
    longDescription: 'CrimeScope PK is a crime intelligence aggregation system designed specifically for the Pakistani news landscape. It scrapes crime-related articles from major Urdu and English news sources, runs them through an NLP/NER pipeline to extract structured entities (people, locations, crime types), geocodes extracted locations to coordinates, stores everything in MongoDB, and serves it through a FastAPI backend to a React dashboard with Leaflet maps and Recharts visualizations.',
    tech: ['Python', 'NLP', 'Data Analytics', 'ML Models', 'Dashboards'],
    gradient: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, transparent 60%)',
    accentColor: '#D4AF37',
    icon: '🕵️‍♀️',
    image: `${import.meta.env.BASE_URL}projects/crimescope-pk.jpg`,
  },
  {
    id: 'ai-sentinel',
    name: 'AI-Sentinel',
    category: 'AI / Code Intelligence',
    description: 'AI-powered technical debt and code quality analyzer.',
    longDescription: 'AI-Sentinel is an AI-powered system designed to identify and quantify technical debt in software codebases—one of the most costly and underdiagnosed problems in the software industry. Research estimates that developers lose approximately 23% of their productive time navigating poorly structured or suboptimal code. AI-Sentinel addresses this challenge by combining classical machine learning with large language model (LLM) reasoning to deliver accurate risk scores and actionable refactoring suggestions automatically.',
    tech: ['Python', 'LLM APIs', 'REST', 'Code Analysis', 'NLP'],
    gradient: 'linear-gradient(135deg, rgba(110,231,255,0.08) 0%, transparent 60%)',
    accentColor: '#6EE7FF',
    icon: '🛡️',
    image: `${import.meta.env.BASE_URL}projects/ai-sentinel.jpg`,
  },
  {
    id: 'FleetGuard AI',
    name: 'FleetGuard AI',
    category: 'Real-Time Systems',
    description: 'Real-time maritime crisis management system.',
    longDescription: 'FleetGuard AI is a real-time maritime crisis management platform designed to monitor, coordinate, and protect commercial cargo ships navigating through high-risk waters. The system combines real-time fleet simulation, AI-powered decision support, weather-aware routing, geospatial monitoring, and Retrieval-Augmented Generation (RAG) to help operators make informed decisions during maritime emergencies.',
    tech: ['Real-time Pipelines', 'REST APIs', 'Data Engineering', 'Alert Systems'],
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, transparent 60%)',
    accentColor: '#8B5CF6',
    icon: '⚓',
    image: `${import.meta.env.BASE_URL}projects/fleetGuard-ai.jpg`,
  },
  {
    id: 'face-mask',
    name: 'Face Mask Detection',
    category: 'Computer Vision',
    description: 'Deep learning model for real-time mask compliance detection.',
    longDescription: 'Build a computer vision system that detects whether a person is wearing a mask or not, checks if the mask is worn properly (fully covering nose and mouth or just partially), identifies the type of mask (surgical, N95, cloth, etc.), and also detects the color of the mask.',
    tech: ['Python', 'PyTorch', 'TensorFlow', 'OpenCV', 'Deep Learning'],
    gradient: 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, transparent 60%)',
    accentColor: '#D4AF37',
    icon: '🔬',
    image: `${import.meta.env.BASE_URL}projects/face-mask.jpg`,
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [3, 0, -3]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [-2, 0, 2]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1, 0.97]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: index * 0.15 }}
      className="flex items-center py-12"
      data-cursor="explore"
    >
      <div className="w-full max-w-6xl mx-auto px-6">
        <motion.div
          style={{
            perspective: 1200,
            rotateY,
            rotateX,
            scale,
          }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0" style={{ background: project.gradient }} />

          {/* Card */}
          <div
            className="relative p-8 md:p-16"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '1.5rem',
            }}
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Visual */}
              <div className="relative">
                {/* Project visual */}
                <div
                  className="aspect-video rounded-2xl overflow-hidden relative"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {!imgFailed ? (
                    <>
                      {/* The actual project image */}
                      <motion.img
                        src={project.image}
                        alt={`${project.name} preview`}
                        onError={() => setImgFailed(true)}
                        initial={{ scale: 1.08, opacity: 0 }}
                        animate={isInView ? { scale: 1, opacity: 1 } : {}}
                        transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {/* Tint so the image sits inside the same palette as the card */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(180deg, transparent 40%, ${project.accentColor}22 100%)`,
                        }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{ background: 'rgba(5,5,5,0.15)' }}
                      />
                    </>
                  ) : (
                    // Fallback: original animated gradient + emoji, shown only if the image is missing
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{
                          background: [
                            `radial-gradient(circle at 30% 40%, ${project.accentColor}15, transparent 50%)`,
                            `radial-gradient(circle at 70% 60%, ${project.accentColor}15, transparent 50%)`,
                            `radial-gradient(circle at 30% 40%, ${project.accentColor}15, transparent 50%)`,
                          ],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0"
                      />
                      <motion.span
                        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-6xl"
                      >
                        {project.icon}
                      </motion.span>
                    </div>
                  )}

                  {/* Scan line effect stays on top of image or fallback */}
                  <motion.div
                    animate={{ y: ['-100%', '100%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 right-0 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${project.accentColor}30, transparent)`,
                    }}
                  />
                </div>

                {/* Small emoji badge, now just a corner accent instead of the whole visual */}
                <motion.div
                  animate={{ y: [-5, 5, -5], rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 w-11 h-11 rounded-full flex items-center justify-center text-xl"
                  style={{
                    background: '#0A0A0A',
                    border: `1px solid ${project.accentColor}30`,
                    boxShadow: `0 0 20px ${project.accentColor}20`,
                  }}
                >
                  {project.icon}
                </motion.div>

                {/* Category badge */}
                <motion.div
                  animate={{ y: [-5, 5, -5], rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 0.3 }}
                  className="absolute -top-4 -right-4 px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase"
                  style={{
                    background: `${project.accentColor}10`,
                    border: `1px solid ${project.accentColor}20`,
                    color: project.accentColor,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {project.category}
                </motion.div>
              </div>

              {/* Right: Info */}
              <div>
                <motion.h3
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    fontWeight: 800,
                    color: project.accentColor,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                  }}
                >
                  {project.name}
                </motion.h3>

                <p className="mt-4 text-base md:text-lg" style={{ color: '#F4F4F4', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
                  {project.description}
                </p>

                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={isExpanded ? { opacity: 1, height: 'auto' } : {}}
                  transition={{ duration: 0.5 }}
                  className="mt-3 text-sm"
                  style={{ color: '#888888', fontFamily: 'Inter, sans-serif', lineHeight: 1.7 }}
                >
                  {isExpanded ? project.longDescription : project.longDescription.slice(0, 100) + '...'}
                </motion.p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full text-xs tracking-wider"
                      style={{
                        background: `${project.accentColor}08`,
                        border: `1px solid ${project.accentColor}15`,
                        color: `${project.accentColor}90`,
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Expand button */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  data-cursor="pointer"
                  className="mt-8 flex items-center gap-2 group"
                >
                  <span
                    className="text-xs tracking-[0.2em] uppercase font-medium transition-colors"
                    style={{ color: project.accentColor, fontFamily: 'Inter, sans-serif' }}
                  >
                    {isExpanded ? 'Collapse' : 'Explore Case Study'}
                  </span>
                  <motion.svg
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke={project.accentColor} strokeWidth="1.5"
                  >
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </motion.svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <span className="text-xs tracking-[0.3em] uppercase font-medium"
            style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(212,175,55,0.6)' }}>
            03 — Projects
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
          <span style={{ color: '#F4F4F4' }}>Built </span>
          <span style={{ color: '#D4AF37' }}>Intelligence</span>
        </motion.h2>
      </div>

      {/* Project cards */}
      {projects.map((project, i) => (
        <ProjectCard key={project.id} project={project} index={i} />
      ))}
    </section>
  );
}