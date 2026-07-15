import { useEffect, useRef, useState } from 'react';

interface Props {
  onComplete: () => void;
}

// MA letterform as a grid of points
function getMAPoints(width: number, height: number) {
  const points: { x: number; y: number }[] = [];
  const offscreen = document.createElement('canvas');
  offscreen.width = width;
  offscreen.height = height;
  const ctx = offscreen.getContext('2d')!;

  ctx.fillStyle = '#fff';
  ctx.font = `bold ${Math.min(width * 0.45, height * 0.7)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('MA', width / 2, height / 2);

  const data = ctx.getImageData(0, 0, width, height).data;
  const step = Math.max(4, Math.floor(width / 80));

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      if (data[idx + 3] > 128) {
        points.push({ x, y });
      }
    }
  }
  return points;
}

export default function IntroScene({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState(0);
  // 0=mounting 1=particles scatter 2=assemble 3=glow 4=dissolve 5=done

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1400),
      setTimeout(() => setPhase(3), 3000),
      setTimeout(() => setPhase(4), 4200),
      setTimeout(() => setPhase(5), 5400),
      setTimeout(() => onComplete(), 5900),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.width  = window.innerWidth;
    const H = canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let currentPhase = phase;

    // Build target MA points
    const targets = getMAPoints(W, H);

    // Particle pool
    const COUNT = Math.min(targets.length, 600);
    const subset = targets.length > COUNT
      ? targets.filter((_, i) => i % Math.ceil(targets.length / COUNT) === 0).slice(0, COUNT)
      : targets;

    interface Particle {
      x: number; y: number;
      tx: number; ty: number;   // target (letter)
      sx: number; sy: number;   // scatter pos
      vx: number; vy: number;
      alpha: number;
      size: number;
      color: string;
      assembled: boolean;
    }

    const colors = ['#6EE7FF', '#8B5CF6', '#D4AF37', '#ffffff'];
    const particles: Particle[] = subset.map((pt) => {
      const angle = Math.random() * Math.PI * 2;
      const dist  = Math.random() * Math.max(W, H) * 0.6 + 100;
      return {
        x:  pt.x + (Math.random() - 0.5) * W,
        y:  pt.y + (Math.random() - 0.5) * H,
        tx: pt.x,
        ty: pt.y,
        sx: W / 2 + Math.cos(angle) * dist,
        sy: H / 2 + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        alpha: 0,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        assembled: false,
      };
    });

    // Extra ambient particles (stars)
    const starCount = 150;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.4 + 0.1,
      twinkle: Math.random() * Math.PI * 2,
    }));

    let dissolveProgress = 0;

    const render = () => {
      ctx.clearRect(0, 0, W, H);

      // ── Stars (ambient) ──
      stars.forEach(s => {
        s.twinkle += 0.015;
        const a = s.alpha * (0.6 + 0.4 * Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(110,231,255,${a * (currentPhase >= 1 ? 1 : 0)})`;
        ctx.fill();
      });

      // ── Particles ──
      particles.forEach(p => {
        if (currentPhase === 1) {
          // scatter phase — particles drift from their start positions
          p.x += (p.sx - p.x) * 0.06;
          p.y += (p.sy - p.y) * 0.06;
          p.alpha = Math.min(p.alpha + 0.04, 0.5);
        } else if (currentPhase === 2) {
          // assemble into MA
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          p.vx = p.vx * 0.78 + dx * 0.09;
          p.vy = p.vy * 0.78 + dy * 0.09;
          p.x += p.vx;
          p.y += p.vy;
          p.alpha = Math.min(p.alpha + 0.06, 1);
          p.assembled = Math.abs(dx) < 2 && Math.abs(dy) < 2;
        } else if (currentPhase === 3) {
          // glowing in place — gentle float
          p.x += Math.sin(Date.now() * 0.001 + p.ty) * 0.15;
          p.alpha = 0.85 + Math.sin(Date.now() * 0.002 + p.tx * 0.01) * 0.15;
        } else if (currentPhase === 4) {
          // dissolve outward into stars
          dissolveProgress = Math.min(dissolveProgress + 0.012, 1);
          const angle = Math.atan2(p.ty - H / 2, p.tx - W / 2);
          const speed = 3 + Math.random() * 4;
          p.vx += Math.cos(angle) * speed * 0.05;
          p.vy += Math.sin(angle) * speed * 0.05;
          p.vy -= 0.1; // drift upward
          p.x += p.vx;
          p.y += p.vy;
          p.alpha = Math.max(0, p.alpha - 0.025);
        } else if (currentPhase >= 5) {
          p.alpha = Math.max(0, p.alpha - 0.05);
        }

        if (p.alpha <= 0) return;

        // Glow for assembled particles
        if (currentPhase === 3 || (currentPhase === 2 && p.assembled)) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(p.color, p.alpha);
        ctx.fill();
      });

      ctx.shadowBlur = 0;

      // ── Central glow behind MA ──
      if (currentPhase >= 2 && currentPhase <= 3) {
        const gAlpha = currentPhase === 3 ? 0.12 : 0.06;
        const grd = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.3);
        grd.addColorStop(0, `rgba(110,231,255,${gAlpha})`);
        grd.addColorStop(0.5, `rgba(139,92,246,${gAlpha * 0.4})`);
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
      }

      raf = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Track phase in the animation loop ref
  useEffect(() => {
    (window as any).__introPhase = phase;
  }, [phase]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: '#050505',
        opacity: phase >= 5 ? 0 : 1,
        transition: 'opacity 0.7s ease',
        pointerEvents: phase >= 5 ? 'none' : 'auto',
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Loading label */}
      {phase >= 1 && phase <= 3 && (
        <div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          style={{ opacity: phase >= 2 ? 1 : 0, transition: 'opacity 1s ease' }}
        >
          <div style={{ width: 80, height: 1, background: 'rgba(255,255,255,0.08)', borderRadius: 1, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: phase === 1 ? '30%' : phase === 2 ? '70%' : '100%',
                background: 'linear-gradient(90deg, #6EE7FF, #8B5CF6)',
                transition: 'width 1.2s cubic-bezier(0.19,1,0.22,1)',
                borderRadius: 1,
              }}
            />
          </div>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: '0.25em', color: 'rgba(110,231,255,0.4)', textTransform: 'uppercase' }}>
            {phase === 1 ? 'Initializing' : phase === 2 ? 'Assembling' : 'Ready'}
          </span>
        </div>
      )}
    </div>
  );
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}