'use client';

import { useRouter } from 'next/navigation';
import s from './home.module.css';
import Link from 'next/link';

export default function HomePage() {
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

      {/* ── HERO ── */}
      <section className={s.hero}>
        <div className={s.heroLeft}>
          <div className={s.heroEyebrow}>
            <span className={s.heroEyebrowDot} />
            Home Healthcare Management
          </div>
          <h1 className={s.heroTitle}>
            Professional Home Medical Checkups in Addis Ababa
            {/* <br />
            <em>precisely managed</em> */}
          </h1>
          <p className={s.heroSubtitle}>
            {/* Nacare Health brings together patient records, visit tracking, and
            lab results into one seamless system — designed for the teams who
            deliver care at home. */}
            Doctor visits, lab testing, and chronic care delivered to your home.
          </p>
          <ul
            className={`${s.heroSubtitle} pl-12 md:pl-32 list-disc mt-3 mb-5 leading-normal`}
          >
            <li>Licenced Medical Professional.</li>
            <li>Confidential & Secure.</li>
            <li>Fast Response.</li>
            <li>Addis Ababa Coverage.</li>
          </ul>
          <div className={s.heroCtas}>
            <button
              className={s.btnPrimary}
              onClick={() => router.push('/appointment')}
            >
              Book Appointment
            </button>
            {/* <button
              className={s.btnPrimary}
              onClick={() => router.push('/register')}
            >
              Create an Account
            </button> */}
            {/* <button
              className={s.btnOutline}
              onClick={() => router.push('/login')}
            >
              Sign In
            </button> */}
          </div>
          <div className={s.heroStats}>
            <div>
              <div className={s.statNum}>360°</div>
              <div className={s.statLabel}>Patient View</div>
            </div>
            <div>
              <div className={s.statNum}>3</div>
              <div className={s.statLabel}>Modules</div>
            </div>
            <div>
              <div className={s.statNum}>100%</div>
              <div className={s.statLabel}>Secure</div>
            </div>
          </div>
        </div>
        <div className={s.heroRight}>
          <div className={s.heroImageWrap} />
          <div className={s.heroImageOverlay} />
          {/* <div className={s.heroCard}>
            <div className={s.heroCardIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className={s.heroCardTitle}>Patient Records</div>
            <div className={s.heroCardSub}>
              Full medical history at a glance
            </div>
          </div> */}
          {/* <div className={s.heroCard2}>
            <div className={s.heroCard2Title}>Lab Results</div>
            <div className={s.heroCard2Value}>CBC</div>
            <div className={s.heroCard2Sub}>Results received today</div>
          </div> */}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className={s.features}>
        <div className={s.featuresHeader}>
          <div className={s.sectionTag}>What we offer</div>
          <h2 className={s.sectionTitle}>
            Personalized treatment plans designed for your specific needs.
          </h2>
        </div>
        <div className={s.featuresGrid}>
          {[
            {
              title: 'About',
              desc: 'Nacare Health is dedicated to providing professional home medical services in Addis Ababa. We combine modern healthcare technology with compassionate care to serve patients in the comfort of their homes...',
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              ),
            },
            {
              title: 'Services',
              desc: 'Comprehensive Home Healthcare Services. From routine checkups to specialized care, we bring professional medical services directly to your home in Addis Ababa...',
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              ),
            },
            {
              title: 'Contact',
              desc: 'Nacare Health  |  Address: Addisu Michael, Addis Ababa   | Phone : +251 911 234 567   |   E-mail : support@nacare.com ...',
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              ),
            },
          ].map((f) => (
            <div className={s.featureCard} key={f.title}>
              <div className={s.featureIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {f.icon}
                </svg>
              </div>
              <div className={s.featureTitle}>
                <Link href={`/${f.title.toLocaleLowerCase()}`}>{f.title}</Link>
              </div>
              <div className={s.featureDesc}>
                <Link href={`/${f.title.toLocaleLowerCase()}`}>
                  {f.desc}
                  <h2 className="font-bold pt-4 px-auto">Read more &gt; </h2>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className={s.ctaBanner}>
        <div className={s.ctaTitle}>Ready to get started?</div>
        <div className={s.ctaSub}>
          Join Nacare Health&apos;s management system today.
        </div>
        <button className={s.btnCta} onClick={() => router.push('/register')}>
          Create Your Account
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer className={s.footer}>
        <div className={s.footerBrand}>Nacare Health</div>
        <div className={s.footerCopy}>
          &copy; {new Date().getFullYear()} Nacare Health. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
