import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { weddingData } from '../data/weddingData.js';
import '../styles/story.css';

gsap.registerPlugin(ScrollTrigger);

export default function StorySection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.story-section .section-heading', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });

      const cards = gsap.utils.toArray('.story-card');
      cards.forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 82%'
          },
          y: 80,
          opacity: 0,
          rotate: i % 2 === 0 ? -3 : 3,
          scale: 0.96,
          duration: 1.1,
          ease: 'power3.out'
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section story-section" ref={sectionRef}>
      <div className="section-inner">
        <div className="section-heading">
          <span className="eyebrow">Our Journey</span>
          <h2 className="section-title">Five Moments. One Forever.</h2>
          <div className="divider">✦</div>
          <p className="section-sub">
            Every great story begins quietly — ours did too. Here are the moments that wrote us into forever.
          </p>
        </div>

        <div className="story-track">
          <div className="story-thread" aria-hidden="true" />
          {weddingData.story.map((s, i) => (
            <article className="story-card" key={s.id}>
              <div className="story-photo-frame">
                <span className="story-tape" aria-hidden="true" />
                <img className="story-photo" src={s.image} alt={s.title} loading="lazy" />
              </div>
              <div className="story-content">
                <p className="story-index">Chapter {String(i + 1).padStart(2, '0')}</p>
                <h3 className="story-title">{s.title}</h3>
                <p className="story-date">{s.date}</p>
                <p className="story-desc">{s.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
