import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { weddingData } from '../data/weddingData.js';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-inner > *', {
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 85%'
        },
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out'
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  const { thankYou, signature, date } = weddingData.footer;

  return (
    <footer className="site-footer" ref={footerRef}>
      <div className="footer-inner">
        <span className="footer-orn">✦</span>
        <p className="footer-thanks">{thankYou}</p>
        <h3 className="footer-signature">{signature}</h3>
        <p className="footer-date">{date}</p>
        <span className="footer-orn">✦</span>
        <p className="footer-fineprint">
          Designed with love · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
