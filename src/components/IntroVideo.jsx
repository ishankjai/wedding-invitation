import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function IntroVideo({ onComplete }) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(wrapRef.current, { opacity: 0, duration: 0.8 });
    }, wrapRef);

    const v = videoRef.current;
    if (v) {
      v.play().catch(() => {
        // autoplay blocked or missing file — fall through to timeout
      });
    }

    const fallback = setTimeout(() => {
      finish();
    }, 5500);

    function onEnded() {
      finish();
    }
    if (v) v.addEventListener('ended', onEnded);

    return () => {
      clearTimeout(fallback);
      if (v) v.removeEventListener('ended', onEnded);
      ctx.revert();
    };
  }, []);

  const finish = () => {
    gsap.to(wrapRef.current, {
      opacity: 0,
      duration: 0.9,
      ease: 'power2.inOut',
      onComplete: () => onComplete && onComplete()
    });
  };

  return (
    <div className="intro-video" ref={wrapRef}>
      <div className="intro-vignette" />
      <video
        ref={videoRef}
        className="intro-media"
        playsInline
        muted
        autoPlay
        poster="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80"
        onError={() => setError(true)}
      >
        <source src="/assets/intro.mp4" type="video/mp4" />
      </video>

      {error && (
        <div className="intro-poster">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80"
            alt="Intro"
          />
        </div>
      )}

      <div className="intro-overlay">
        <p className="intro-line">A celebration is about to begin…</p>
      </div>

      <style>{css}</style>
    </div>
  );
}

const css = `
.intro-video {
  position: fixed;
  inset: 0;
  background: #0e0a08;
  z-index: 90;
  overflow: hidden;
}
.intro-media,
.intro-poster img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.9) contrast(1.05);
}
.intro-vignette {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.7) 100%);
  pointer-events: none;
}
.intro-overlay {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 0 24px 60px;
  text-align: center;
}
.intro-line {
  color: #f8f4ee;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(1.4rem, 3vw, 2rem);
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  margin-bottom: 22px;
  opacity: 0.95;
}
.intro-skip {
  color: #f8f4ee;
  border-color: rgba(255, 255, 255, 0.45);
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(6px);
}
`;
