import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { weddingData } from '../data/weddingData.js';
import '../styles/gallery.css';

gsap.registerPlugin(ScrollTrigger);

export default function GallerySection() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const images = weddingData.gallery;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gallery-section .section-heading', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });

      gsap.from('.masonry-item', {
        scrollTrigger: {
          trigger: '.masonry',
          start: 'top 82%'
        },
        y: 50,
        opacity: 0,
        scale: 0.96,
        duration: 0.85,
        stagger: 0.07,
        ease: 'power3.out'
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );
  const prev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex, close, next, prev]);

  return (
    <section className="section gallery-section" ref={sectionRef}>
      <div className="section-inner">
        <div className="section-heading">
          <span className="eyebrow">Moments We Treasure</span>
          <h2 className="section-title">Through Our Lens</h2>
          <div className="divider">✦</div>
          <p className="section-sub">
            A handful of frozen smiles, stolen glances and golden hours — a glimpse of us.
          </p>
        </div>

        <div className="masonry">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              className="masonry-item"
              onClick={() => setActiveIndex(i)}
              aria-label={`Open photo ${i + 1}`}
            >
              <img src={src} alt={`Memory ${i + 1}`} loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          >
            <motion.div
              className="lightbox-stage"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="lightbox-close" onClick={close} aria-label="Close">
                <FiX />
              </button>
              <button
                className="lightbox-nav lightbox-prev"
                onClick={prev}
                aria-label="Previous"
              >
                <FiChevronLeft />
              </button>
              <img
                className="lightbox-img"
                src={images[activeIndex]}
                alt={`Memory ${activeIndex + 1}`}
                key={activeIndex}
              />
              <button
                className="lightbox-nav lightbox-next"
                onClick={next}
                aria-label="Next"
              >
                <FiChevronRight />
              </button>
              <span className="lightbox-counter">
                {String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
