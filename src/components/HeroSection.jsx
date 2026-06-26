import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { weddingData } from '../data/weddingData.js';
import '../styles/hero.css';

export default function HeroSection() {
  const heroRef = useRef(null);
  const petalsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-blessing', { y: 30, opacity: 0, duration: 0.9 })
        .from('.hero-invite-text', { y: 24, opacity: 0, duration: 0.8 }, '-=0.5')
        .from('.hero-name', { y: 40, opacity: 0, duration: 0.9, stagger: 0.15 }, '-=0.4')
        .from('.hero-amp', { scale: 0.6, opacity: 0, duration: 0.7, ease: 'back.out(1.6)' }, '-=0.6')
        .from('.hero-parent', { y: 22, opacity: 0, duration: 0.7, stagger: 0.12 }, '-=0.3')
        .from('.hero-date', { y: 18, opacity: 0, duration: 0.6 }, '-=0.3')
        .from('.scroll-indicator', { y: 14, opacity: 0, duration: 0.6 }, '-=0.2');

      // Floating petals
      const container = petalsRef.current;
      if (!container) return;
      const colors = ['#d4af37', '#ba7a76', '#e6c97a', '#8a4f4c'];
      for (let i = 0; i < 18; i++) {
        const petal = document.createElement('span');
        petal.className = 'petal';
        petal.style.left = Math.random() * 100 + '%';
        const size = 10 + Math.random() * 16;
        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        const color = colors[i % colors.length];
        petal.style.background = `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`;
        petal.style.borderRadius = '60% 0 60% 0';
        petal.style.filter = 'blur(0.3px)';
        container.appendChild(petal);

        gsap.fromTo(
          petal,
          {
            y: -60,
            x: 0,
            rotate: Math.random() * 360,
            opacity: 0
          },
          {
            y: window.innerHeight + 120,
            x: () => (Math.random() - 0.5) * 200,
            rotate: '+=360',
            opacity: 0.75,
            duration: 10 + Math.random() * 8,
            delay: Math.random() * 6,
            repeat: -1,
            ease: 'sine.inOut'
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const { bride, groom } = weddingData.couple;

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-frame" />
      <div className="petal-layer" ref={petalsRef} />

      <div className="hero-inner">
        <p className="hero-blessing">{weddingData.blessings}</p>

        <p className="hero-invite-text">{weddingData.invitationText}</p>

        <h1 className="hero-names">
          <span className="hero-name">{groom.name.toUpperCase()}</span>
          <span className="hero-amp">&amp;</span>
          <span className="hero-name">{bride.name.toUpperCase()}</span>
        </h1>

        <div className="hero-parents">
          <div className="hero-parent">
            <span className="label">{groom.relation}</span>
            <span className="names">{groom.parents}</span>
          </div>
          <div className="hero-parent">
            <span className="label">{bride.relation}</span>
            <span className="names">{bride.parents}</span>
          </div>
        </div>

        <div className="hero-date">
          <strong>{weddingData.date.full}</strong>
          <span>·</span>
          <span>{weddingData.date.day}</span>
        </div>
      </div>

      <div className="scroll-indicator">
        <span>Scroll</span>
        <div className="scroll-mouse" />
      </div>
    </section>
  );
}
