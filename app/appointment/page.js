'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import s from '../home.module.css';

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }, 1000);
  };

  return (
    <div className={s.root}>
      {/* ── NAV ── */}
      <nav className={s.nav}>
        <a className={s.navBrand} href="/">
          <div className={s.navLogo}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <span className={s.navName}>Nacare Health</span>
        </a>
        <div className={s.navLinks}>
          <Link href="/" className={s.btnNavGhost}>
            Home
          </Link>
          <button
            className={s.btnNavGhost}
            onClick={() => router.push('/login')}
          >
            Sign In
          </button>
          <button
            className={s.btnNavPrimary}
            onClick={() => router.push('/register')}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ── CONTACT INFO & FORM ── */}
      <section className={s.features}>
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '0 1rem',
          }}
        >
          <div>
            {/* Contact Form */}
            <div className="mt-16 md:mt-0">
              {/* <div className={s.sectionTag}>Send Us a Message</div> */}
              <h2 className={s.sectionTitle}>Appointment Booking Form</h2>

              {submitted && (
                <div
                  style={{
                    background: '#d1fae5',
                    border: '1px solid #6ee7b7',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    marginTop: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  <p style={{ color: '#065f46', margin: 0 }}>
                    ✓ Thank you for contacting us! We&apos;ll get back to you
                    soon.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#374151',
                    }}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                    }}
                    placeholder="Enter your full name"
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#374151',
                    }}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                    }}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#374151',
                    }}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                    }}
                    placeholder="+251 911 234 567"
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#374151',
                    }}
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                    }}
                    placeholder="What is this regarding?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1.5rem',
                    background: loading ? '#9ca3af' : '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Sending...' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className={s.ctaBanner}>
        <div className={s.ctaTitle}>Ready to book your appointment?</div>
        <div className={s.ctaSub}>Experience quality healthcare at home.</div>
        <button
          className={s.btnCta}
          onClick={() => router.push('/appointment')}
        >
          Book Now
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer className={s.footer}>
        <div className={s.footerBrand}>Nacare Health</div>
        <div className={s.footerLinks}>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className={s.footerCopy}>
          &copy; {new Date().getFullYear()} Nacare Health. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
