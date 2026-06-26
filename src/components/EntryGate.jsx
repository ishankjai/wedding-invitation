import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { weddingData } from '../data/weddingData.js';

export default function EntryGate({ onOpen }) {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);
  const exitRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from('.gate-card', {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out'
      })
        .from(
          '.gate-monogram',
          { scale: 0.7, opacity: 0, duration: 0.9, ease: 'back.out(1.6)' },
          '-=0.6'
        )
        .from('.gate-names', { y: 30, opacity: 0, duration: 0.8 }, '-=0.4')
        .from('.gate-sub', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
        .from('.gate-btn', { y: 20, opacity: 0, duration: 0.6 }, '-=0.3')
        .from('.gate-deco', { opacity: 0, duration: 1, stagger: 0.15 }, '-=0.4');
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  const handleClick = () => {
    const tl = gsap.timeline({
      onComplete: () => onOpen && onOpen()
    });
    tl.to('.gate-card', { y: -20, scale: 0.96, duration: 0.4, ease: 'power2.in' }).to(
      wrapRef.current,
      { opacity: 0, duration: 0.6, ease: 'power2.inOut' },
      '-=0.1'
    );
  };

  return (
    <div className="entry-gate" ref={wrapRef}>
      <div className="gate-bg" />
      <div className="gate-deco gate-deco-tl" />
      <div className="gate-deco gate-deco-tr" />
      <div className="gate-deco gate-deco-bl" />
      <div className="gate-deco gate-deco-br" />

      <div className="gate-card" ref={cardRef}>
        <div className="gate-monogram">
          <span>I</span>
          <span className="gate-and">&amp;</span>
          <span>N</span>
        </div>

        <div className="gate-line" />

        <p className="gate-sub small-caps">— You are invited —</p>

        <h1 className="gate-names">
          {weddingData.couple.groom.name} <em>&amp;</em> {weddingData.couple.bride.name}
        </h1>

        <p className="gate-sub">{weddingData.date.full} · {weddingData.date.day}</p>

        <button className="gate-btn btn" onClick={handleClick} ref={exitRef}>
          Open Invitation
        </button>
      </div>

      <style>{css}</style>
    </div>
  );
}

const css = `
.entry-gate {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 30% 20%, rgba(212, 175, 55, 0.18), transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(186, 122, 118, 0.18), transparent 55%),
    linear-gradient(140deg, #f8f4ee, #efe1cf);
  overflow: hidden;
  padding: 30px 0;
}
.gate-bg {
  position: absolute;
  inset: -10%;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><g fill="none" stroke="%23d4af37" stroke-opacity="0.06"><circle cx="120" cy="120" r="100"/><circle cx="120" cy="120" r="60"/><circle cx="120" cy="120" r="20"/></g></svg>');
  background-size: 200px;
  opacity: 0.5;
}
.gate-card {
  position: relative;
  z-index: 2;
  width: min(540px, 92vw);
  background: linear-gradient(180deg, #fffaf2, #f5ead7);
  border: 1px solid rgba(212, 175, 55, 0.4);
  border-radius: 22px;
  padding: 56px 36px 44px;
  text-align: center;
  box-shadow:
    0 30px 80px rgba(74, 60, 54, 0.18),
    inset 0 0 0 6px rgba(255, 255, 255, 0.5);
}
.gate-monogram {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 1px solid var(--gold);
  margin: 0 auto 22px;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 38px;
  color: var(--deep);
  background: radial-gradient(circle, #fff8ea, #f1e1bf);
  box-shadow: inset 0 0 0 6px rgba(255, 255, 255, 0.45),
    0 10px 30px rgba(212, 175, 55, 0.25);
}
.gate-and {
  font-size: 22px;
  color: var(--gold);
  transform: translateY(-2px);
}
.gate-line {
  width: 60px;
  height: 1px;
  background: var(--gold);
  margin: 0 auto 16px;
}
.gate-sub {
  font-family: var(--font-sans);
  font-size: 12px;
  letter-spacing: 0.32em;
  color: var(--text-soft);
  text-transform: uppercase;
}
.gate-sub.small-caps { color: var(--gold); }
.gate-names {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(2.4rem, 6vw, 3.3rem);
  color: var(--deep);
  margin: 18px 0 16px;
  line-height: 1.1;
}
.gate-names em {
  font-family: var(--font-script);
  color: var(--gold);
  font-style: normal;
  font-size: 0.8em;
}
.gate-btn {
  margin-top: 28px;
}
.gate-hint {
  margin-top: 20px;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-soft);
  opacity: 0.7;
}

.gate-deco {
  position: absolute;
  width: 160px;
  height: 160px;
  pointer-events: none;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="%23d4af37" stroke-width="0.7"><path d="M5,5 Q50,5 50,50"/><path d="M5,5 Q5,50 50,50"/><circle cx="5" cy="5" r="1.4" fill="%23d4af37"/></g></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.7;
}
.gate-deco-tl { top: 20px; left: 20px; }
.gate-deco-tr { top: 20px; right: 20px; transform: scaleX(-1); }
.gate-deco-bl { bottom: 20px; left: 20px; transform: scaleY(-1); }
.gate-deco-br { bottom: 20px; right: 20px; transform: scale(-1, -1); }

@media (max-width: 600px) {
  .gate-card { padding: 44px 24px 32px; }
  .gate-deco { width: 100px; height: 100px; }
}
`;
