import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiNavigation } from 'react-icons/fi';
import { weddingData } from '../data/weddingData.js';
import '../styles/events.css';

gsap.registerPlugin(ScrollTrigger);

export default function EventSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.events-section .section-heading', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });

      gsap.from('.event-card', {
        scrollTrigger: {
          trigger: '.events-grid',
          start: 'top 80%'
        },
        y: 60,
        opacity: 0,
        scale: 0.96,
        duration: 0.9,
        stagger: 0.12,
        ease: 'back.out(1.3)'
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section events-section" ref={sectionRef}>
      <div className="section-inner">
        <div className="section-heading">
          <span className="eyebrow">Wedding Celebrations</span>
          <h2 className="section-title">Five Days of Forever</h2>
          <div className="divider">✦</div>
          <p className="section-sub">
            Join us as we paint the days leading to our union with colour, music, light & love.
          </p>
        </div>

        <div className="events-grid">
          {weddingData.events.map((e) => (
            <article className="event-card" key={e.id}>
              <span className="event-icon">{e.icon}</span>
              <h3 className="event-name">{e.name}</h3>
              <p className="event-tagline">{e.tagline}</p>
              <div className="event-divider" />
              <div className="event-details">
                <div className="row">
                  <span className="label">Date</span>
                  <span className="value">{e.date}</span>
                </div>
                <div className="row">
                  <span className="label">Day</span>
                  <span className="value">{e.day}</span>
                </div>
                <div className="row">
                  <span className="label">Time</span>
                  <span className="value">{e.time}</span>
                </div>
                <div className="row">
                  <span className="label">Venue</span>
                  <span className="value">{e.venue}</span>
                </div>
              </div>
              {e.directionsUrl && (
                <a
                  className="event-directions"
                  href={e.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiNavigation /> Get Directions
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
