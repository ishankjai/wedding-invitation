import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiSend } from 'react-icons/fi';
import '../styles/rsvp.css';

gsap.registerPlugin(ScrollTrigger);

const INITIAL = {
  name: '',
  phone: '',
  guests: '1',
  attending: 'yes',
  message: ''
};

async function submitRSVP(payload) {
  const endpoint = import.meta.env.VITE_RSVP_ENDPOINT;
  if (!endpoint) {
    console.warn('[RSVP] VITE_RSVP_ENDPOINT not set — logging payload instead.', payload);
    return new Promise((resolve) => setTimeout(resolve, 400));
  }
  // Apps Script Web Apps don't return CORS headers, so we fire-and-forget with no-cors.
  // text/plain avoids a CORS preflight; Apps Script reads e.postData.contents.
  await fetch(endpoint, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  });
}

export default function RSVPSection() {
  const sectionRef = useRef(null);
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.rsvp-section .section-heading', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });

      gsap.from('.rsvp-card', {
        scrollTrigger: {
          trigger: '.rsvp-card',
          start: 'top 82%'
        },
        y: 60,
        opacity: 0,
        scale: 0.97,
        duration: 1,
        ease: 'power3.out'
      });

      gsap.from('.rsvp-field', {
        scrollTrigger: {
          trigger: '.rsvp-form',
          start: 'top 85%'
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out'
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setStatus('error');
      return;
    }
    setStatus('sending');
    try {
      await submitRSVP({ ...form, submittedAt: new Date().toISOString() });
      setStatus('done');
      setForm(INITIAL);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section className="section rsvp-section" ref={sectionRef}>
      <div className="section-inner">
        <div className="section-heading">
          <span className="eyebrow">Your Presence Matters</span>
          <h2 className="section-title">Kindly RSVP</h2>
          <div className="divider">✦</div>
          <p className="section-sub">
            Let us know you’ll be part of our forever — your blessings mean the world.
          </p>
        </div>

        <div className="rsvp-card">
          <form className="rsvp-form" onSubmit={onSubmit} noValidate>
            <div className="rsvp-field">
              <label htmlFor="rsvp-name">Full Name</label>
              <input
                id="rsvp-name"
                name="name"
                type="text"
                placeholder="Your beautiful name"
                value={form.name}
                onChange={onChange}
                autoComplete="name"
              />
            </div>

            <div className="rsvp-field">
              <label htmlFor="rsvp-phone">Phone Number</label>
              <input
                id="rsvp-phone"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={onChange}
                autoComplete="tel"
              />
            </div>

            <div className="rsvp-field">
              <label htmlFor="rsvp-guests">Number of Guests</label>
              <select
                id="rsvp-guests"
                name="guests"
                value={form.guests}
                onChange={onChange}
              >
                {['1', '2', '3', '4', '5', '6+'].map((n) => (
                  <option value={n} key={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="rsvp-field">
              <label htmlFor="rsvp-attending">Will You Attend?</label>
              <select
                id="rsvp-attending"
                name="attending"
                value={form.attending}
                onChange={onChange}
              >
                <option value="yes">Yes, with joy</option>
                <option value="no">Regretfully cannot</option>
                <option value="maybe">Trying my best</option>
              </select>
            </div>

            <div className="rsvp-field full">
              <label htmlFor="rsvp-message">A Message for the Couple</label>
              <textarea
                id="rsvp-message"
                name="message"
                placeholder="Send your love, blessings or a sweet note…"
                value={form.message}
                onChange={onChange}
              />
            </div>

            {status === 'error' && (
              <p className="rsvp-error">Please fill in your name & phone number.</p>
            )}
            {status === 'done' && (
              <p className="rsvp-success">
                Thank you! Your RSVP has been received with love. ✦
              </p>
            )}

            <div className="rsvp-submit-row">
              <button
                type="submit"
                className="btn"
                disabled={status === 'sending'}
              >
                <FiSend />
                {status === 'sending' ? 'Sending…' : 'Send RSVP'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
