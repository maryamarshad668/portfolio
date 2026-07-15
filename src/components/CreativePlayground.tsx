import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

const creativeItems = [
  { emoji: '💡', title: 'Ideas',   desc: 'Where engineering meets imagination' },
  { emoji: '🎨', title: 'Design',  desc: 'Visual storytelling through code' },
  { emoji: '📝', title: 'Writing', desc: 'Translating complexity into clarity' },
  { emoji: '🔮', title: 'Vision',  desc: 'Seeing the next form of intelligent experiences' },
];

const RESPONSES: Record<string, string> = {
  skills:     "Maryam's core skills include Python, PyTorch, TensorFlow, React, Node.js, Docker, and LLM APIs — OpenAI, Anthropic, and Gemini.",
  projects:   "Maryam built AI-Sentinel (LLM-powered code quality analyzer), Strait of Hormuz (real-time maritime crisis system), and a Face Mask Detection system using PyTorch and OpenCV.",
  experience: "Maryam was a Teaching Assistant for Digital Logic Design at ITU Lahore, and a Content Writing Intern at InAmigos Foundation.",
  ai:         "AI is the science of creating systems that learn, reason, and adapt. Maryam works at the intersection of AI engineering and real-world product design.",
  default:    "Maryam specializes in AI/ML systems — LLM integration, computer vision, and real-time data pipelines. Ask me about her skills, projects, or experience.",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('skill') || lower.includes('tech') || lower.includes('python') || lower.includes('pytorch'))
    return RESPONSES.skills;
  if (lower.includes('project') || lower.includes('build') || lower.includes('sentinel') || lower.includes('hormuz'))
    return RESPONSES.projects;
  if (lower.includes('experience') || lower.includes('work') || lower.includes('intern') || lower.includes('ta'))
    return RESPONSES.experience;
  if (lower.includes('ai') || lower.includes('ml') || lower.includes('machine') || lower.includes('learn'))
    return RESPONSES.ai;
  return RESPONSES.default;
}

// ── AI Chat ──────────────────────────────────────────────────
function AIChat() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: 'ai', text: "Hi! I'm Maryam's AI assistant. Ask me about her skills, projects, or experience." },
  ]);
  const [input,    setInput]    = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const hasScrolledOnMount = useRef(false);

  useEffect(() => {
    if (!hasScrolledOnMount.current) {
      hasScrolledOnMount.current = true;
      return;
    }
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || isTyping) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: getResponse(text) }]);
      setIsTyping(false);
      // Re-focus input after response
      setTimeout(() => inputRef.current?.focus(), 50);
    }, 900 + Math.random() * 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden w-full"
      style={{
        maxWidth:   440,
        background: 'rgba(255,255,255,0.02)',
        border:     '1px solid rgba(255,255,255,0.06)',
        boxShadow:  '0 0 40px rgba(110,231,255,0.04)',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center gap-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width: 7, height: 7, borderRadius: '50%', background: '#6EE7FF', boxShadow: '0 0 8px rgba(110,231,255,0.6)', flexShrink: 0 }}
        />
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: '0.2em', color: '#6EE7FF', textTransform: 'uppercase' }}>
          AI Assistant · Ask Me Anything
        </span>
      </div>

      {/* Messages */}
      <div
        className="p-4 space-y-3 overflow-y-auto"
        style={{ minHeight: 200, maxHeight: 280, scrollbarWidth: 'thin' }}
      >
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              style={{
                maxWidth:     '85%',
                padding:      '8px 14px',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background:   msg.role === 'user'
                  ? 'rgba(110,231,255,0.08)'
                  : 'rgba(255,255,255,0.03)',
                border:       `1px solid ${msg.role === 'user'
                  ? 'rgba(110,231,255,0.15)'
                  : 'rgba(255,255,255,0.05)'}`,
                color:        msg.role === 'user' ? '#6EE7FF' : '#999999',
                fontFamily:   'Inter, sans-serif',
                fontSize:     12,
                lineHeight:   1.65,
              }}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div
              style={{
                padding:      '10px 14px',
                borderRadius: '18px 18px 18px 4px',
                background:   'rgba(255,255,255,0.03)',
                border:       '1px solid rgba(255,255,255,0.05)',
                display:      'flex',
                gap:          5,
                alignItems:   'center',
              }}
            >
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  style={{ width: 5, height: 5, borderRadius: '50%', background: '#6EE7FF' }}
                  animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input — no form tag */}
      <div
        className="px-4 py-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Maryam's work..."
            style={{
              flex:         1,
              padding:      '9px 16px',
              borderRadius: 100,
              background:   'rgba(255,255,255,0.04)',
              border:       '1px solid rgba(255,255,255,0.08)',
              color:        '#F4F4F4',
              fontFamily:   'Inter, sans-serif',
              fontSize:     12,
              outline:      'none',
              caretColor:   '#6EE7FF',
              transition:   'border-color 0.2s ease',
            }}
            onFocus={e  => (e.target.style.borderColor = 'rgba(110,231,255,0.3)')}
            onBlur={e   => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            autoComplete="off"
          />
          <motion.button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            whileHover={input.trim() && !isTyping ? { scale: 1.08 } : {}}
            whileTap={input.trim()  && !isTyping ? { scale: 0.94 } : {}}
            style={{
              width:        36,
              height:       36,
              borderRadius: '50%',
              flexShrink:   0,
              background:   input.trim() && !isTyping
                ? 'rgba(110,231,255,0.12)'
                : 'rgba(255,255,255,0.03)',
              border:       `1px solid ${input.trim() && !isTyping
                ? 'rgba(110,231,255,0.25)'
                : 'rgba(255,255,255,0.06)'}`,
              color:        input.trim() && !isTyping ? '#6EE7FF' : '#333',
              fontSize:     16,
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
              transition:   'all 0.2s ease',
              cursor:       input.trim() && !isTyping ? 'pointer' : 'default',
            }}
          >
            →
          </motion.button>
        </div>

        <p style={{
          fontFamily:   'Inter, sans-serif',
          fontSize:     10,
          color:        '#333',
          marginTop:    8,
          letterSpacing:'0.06em',
        }}>
          Try: "skills" · "projects" · "experience" · "AI"
        </p>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────
export default function CreativePlayground() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(139,92,246,0.04), transparent 55%)' }}
      />

      <div className="max-w-6xl mx-auto px-6">

        {/* ── Beyond Code ── */}
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(139,92,246,0.5)', marginBottom: 24 }}
        >
          06 — Beyond Code
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'Syne, Inter, sans-serif',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            marginBottom: 40,
          }}
        >
          <span style={{ color: '#F4F4F4' }}>More Than </span>
          <span style={{ color: '#8B5CF6' }}>an Engineer</span>
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-28">
          {creativeItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.25 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, borderColor: 'rgba(139,92,246,0.15)', background: 'rgba(139,92,246,0.04)' }}
              className="text-center p-6 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border:     '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.25s ease',
              }}
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3 + i * 0.6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ fontSize: 28, marginBottom: 12 }}
              >
                {item.emoji}
              </motion.div>
              <h4 style={{ fontFamily: 'Syne, Inter, sans-serif', fontSize: 13, fontWeight: 600, color: '#F4F4F4', marginBottom: 4 }}>
                {item.title}
              </h4>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#666', lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── AI Playground ── */}
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(110,231,255,0.5)', marginBottom: 20 }}
        >
          07 — AI Playground
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'Syne, Inter, sans-serif',
            fontSize: 'clamp(1.6rem, 3vw, 2.6rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: 36,
          }}
        >
          <span style={{ color: '#F4F4F4' }}>Interactive </span>
          <span style={{ color: '#6EE7FF' }}>Experiments</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center"
        >
          <AIChat />
        </motion.div>
      </div>
    </section>
  );
}