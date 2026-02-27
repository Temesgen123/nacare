'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import s from '../home.module.css';
import NacareLogo from '../../components/NacareLogo';

export default function ServicesPage() {
  const router = useRouter();

  return (
    <div className={s.root}>
      {/* ── NAV ── */}
      <nav className={s.nav}>
        <a className={s.navBrand} href="/">
          <NacareLogo size="medium" showText={true} />
          {/* <div className={s.navLogo}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <span className={s.navName}>Nacare Health</span> */}
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
          {/* <button
            className={s.btnNavPrimary}
            onClick={() => router.push('/register')}
          >
            Get Started
          </button> */}
        </div>
      </nav>

      {/* ── SERVICES HERO ── */}
      <section className={s.hero}>
        <div className={s.heroLeft}>
          <div className={s.heroEyebrow}>
            <span className={s.heroEyebrowDot} />
            Our Services
          </div>
          <h1 className={s.heroTitle}>
            Comprehensive Home Healthcare Services
          </h1>
          <p className={s.heroSubtitle}>
            From routine checkups to specialized care, we bring professional
            medical services directly to your home in Addis Ababa.
          </p>
          <div className={s.heroCtas}>
            <button
              className={s.btnPrimary}
              onClick={() => router.push('/appointment')}
            >
              Book a Service
            </button>
          </div>
        </div>
        <div className={s.heroRight}>
          <div className={s.heroImageWrap} />
          <div className={s.heroImageOverlay} />
        </div>
      </section>

      {/* ── MAIN SERVICES ── */}
      <section className={s.features}>
        <div className={s.featuresHeader}>
          <div className={s.sectionTag}>Core Services</div>
          <h2 className={s.sectionTitle}>What We Offer</h2>
        </div>
        <div className={s.featuresGrid}>
          <div className={s.featureCard}>
            <div className={s.featureIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div className={s.featureTitle}>Home Medical Checkups</div>
            <div className={s.featureDesc}>
              Complete physical examinations in the comfort of your home. Our
              medical professionals conduct thorough assessments including vital
              signs, general examination, and system reviews. Perfect for
              routine health monitoring or pre-operative evaluations.
            </div>
          </div>

          <div className={s.featureCard}>
            <div className={s.featureIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <div className={s.featureTitle}>Laboratory Testing</div>
            <div className={s.featureDesc}>
              Professional sample collection at your home with results delivered
              digitally. We offer CBC, blood sugar tests (FBS/RBS), lipid
              profiles, renal function tests (RFT), and more. Partnered with
              certified labs for accurate results.
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
            <div className={s.featureTitle}>Chronic Care Management</div>
            <div className={s.featureDesc}>
              Ongoing support for patients with chronic conditions like
              diabetes, hypertension, heart disease, and kidney disease. Regular
              monitoring, medication management, and lifestyle guidance to help
              you manage your health effectively.
            </div>
          </div>
        </div>
      </section>

      {/* ── ADDITIONAL SERVICES ── */}
      <section
        className={s.features}
        style={{ background: '#f9fafb', padding: '4rem 1rem' }}
      >
        <div className={s.featuresHeader}>
          <div className={s.sectionTag}>Additional Services</div>
          <h2 className={s.sectionTitle}>Specialized Care</h2>
        </div>
        <div className={s.featuresGrid}>
          <div className={s.featureCard}>
            <div className={s.featureIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className={s.featureTitle}>Elderly Care</div>
            <div className={s.featureDesc}>
              Comprehensive healthcare for seniors including regular health
              monitoring, medication reminders, and assistance with daily health
              needs.
            </div>
          </div>

          <div className={s.featureCard}>
            <div className={s.featureIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className={s.featureTitle}>Medical Consultation</div>
            <div className={s.featureDesc}>
              Expert medical advice and second opinions. Our doctors review your
              test results and provide comprehensive assessments and treatment
              plans.
            </div>
          </div>

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
            <div className={s.featureTitle}>Post-Operative Care</div>
            <div className={s.featureDesc}>
              Recovery support and wound care for patients who have undergone
              surgery. Monitor healing progress and manage medications at home.
            </div>
          </div>

          <div className={s.featureCard}>
            <div className={s.featureIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className={s.featureTitle}>Health Screening</div>
            <div className={s.featureDesc}>
              Preventive health packages for early detection of common
              conditions. Includes vital signs check, blood tests, and risk
              assessments.
            </div>
          </div>

          <div className={s.featureCard}>
            <div className={s.featureIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className={s.featureTitle}>Emergency Guidance</div>
            <div className={s.featureDesc}>
              24/7 support hotline for health emergencies. Our team provides
              immediate guidance and coordinates with hospitals when necessary.
            </div>
          </div>

          <div className={s.featureCard}>
            <div className={s.featureIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div className={s.featureTitle}>Health Education</div>
            <div className={s.featureDesc}>
              Educational sessions on disease prevention, nutrition, exercise,
              and lifestyle modifications for better health outcomes.
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className={s.features}>
        <div className={s.featuresHeader}>
          <div className={s.sectionTag}>Simple Process</div>
          <h2 className={s.sectionTitle}>How It Works</h2>
        </div>
        <div className={s.featuresGrid}>
          <div className={s.featureCard}>
            <div className={s.featureIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className={s.featureTitle}>1. Book Appointment</div>
            <div className={s.featureDesc}>
              Choose your service and preferred time slot through our online
              booking system or call us directly.
            </div>
          </div>

          <div className={s.featureCard}>
            <div className={s.featureIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className={s.featureTitle}>2. Home Visit</div>
            <div className={s.featureDesc}>
              Our qualified healthcare professional arrives at your home at the
              scheduled time with all necessary equipment.
            </div>
          </div>

          <div className={s.featureCard}>
            <div className={s.featureIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className={s.featureTitle}>3. Get Results & Care Plan</div>
            <div className={s.featureDesc}>
              Receive your results digitally and get a personalized care plan
              from our doctors with follow-up recommendations.
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className={s.ctaBanner}>
        <div className={s.ctaTitle}>Ready to book a service?</div>
        <div className={s.ctaSub}>
          Experience professional healthcare in the comfort of your home.
        </div>
        <button
          className={s.btnCta}
          onClick={() => router.push('/appointment')}
        >
          Book Now
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer className={s.footer}>
        {/* <div className={s.footerBrand}>Nacare Health</div> */}
        <NacareLogo />
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
