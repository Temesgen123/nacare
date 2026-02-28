'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import s from '../home.module.css';
import NacareLogo from '../../components/NacareLogo';

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
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setError(error.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.root}>
      {/* ── NAV ── */}
      <nav className={s.nav}>
        <a className={s.navBrand} href="/">
          <NacareLogo size="small" showText={true} />
        </a>
        <div className={s.navLinks}>
          <Link href="/" className={s.btnNavGhost}>
            Home
          </Link>
          <Link href="/about" className={s.btnNavGhost}>
            About
          </Link>
          <Link href="/services" className={s.btnNavGhost}>
            Services
          </Link>
          <button
            className={s.btnNavPrimary}
            onClick={() => router.push('/appointment')}
          >
            Book Appointment
          </button>
        </div>
      </nav>

      {/* ── CONTACT HERO ── */}
      <section className={s.hero}>
        <div className={s.heroLeft}>
          <div className={s.heroEyebrow}>
            <span className={s.heroEyebrowDot} />
            Get In Touch
          </div>
          <h1 className={s.heroTitle}>Contact Nacare Health</h1>
          <p className={s.heroSubtitle}>
            Have questions? Need to book a service? Our team is here to help.
            Reach out to us and we&apos;ll respond as soon as possible.
          </p>
        </div>
        <div className={s.heroRight}>
          <div className={s.heroImageWrap} />
          <div className={s.heroImageOverlay} />
        </div>
      </section>

      {/* ── CONTACT INFO & FORM ── */}
      <section className={s.features}>
        <div
          style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}
        >
          <div className={s.contactGrid}>
            {/* Contact Information */}
            <div>
              <div className={s.sectionTag}>Contact Information</div>
              <h2 className={s.sectionTitle}>Reach Us</h2>

              <div style={{ marginTop: '2rem' }}>
                <div
                  className={s.featureCard}
                  style={{ marginBottom: '1.5rem' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'start',
                      gap: '1rem',
                    }}
                  >
                    <div
                      className={s.featureIcon}
                      style={{
                        width: '48px',
                        height: '48px',
                        minWidth: '48px',
                      }}
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className={s.featureTitle}>Phone</div>
                      <div className={s.featureDesc}>
                        +251 911 234 567
                        <br />
                        +251 911 234 568
                      </div>
                      <div
                        style={{
                          marginTop: '0.5rem',
                          fontSize: '0.875rem',
                          color: '#6b7280',
                        }}
                      >
                        Available 24/7
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={s.featureCard}
                  style={{ marginBottom: '1.5rem' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'start',
                      gap: '1rem',
                    }}
                  >
                    <div
                      className={s.featureIcon}
                      style={{
                        width: '48px',
                        height: '48px',
                        minWidth: '48px',
                      }}
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className={s.featureTitle}>Email</div>
                      <div className={s.featureDesc}>
                        info@nacarehealth.com
                        <br />
                        support@nacarehealth.com
                      </div>
                      <div
                        style={{
                          marginTop: '0.5rem',
                          fontSize: '0.875rem',
                          color: '#6b7280',
                        }}
                      >
                        We respond within 24 hours
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={s.featureCard}
                  style={{ marginBottom: '1.5rem' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'start',
                      gap: '1rem',
                    }}
                  >
                    <div
                      className={s.featureIcon}
                      style={{
                        width: '48px',
                        height: '48px',
                        minWidth: '48px',
                      }}
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className={s.featureTitle}>Office Location</div>
                      <div className={s.featureDesc}>
                        Bole Sub-City, Addis Ababa
                        <br />
                        Near Edna Mall, Ethiopia
                      </div>
                      <div
                        style={{
                          marginTop: '0.5rem',
                          fontSize: '0.875rem',
                          color: '#6b7280',
                        }}
                      >
                        Monday - Friday, 8 AM - 6 PM
                      </div>
                    </div>
                  </div>
                </div>

                <div className={s.featureCard}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'start',
                      gap: '1rem',
                    }}
                  >
                    <div
                      className={s.featureIcon}
                      style={{
                        width: '48px',
                        height: '48px',
                        minWidth: '48px',
                      }}
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className={s.featureTitle}>Emergency Line</div>
                      <div className={s.featureDesc}>
                        +251 911 999 999
                        <br />
                        For urgent medical assistance
                      </div>
                      <div
                        style={{
                          marginTop: '0.5rem',
                          fontSize: '0.875rem',
                          color: '#dc2626',
                          fontWeight: '500',
                        }}
                      >
                        24/7 Emergency Support
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className={s.sectionTag}>Send Us a Message</div>
              <h2 className={s.sectionTitle}>Get in Touch</h2>

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

              {error && (
                <div
                  style={{
                    background: '#fee2e2',
                    border: '1px solid #fca5a5',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    marginTop: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  <p style={{ color: '#991b1b', margin: 0 }}>⚠️ {error}</p>
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
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      resize: 'vertical',
                    }}
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1.5rem',
                    background: loading ? '#9ca3af' : '#5b3da1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.target.style.background = '#4c2f87';
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.target.style.background = '#5b3da1';
                  }}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section
        className={s.features}
        style={{ background: '#f9fafb', padding: '4rem 1rem' }}
      >
        <div className={s.featuresHeader}>
          <div className={s.sectionTag}>Common Questions</div>
          <h2 className={s.sectionTitle}>Frequently Asked Questions</h2>
        </div>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className={s.featureCard} style={{ marginBottom: '1rem' }}>
            <div className={s.featureTitle}>How do I book an appointment?</div>
            <div className={s.featureDesc}>
              You can book an appointment through our website by clicking the
              &quot;Book Appointment&quot; button, calling our hotline, or
              sending us a message through the contact form above.
            </div>
          </div>

          <div className={s.featureCard} style={{ marginBottom: '1rem' }}>
            <div className={s.featureTitle}>What areas do you serve?</div>
            <div className={s.featureDesc}>
              We currently provide home healthcare services throughout Addis
              Ababa and surrounding areas. Contact us to confirm if we serve
              your specific location.
            </div>
          </div>

          <div className={s.featureCard} style={{ marginBottom: '1rem' }}>
            <div className={s.featureTitle}>Do you accept insurance?</div>
            <div className={s.featureDesc}>
              Yes, we work with major insurance providers in Ethiopia. Please
              contact us with your insurance details to verify coverage.
            </div>
          </div>

          <div className={s.featureCard}>
            <div className={s.featureTitle}>
              What should I prepare for a home visit?
            </div>
            <div className={s.featureDesc}>
              Please have your medical history documents ready, a list of
              current medications, and ensure a clean, comfortable space for the
              examination. Our team will bring all necessary medical equipment.
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
        <NacareLogo size="small" showText={true} />
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
