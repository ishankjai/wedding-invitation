import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { weddingData } from '../data/weddingData.js';
import '../styles/countdown.css';

gsap.registerPlugin(ScrollTrigger);

function calc(targetIso) {
  const target = new Date(targetIso).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

const LABELS = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' }
];

export default function CountdownSection({ unlocked = false }) {
  const sectionRef = useRef(null);
  const [time, setTime] = useState(() => calc(weddingData.date.iso));

  useEffect(() => {
    const id = setInterval(() => setTime(calc(weddingData.date.iso)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.count-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%'
        },
        y: 40,
        opacity: 0,
        rotate: -3,
        duration: 0.9,
        stagger: 0.12,
        ease: 'back.out(1.4)'
      });
      gsap.from('.countdown-section .section-heading', {
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

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <section className="section countdown-section" ref={sectionRef}>
      <div className="section-inner">
        <div className="section-heading">
          <span className="eyebrow">The Countdown Begins</span>
          <h2 className="section-title">A Forever Awaits</h2>
          <div className="divider">✦</div>
          <p className="section-sub">
            Every tick brings us closer to the day we say <em>“yes, forever”</em>.
          </p>
        </div>

        <div className={`countdown-grid ${unlocked ? '' : 'countdown-locked'}`}>
          {LABELS.map((l) => (
            <div className="count-card" key={l.key}>
              <span className="count-number">{pad(time[l.key])}</span>
              <span className="count-label">{l.label}</span>
            </div>
          ))}
        </div>

        {!unlocked && (
          <p className="countdown-lock-message">
            ✦ Reveal the date above to unlock the countdown ✦
          </p>
        )}

        <p className="countdown-quote">
          “Two souls, one heartbeat — counting moments until forever.”
        </p>
      </div>
    </section>
  );
}
