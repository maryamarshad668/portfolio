import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const trail = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('button, a, [data-cursor="pointer"]')) {
        setHovering(true);
        setCursorText('');
      }
      if (t.closest('[data-cursor="explore"]')) {
        setHovering(true);
        setCursorText('Explore');
      }
      if (t.closest('[data-cursor="text"]')) {
        setHovering(true);
        setCursorText('');
      }
    };

    const onOut = () => {
      setHovering(false);
      setCursorText('');
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    let raf: number;
    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;
      trail.current.x += (target.current.x - trail.current.x) * 0.08;
      trail.current.y += (target.current.y - trail.current.y) * 0.08;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trail.current.x}px, ${trail.current.y}px, 0)`;
      }
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  return (
    <>
      {/* Trail */}
      <div
        ref={trailRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] hidden md:block"
        style={{ willChange: 'transform' }}
      >
        <div
          className="rounded-full transition-all duration-500 ease-out"
          style={{
            width: hovering ? 50 : 30,
            height: hovering ? 50 : 30,
            marginLeft: hovering ? -25 : -15,
            marginTop: hovering ? -25 : -15,
            background: hovering
              ? 'rgba(110, 231, 255, 0.06)'
              : 'rgba(110, 231, 255, 0.03)',
            border: `1px solid rgba(110, 231, 255, ${hovering ? 0.15 : 0.06})`,
          }}
        />
      </div>
      {/* Main cursor */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block"
        style={{ willChange: 'transform' }}
      >
        <div
          className="rounded-full transition-all duration-300 ease-out flex items-center justify-center"
          style={{
            width: hovering ? (cursorText ? 80 : 56) : 14,
            height: hovering ? (cursorText ? 80 : 56) : 14,
            marginLeft: hovering ? (cursorText ? -40 : -28) : -7,
            marginTop: hovering ? (cursorText ? -40 : -28) : -7,
            background: hovering
              ? 'rgba(110, 231, 255, 0.1)'
              : 'rgba(110, 231, 255, 0.9)',
            boxShadow: hovering
              ? '0 0 30px rgba(110, 231, 255, 0.2), inset 0 0 10px rgba(110, 231, 255, 0.1)'
              : '0 0 15px rgba(110, 231, 255, 0.4)',
            border: hovering ? '1px solid rgba(110, 231, 255, 0.2)' : 'none',
          }}
        >
          {cursorText && (
            <span className="text-[10px] font-medium tracking-widest uppercase text-[#6EE7FF]">
              {cursorText}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
