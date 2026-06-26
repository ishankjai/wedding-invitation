import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiMapPin, FiNavigation } from 'react-icons/fi';
import { weddingData } from '../data/weddingData.js';
import '../styles/venue.css';

gsap.registerPlugin(ScrollTrigger);

export default function VenueSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.venue-section .section-heading', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });

      gsap.from('.venue-card', {
        scrollTrigger: {
          trigger: '.venue-card',
          start: 'top 82%'
        },
        y: 60,
        opacity: 0,
        scale: 0.97,
        duration: 1,
        ease: 'power3.out'
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const { venue } = weddingData;

  return (
    <section className="section venue-section" ref={sectionRef}>
      <div className="section-inner">
        <div className="section-heading">
          <span className="eyebrow">Where It Happens</span>
          <h2 className="section-title">The Venue</h2>
          <div className="divider">✦</div>
          <p className="section-sub">
            A place chosen with care — where memories will be made and blessings shared.
          </p>
        </div>

        <div className="venue-card">
          <div className="venue-info">
            <span className="eyebrow">
              <FiMapPin style={{ verticalAlign: 'middle', marginRight: 8 }} />
              Wedding Venue
            </span>
            <h3 className="venue-name">{venue.name}</h3>
            <p className="venue-address">{venue.address}</p>
            <p className="venue-desc">{venue.description}</p>
            <div className="venue-actions">
              <a
                className="btn"
                href={venue.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiNavigation /> Get Directions
              </a>
            </div>
          </div>

          <div className="venue-map">
            <iframe
              src={venue.mapEmbed}
              title={`Map to ${venue.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
