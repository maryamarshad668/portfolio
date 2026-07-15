import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

// ── Data ────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  'Languages': '#6EE7FF',
  'AI & ML':   '#8B5CF6',
  'LLMs':      '#D4AF37',
  'Web':       '#6EE7FF',
  'DevOps':    '#D4AF37',
  'Data':      '#10B981',
  'Tools':     '#888888',
};

interface Node {
  id: string; label: string; category: string;
  x: number;  y: number;    description: string; level: number;
}

const NODES: Node[] = [
  // Core — center
  { id: 'python',     label: 'Python',       category: 'Languages', x: 50, y: 45, description: 'Primary language — AI/ML, APIs, scripting', level: 5 },
  // AI cluster — top
  { id: 'llms',       label: 'LLMs',         category: 'LLMs',      x: 50, y: 10, description: 'OpenAI · Anthropic · Gemini APIs',           level: 5 },
  { id: 'pytorch',    label: 'PyTorch',       category: 'AI & ML',   x: 30, y: 20, description: 'Deep learning model training & deployment',  level: 5 },
  { id: 'tensorflow', label: 'TensorFlow',    category: 'AI & ML',   x: 70, y: 20, description: 'Neural network architecture & training',     level: 4 },
  { id: 'opencv',     label: 'OpenCV',        category: 'AI & ML',   x: 15, y: 32, description: 'Computer vision & real-time video',          level: 4 },
  { id: 'sklearn',    label: 'scikit-learn',  category: 'AI & ML',   x: 85, y: 32, description: 'Classical ML algorithms & pipelines',        level: 4 },
  { id: 'numpypd',    label: 'NumPy/Pandas',  category: 'AI & ML',   x: 50, y: 30, description: 'Numerical computing & data manipulation',    level: 5 },
  // Languages — mid
  { id: 'js',         label: 'JavaScript',    category: 'Languages', x: 20, y: 52, description: 'Frontend & Node.js development',             level: 4 },
  { id: 'sql',        label: 'SQL',           category: 'Languages', x: 80, y: 52, description: 'Relational queries & database design',       level: 4 },
  // Web — lower
  { id: 'react',      label: 'React',         category: 'Web',       x: 18, y: 67, description: 'Component architecture, hooks, state',       level: 4 },
  { id: 'fastapi',    label: 'FastAPI',        category: 'Web',       x: 50, y: 62, description: 'High-performance Python REST APIs',          level: 4 },
  { id: 'node',       label: 'Node.js',        category: 'Web',       x: 33, y: 72, description: 'Server-side JS runtime & Express',          level: 3 },
  // DevOps / Data / Tools — bottom
  { id: 'docker',     label: 'Docker',         category: 'DevOps',   x: 82, y: 65, description: 'Containerisation & deployment pipelines',    level: 3 },
  { id: 'mongodb',    label: 'MongoDB',         category: 'Data',    x: 22, y: 82, description: 'NoSQL document store',                       level: 3 },
  { id: 'mysql',      label: 'MySQL',           category: 'Data',    x: 50, y: 82, description: 'Relational database management',             level: 3 },
  { id: 'git',        label: 'Git',             category: 'Tools',   x: 78, y: 80, description: 'Version control & collaboration',            level: 4 },
];

const CONNECTIONS: [string, string][] = [
  ['python', 'pytorch'], ['python', 'tensorflow'], ['python', 'opencv'],
  ['python', 'sklearn'], ['python', 'fastapi'],    ['python', 'numpypd'],
  ['pytorch', 'llms'],   ['tensorflow', 'llms'],   ['pytorch', 'tensorflow'],
  ['opencv', 'pytorch'], ['sklearn', 'numpypd'],   ['numpypd', 'pytorch'],
  ['llms', 'fastapi'],   ['react', 'js'],           ['react', 'node'],
  ['node', 'fastapi'],   ['fastapi', 'docker'],     ['mongodb', 'node'],
  ['mysql', 'fastapi'],  ['git', 'docker'],         ['sql', 'mysql'],
  ['js', 'node'],        ['python', 'js'],
];

const SKILL_GROUPS = [
  { cat: 'Languages', color: '#6EE7FF', skills: ['Python', 'JavaScript', 'HTML/CSS', 'SQL'] },
  { cat: 'AI & ML',   color: '#8B5CF6', skills: ['PyTorch', 'TensorFlow', 'scikit-learn', 'OpenCV', 'NumPy', 'Pandas'] },
  { cat: 'LLMs',      color: '#D4AF37', skills: ['OpenAI API', 'Anthropic API', 'Gemini API', 'Prompt Design', 'RAG'] },
  { cat: 'Web & APIs',color: '#6EE7FF', skills: ['React', 'Node.js', 'FastAPI', 'Express', 'REST APIs', 'Docker'] },
  { cat: 'Data & Tools', color: '#10B981', skills: ['MySQL', 'MongoDB', 'PostgreSQL', 'Git', 'GitHub', 'VS Code'] },
];

// ── Animated pulse along a connection ───────────────────────
function PulseEdge({ x1, y1, x2, y2, color, delay = 0 }: {
  x1: number; y1: number; x2: number; y2: number; color: string; delay?: number;
}) {
  const id = `pulse-${x1}-${y1}-${x2}-${y2}`.replace(/\./g, '-');
  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  return (
    <g>
      {/* Active edge line */}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth={0.4} opacity={0.5}
        style={{ transition: 'all 0.3s ease' }}
      />
      {/* Traveling dot */}
      <circle r={0.6} fill={color} opacity={0.9}>
        <animateMotion
          dur={`${0.8 + len * 0.012}s`}
          repeatCount="indefinite"
          begin={`${delay}s`}
        >
          <mpath href={`#${id}`} />
        </animateMotion>
      </circle>
      <path id={id} d={`M${x1} ${y1} L${x2} ${y2}`} fill="none" stroke="none" />
    </g>
  );
}

// ── Tooltip rendered in HTML (not SVG) ──────────────────────
function NodeTooltip({ node, svgRef }: { node: Node | null; svgRef: React.RefObject<SVGSVGElement | null> }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!node || !svgRef.current) return;
    const svg   = svgRef.current;
    const rect  = svg.getBoundingClientRect();
    const vb    = svg.viewBox.baseVal;
    const scaleX = rect.width  / vb.width;
    const scaleY = rect.height / vb.height;
    setPos({
      x: rect.left + node.x * scaleX,
      y: rect.top  + node.y * scaleY,
    });
  }, [node, svgRef]);

  return (
    <AnimatePresence>
      {node && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.95 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="fixed z-50 pointer-events-none"
          style={{
            left: pos.x,
            top:  pos.y + 18,
            transform: 'translateX(-50%)',
          }}
        >
          <div
            style={{
              background:    'rgba(8,8,8,0.95)',
              border:        `1px solid ${CATEGORY_COLORS[node.category]}30`,
              borderRadius:  10,
              padding:       '10px 14px',
              minWidth:      160,
              backdropFilter:'blur(20px)',
              boxShadow:     `0 0 20px ${CATEGORY_COLORS[node.category]}15, 0 8px 32px rgba(0,0,0,0.6)`,
            }}
          >
            {/* Node name */}
            <p style={{
              fontFamily: 'Syne, Inter, sans-serif',
              fontSize:   13,
              fontWeight: 600,
              color:      CATEGORY_COLORS[node.category],
              marginBottom: 4,
              letterSpacing: '-0.01em',
            }}>
              {node.label}
            </p>
            {/* Description */}
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize:   11,
              color:      '#888888',
              lineHeight: 1.5,
              marginBottom: 8,
            }}>
              {node.description}
            </p>
            {/* Level dots */}
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    width:        6,
                    height:       6,
                    borderRadius: '50%',
                    background:   i < node.level
                      ? CATEGORY_COLORS[node.category]
                      : 'rgba(255,255,255,0.08)',
                    boxShadow:    i < node.level
                      ? `0 0 6px ${CATEGORY_COLORS[node.category]}80`
                      : 'none',
                  }}
                />
              ))}
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize:   9,
                color:      '#444',
                marginLeft: 4,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                {['', '', '', 'Proficient', 'Advanced', 'Expert'][node.level]}
              </span>
            </div>
          </div>
          {/* Arrow */}
          <div style={{
            position:    'absolute',
            top:         -5,
            left:        '50%',
            transform:   'translateX(-50%)',
            width:       10,
            height:      5,
            overflow:    'hidden',
          }}>
            <div style={{
              width:       8,
              height:      8,
              background:  'rgba(8,8,8,0.95)',
              border:      `1px solid ${CATEGORY_COLORS[node.category]}30`,
              transform:   'rotate(45deg)',
              marginTop:   3,
              marginLeft:  1,
            }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function SkillsSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const svgRef      = useRef<SVGSVGElement>(null);
  const inView      = useInView(sectionRef, { once: true, margin: '-15%' });

  const [hoveredNode,   setHoveredNode]   = useState<string | null>(null);
  const [visibleNodes,  setVisibleNodes]  = useState<Set<string>>(new Set());
  const [visibleEdges,  setVisibleEdges]  = useState<Set<number>>(new Set());
  const [learningMode,  setLearningMode]  = useState(false);
  const [activeNode,    setActiveNode]    = useState<Node | null>(null);

  // Staggered node + edge assembly on section enter
  useEffect(() => {
    if (!inView) return;

    // Nodes appear first, sorted by y (top → bottom)
    const sorted = [...NODES].sort((a, b) => a.y - b.y);
    sorted.forEach((node, i) => {
      setTimeout(() => {
        setVisibleNodes(prev => new Set([...prev, node.id]));
      }, 200 + i * 80);
    });

    // Edges appear after all nodes
    CONNECTIONS.forEach((_, i) => {
      setTimeout(() => {
        setVisibleEdges(prev => new Set([...prev, i]));
      }, 200 + sorted.length * 80 + i * 40);
    });

    // Learning mode kicks in briefly
    setTimeout(() => {
      setLearningMode(true);
      setTimeout(() => setLearningMode(false), 3000);
    }, 200 + sorted.length * 80 + CONNECTIONS.length * 40 + 400);

  }, [inView]);

  const getConnected = useCallback((id: string) =>
    CONNECTIONS
      .filter(([a, b]) => a === id || b === id)
      .map(([a, b]) => (a === id ? b : a)),
  []);

  const connectedIds    = hoveredNode ? new Set(getConnected(hoveredNode)) : new Set<string>();

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative min-h-screen py-32 overflow-hidden"
    >
      {/* Ambient bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ position: 'absolute', top: '20%', left: '20%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.05), transparent 70%)', transform: 'translate(-50%,-50%)' }} />
        <div style={{ position: 'absolute', top: '70%', left: '80%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(110,231,255,0.04), transparent 70%)', transform: 'translate(-50%,-50%)' }} />
      </div>

      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-6"
        >
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(139,92,246,0.6)' }}>
            02 — Neural Architecture
          </span>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-end gap-4 mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily:    'Syne, Inter, sans-serif',
              fontSize:      'clamp(2.2rem, 5vw, 3.8rem)',
              fontWeight:    700,
              letterSpacing: '-0.03em',
              lineHeight:    1.05,
              color:         '#F4F4F4',
            }}
          >
            The{' '}
            <span style={{
              background: 'linear-gradient(135deg, #8B5CF6, #6EE7FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Skills Network
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize:   '0.85rem',
              color:      '#555',
              lineHeight: 1.6,
              maxWidth:   320,
              paddingBottom: 6,
            }}
          >
            Hover any node to illuminate its connections. Watch the network learn.
          </motion.p>
        </div>

        {/* ── Neural Network SVG ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
          style={{ maxWidth: 860, margin: '0 auto' }}
        >
          {/* Learning mode label */}
          <AnimatePresence>
            {learningMode && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-2 left-1/2 -translate-x-1/2 z-10"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize:   10,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color:      '#8B5CF6',
                  background: 'rgba(139,92,246,0.08)',
                  border:     '1px solid rgba(139,92,246,0.2)',
                  borderRadius: 100,
                  padding:    '4px 12px',
                  whiteSpace: 'nowrap',
                }}
              >
                ◉ Network Learning
              </motion.div>
            )}
          </AnimatePresence>

          <svg
            ref={svgRef}
            viewBox="0 0 100 95"
            className="w-full h-auto"
            style={{ minHeight: 420, overflow: 'visible' }}
          >
            <defs>
              <filter id="sk-glow-purple" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="sk-glow-blue" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="1.2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="sk-glow-gold" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* ── Edges ── */}
            {CONNECTIONS.map(([a, b], i) => {
              const nodeA = NODES.find(n => n.id === a)!;
              const nodeB = NODES.find(n => n.id === b)!;
              if (!nodeA || !nodeB) return null;

              const isActive = hoveredNode === a || hoveredNode === b;
              const isLearning = learningMode && i % 3 === 0;
              const color = CATEGORY_COLORS[nodeA.category];

              if (!visibleEdges.has(i)) return null;

              if (isActive) {
                return (
                  <PulseEdge
                    key={`e-${i}`}
                    x1={nodeA.x} y1={nodeA.y}
                    x2={nodeB.x} y2={nodeB.y}
                    color={color}
                    delay={0}
                  />
                );
              }

              if (isLearning) {
                return (
                  <PulseEdge
                    key={`e-${i}`}
                    x1={nodeA.x} y1={nodeA.y}
                    x2={nodeB.x} y2={nodeB.y}
                    color="#8B5CF6"
                    delay={i * 0.05}
                  />
                );
              }

              return (
                <line
                  key={`e-${i}`}
                  x1={nodeA.x} y1={nodeA.y}
                  x2={nodeB.x} y2={nodeB.y}
                  stroke="rgba(110,231,255,0.07)"
                  strokeWidth={0.15}
                />
              );
            })}

            {/* ── Nodes ── */}
            {NODES.map((node, ni) => {
              const color     = CATEGORY_COLORS[node.category];
              const isHovered = hoveredNode === node.id;
              const isLinked  = connectedIds.has(node.id);
              const isActive  = isHovered || isLinked;
              const dimmed    = hoveredNode !== null && !isActive;
              const visible   = visibleNodes.has(node.id);

              if (!visible) return null;

              const filterId = node.category === 'AI & ML'  ? 'sk-glow-purple'
                             : node.category === 'LLMs'     ? 'sk-glow-gold'
                             : 'sk-glow-blue';

              const nodeR = isHovered ? 3.2
                          : isLinked  ? 2.4
                          : learningMode && ni % 4 === 0 ? 2.4
                          : 2;

              return (
                <g
                  key={node.id}
                  onMouseEnter={() => { setHoveredNode(node.id); setActiveNode(node); }}
                  onMouseLeave={() => { setHoveredNode(null);   setActiveNode(null); }}
                  style={{
                    opacity:    dimmed ? 0.12 : 1,
                    transition: 'opacity 0.25s ease',
                    cursor:     'pointer',
                  }}
                >
                  {/* Outer glow ring */}
                  <circle
                    cx={node.x} cy={node.y}
                    r={nodeR + 4}
                    fill={color}
                    opacity={isHovered ? 0.07 : isLinked ? 0.04 : 0.015}
                    style={{ transition: 'all 0.3s ease' }}
                  />
                  {/* Pulse ring (hovered) */}
                  {isHovered && (
                    <>
                      <circle cx={node.x} cy={node.y} r={2} fill="none" stroke={color} strokeWidth={0.2} opacity={0}>
                        <animate attributeName="r"       from="2"  to="8"  dur="1.8s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.5" to="0" dur="1.8s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={node.x} cy={node.y} r={2} fill="none" stroke={color} strokeWidth={0.15} opacity={0}>
                        <animate attributeName="r"       from="2"  to="8"  dur="1.8s" begin="0.6s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.4" to="0" dur="1.8s" begin="0.6s" repeatCount="indefinite" />
                      </circle>
                    </>
                  )}
                  {/* Main node */}
                  <circle
                    cx={node.x} cy={node.y}
                    r={nodeR}
                    fill={color}
                    opacity={isActive ? 1 : 0.55}
                    filter={isActive ? `url(#${filterId})` : undefined}
                    style={{ transition: 'all 0.3s ease' }}
                  />
                  {/* Inner highlight */}
                  <circle
                    cx={node.x - nodeR * 0.25}
                    cy={node.y - nodeR * 0.25}
                    r={nodeR * 0.3}
                    fill="#fff"
                    opacity={isHovered ? 0.5 : 0.15}
                    style={{ transition: 'all 0.3s ease' }}
                  />
                  {/* Label */}
                  <text
                    x={node.x}
                    y={node.y + (node.y > 58 ? nodeR + 3.5 : -(nodeR + 2.5))}
                    textAnchor="middle"
                    fill={color}
                    fontSize={isHovered ? 2.8 : 2.1}
                    fontFamily="Inter, sans-serif"
                    fontWeight={isHovered ? '600' : '400'}
                    opacity={isActive ? 1 : 0.6}
                    style={{ transition: 'all 0.25s ease', pointerEvents: 'none' }}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* HTML tooltip — renders outside SVG, no clipping */}
          <NodeTooltip node={activeNode} svgRef={svgRef} />
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="flex flex-wrap justify-center gap-5 mt-10"
        >
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-2">
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}60` }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#555', letterSpacing: '0.06em' }}>
                {cat}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ── Skill pill groups ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {SKILL_GROUPS.map((group, gi) => (
            <motion.div
              key={group.cat}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2 + gi * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Group header */}
              <div className="flex items-center gap-2 mb-4">
                <div style={{ width: 3, height: 14, borderRadius: 2, background: group.color, boxShadow: `0 0 8px ${group.color}60` }} />
                <h4 style={{
                  fontFamily:    'Inter, sans-serif',
                  fontSize:      10,
                  fontWeight:    500,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color:         group.color,
                }}>
                  {group.cat}
                </h4>
              </div>

              {/* Pills */}
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill, si) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 1.3 + gi * 0.1 + si * 0.04, duration: 0.4, type: 'spring', stiffness: 300 }}
                    whileHover={{
                      background: `${group.color}14`,
                      borderColor: `${group.color}35`,
                      color: group.color,
                      y: -2,
                    }}
                    style={{
                      fontFamily:   'Inter, sans-serif',
                      fontSize:     10,
                      padding:      '4px 10px',
                      borderRadius: 100,
                      background:   `${group.color}06`,
                      border:       `1px solid ${group.color}14`,
                      color:        `${group.color}90`,
                      letterSpacing:'0.04em',
                      cursor:       'default',
                      display:      'inline-block',
                      transition:   'all 0.2s ease',
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}