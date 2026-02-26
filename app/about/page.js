'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import s from '../home.module.css';

export default function AboutPage() {
  const router = useRouter();

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

      {/* ── ABOUT HERO ── */}
      <section className={s.hero}>
        <div className={s.heroLeft}>
          <div className={s.heroEyebrow}>
            <span className={s.heroEyebrowDot} />
            About Nacare Health
          </div>
          <h1 className={s.heroTitle}>
            Bringing Quality Healthcare to Your Doorstep.
          </h1>
          <p className={s.heroSubtitle}>
            Nacare Health is dedicated to providing professional home medical
            services in Addis Ababa. We combine modern healthcare technology
            with compassionate care to serve patients in the comfort of their
            homes.
          </p>
        </div>
        <div className={s.heroRight}>
          <div className={s.heroImageWrap} />
          <div className={s.heroImageOverlay} />
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className={s.features}>
        <div className={s.featuresHeader}>
          <div className={s.sectionTag}>Our Purpose</div>
          <h2 className={s.sectionTitle}>Mission & Vision</h2>
        </div>
        <div className={s.featuresGrid}>
          <div className={s.featureCard}>
            <div className={s.featureIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div className={s.featureTitle}>Our Mission</div>
            <div className={s.featureDesc}>
              To provide accessible, high-quality home healthcare services that
              improve the well-being of our community. We strive to make
              professional medical care convenient and comfortable for every
              patient.
            </div>
          </div>

          <div className={s.featureCard}>
            <div className={s.featureIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <div className={s.featureTitle}>Our Vision</div>
            <div className={s.featureDesc}>
              To become the leading home healthcare provider in Ethiopia,
              setting the standard for patient-centered care and innovative
              health management solutions that serve communities nationwide.
            </div>
          </div>

          <div className={s.featureCard}>
            <div className={s.featureIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <div className={s.featureTitle}>Our Values</div>
            <div className={s.featureDesc}>
              Compassion, Excellence, Integrity, and Innovation guide everything
              we do. We treat every patient with respect and dignity while
              maintaining the highest standards of medical care.
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section
        className={s.features}
        style={{ background: '#f9fafb', padding: '4rem 1rem' }}
      >
        <div className={s.featuresHeader}>
          <div className={s.sectionTag}>Why Choose Us</div>
          <h2 className={s.sectionTitle}>What Sets Us Apart</h2>
        </div>
        <div className={s.featuresGrid}>
          <div className={s.featureCard}>
            <div className={s.featureIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div className={s.featureTitle}>Experienced Team</div>
            <div className={s.featureDesc}>
              Our healthcare professionals are licensed, experienced, and
              trained in home care best practices.
            </div>
          </div>

          <div className={s.featureCard}>
            <div className={s.featureIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className={s.featureTitle}>Convenient Scheduling</div>
            <div className={s.featureDesc}>
              Book appointments at times that work for you, including evenings
              and weekends.
            </div>
          </div>

          <div className={s.featureCard}>
            <div className={s.featureIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div className={s.featureTitle}>Quality Assurance</div>
            <div className={s.featureDesc}>
              We maintain strict quality standards and follow international
              healthcare protocols.
            </div>
          </div>

          <div className={s.featureCard}>
            <div className={s.featureIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <div className={s.featureTitle}>Comprehensive Services</div>
            <div className={s.featureDesc}>
              From routine checkups to chronic disease management, we offer
              complete home healthcare solutions.
            </div>
          </div>

          <div className={s.featureCard}>
            <div className={s.featureIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div className={s.featureTitle}>24/7 Support</div>
            <div className={s.featureDesc}>
              Our support team is available around the clock to address your
              questions and concerns.
            </div>
          </div>

          <div className={s.featureCard}>
            <div className={s.featureIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className={s.featureTitle}>Affordable Pricing</div>
            <div className={s.featureDesc}>
              Transparent pricing with no hidden fees. We believe quality
              healthcare should be accessible to everyone.
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className={s.ctaBanner}>
        <div className={s.ctaTitle}>
          Ready to experience quality home healthcare?
        </div>
        <div className={s.ctaSub}>
          Join hundreds of satisfied patients who trust Nacare Health.
        </div>
        <button
          className={s.btnCta}
          onClick={() => router.push('/appointment')}
        >
          Book Your First Appointment
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
