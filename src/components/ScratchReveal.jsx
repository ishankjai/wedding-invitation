import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { weddingData } from '../data/weddingData.js';
import '../styles/scratch.css';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  { id: 'month', label: 'Month', value: weddingData.date.parts.month },
  { id: 'day', label: 'Day', value: weddingData.date.parts.day },
  { id: 'year', label: 'Year', value: weddingData.date.parts.year }
];

function ScratchCard({ label, value, onReveal }) {
  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const card = cardRef.current;

    const ctx = canvas.getContext('2d');

    const setup = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = card.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Foil gradient
      const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      grad.addColorStop(0, '#d4af37');
      grad.addColorStop(0.45, '#f1d97b');
      grad.addColorStop(0.55, '#b8902a');
      grad.addColorStop(1, '#d4af37');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Pattern overlay
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = '#8a6310';
      for (let y = 0; y < rect.height; y += 14) {
        for (let x = 0; x < rect.width; x += 14) {
          ctx.beginPath();
          ctx.arc(x + (y % 28 === 0 ? 0 : 7), y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // Border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 6;
      ctx.strokeRect(3, 3, rect.width - 6, rect.height - 6);

      // Hint text on foil
      ctx.fillStyle = 'rgba(76, 50, 16, 0.55)';
      ctx.font = '600 11px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SCRATCH ME', rect.width / 2, rect.height / 2 - 4);
      ctx.font = '500 9px Poppins, sans-serif';
      ctx.fillText('• • •', rect.width / 2, rect.height / 2 + 14);

      ctx.globalCompositeOperation = 'destination-out';
    };

    setup();

    const handleResize = () => setup();
    window.addEventListener('resize', handleResize);

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const point = e.touches ? e.touches[0] : e;
      return {
        x: point.clientX - rect.left,
        y: point.clientY - rect.top
      };
    };

    const clearAll = () => {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    };

    const GRID = 24;
    const SCRATCH_RADIUS = 26;
    const REVEAL_RATIO = 0.1;
    const cardRect = card.getBoundingClientRect();
    const cellW = cardRect.width / GRID;
    const cellH = cardRect.height / GRID;
    const covered = new Uint8Array(GRID * GRID);
    let coveredCount = 0;
    let isRevealed = false;

    const markCovered = (x, y) => {
      if (isRevealed) return;
      const r = SCRATCH_RADIUS;
      const minGx = Math.max(0, Math.floor((x - r) / cellW));
      const maxGx = Math.min(GRID - 1, Math.floor((x + r) / cellW));
      const minGy = Math.max(0, Math.floor((y - r) / cellH));
      const maxGy = Math.min(GRID - 1, Math.floor((y + r) / cellH));
      const r2 = r * r;
      for (let gy = minGy; gy <= maxGy; gy++) {
        for (let gx = minGx; gx <= maxGx; gx++) {
          const idx = gy * GRID + gx;
          if (covered[idx]) continue;
          const cx = (gx + 0.5) * cellW;
          const cy = (gy + 0.5) * cellH;
          const dx = cx - x;
          const dy = cy - y;
          if (dx * dx + dy * dy <= r2) {
            covered[idx] = 1;
            coveredCount++;
          }
        }
      }
      if (coveredCount / (GRID * GRID) > REVEAL_RATIO) {
        isRevealed = true;
        clearAll();
        setRevealed(true);
        onReveal && onReveal();
      }
    };

    const scratch = (e) => {
      if (!drawing.current || isRevealed) return;
      const { x, y } = getPos(e);
      ctx.beginPath();
      ctx.arc(x, y, SCRATCH_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      // soft edge
      ctx.beginPath();
      ctx.arc(x, y, 38, 0, Math.PI * 2);
      ctx.globalAlpha = 0.4;
      ctx.fill();
      ctx.globalAlpha = 1;
      markCovered(x, y);
    };

    const start = (e) => {
      if (isRevealed) return;
      drawing.current = true;
      scratch(e);
    };
    const move = (e) => {
      if (drawing.current) {
        e.preventDefault();
        scratch(e);
      }
    };
    const end = () => {
      drawing.current = false;
    };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    canvas.addEventListener('touchend', end);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchmove', move);
      canvas.removeEventListener('touchend', end);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`scratch-card ${revealed ? 'revealed' : ''}`}
      ref={cardRef}
    >
      <div className="scratch-label">{label}</div>
      <div className="scratch-reveal-text">{value}</div>
      <canvas ref={canvasRef} className="scratch-canvas" />
    </div>
  );
}

export default function ScratchReveal({ onAllRevealed }) {
  const sectionRef = useRef(null);
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.scratch-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%'
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out'
      });
      gsap.from('.scratch-section .section-heading', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%'
        },
        y: 30,
        opacity: 0,
        duration: 0.8
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (revealedCount >= CARDS.length) {
      onAllRevealed && onAllRevealed();
    }
  }, [revealedCount, onAllRevealed]);

  const handleReveal = () => setRevealedCount((c) => c + 1);

  const progress = (revealedCount / CARDS.length) * 100;

  return (
    <section className="section scratch-section" ref={sectionRef}>
      <div className="section-inner">
        <div className="section-heading">
          <span className="eyebrow">Save the Date</span>
          <h2 className="section-title">Scratch to Reveal</h2>
          <div className="divider">✦</div>
          <p className="section-sub">
            A little secret hides beneath each card. Scratch the three to discover
            the day our forever begins.
          </p>
        </div>

        <div className="scratch-grid">
          {CARDS.map((c) => (
            <ScratchCard
              key={c.id}
              label={c.label}
              value={c.value}
              onReveal={handleReveal}
            />
          ))}
        </div>

        <div className="scratch-progress" aria-hidden>
          <div className="scratch-progress-bar" style={{ width: `${progress}%` }} />
        </div>

        <p className="scratch-hint">
          {revealedCount < CARDS.length
            ? `${revealedCount} of ${CARDS.length} revealed — keep scratching`
            : '✦ The date is revealed ✦'}
        </p>
      </div>
    </section>
  );
}
