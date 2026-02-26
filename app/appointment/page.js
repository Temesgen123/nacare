// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import s from '../home.module.css';

// export default function ContactPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     subject: '',
//     message: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [submitted, setSubmitted] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Simulate form submission
//     setTimeout(() => {
//       setLoading(false);
//       setSubmitted(true);
//       setFormData({
//         name: '',
//         email: '',
//         phone: '',
//         subject: '',
//         message: '',
//       });
//     }, 1000);
//   };

//   return (
//     <div className={s.root}>
//       {/* ── NAV ── */}
//       <nav className={s.nav}>
//         <a className={s.navBrand} href="/">
//           <div className={s.navLogo}>
//             <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//               />
//             </svg>
//           </div>
//           <span className={s.navName}>Nacare Health</span>
//         </a>
//         <div className={s.navLinks}>
//           <Link href="/" className={s.btnNavGhost}>
//             Home
//           </Link>
//           <button
//             className={s.btnNavGhost}
//             onClick={() => router.push('/login')}
//           >
//             Sign In
//           </button>
//           <button
//             className={s.btnNavPrimary}
//             onClick={() => router.push('/register')}
//           >
//             Get Started
//           </button>
//         </div>
//       </nav>

//       {/* ── CONTACT INFO & FORM ── */}
//       <section className={s.features}>
//         <div
//           style={{
//             maxWidth: '800px',
//             margin: '0 auto',
//             padding: '0 1rem',
//           }}
//         >
//           <div>
//             {/* Contact Form */}
//             <div className="mt-16 md:mt-0">
//               {/* <div className={s.sectionTag}>Send Us a Message</div> */}
//               <h2 className={s.sectionTitle}>Appointment Booking Form</h2>

//               {submitted && (
//                 <div
//                   style={{
//                     background: '#d1fae5',
//                     border: '1px solid #6ee7b7',
//                     borderRadius: '0.5rem',
//                     padding: '1rem',
//                     marginTop: '1rem',
//                     marginBottom: '1rem',
//                   }}
//                 >
//                   <p style={{ color: '#065f46', margin: 0 }}>
//                     ✓ Thank you for contacting us! We&apos;ll get back to you
//                     soon.
//                   </p>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
//                 <div style={{ marginBottom: '1.25rem' }}>
//                   <label
//                     style={{
//                       display: 'block',
//                       fontSize: '0.875rem',
//                       fontWeight: '600',
//                       marginBottom: '0.5rem',
//                       color: '#374151',
//                     }}
//                   >
//                     Full Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                     style={{
//                       width: '100%',
//                       padding: '0.75rem',
//                       border: '1px solid #d1d5db',
//                       borderRadius: '0.5rem',
//                       fontSize: '1rem',
//                     }}
//                     placeholder="Enter your full name"
//                   />
//                 </div>

//                 <div style={{ marginBottom: '1.25rem' }}>
//                   <label
//                     style={{
//                       display: 'block',
//                       fontSize: '0.875rem',
//                       fontWeight: '600',
//                       marginBottom: '0.5rem',
//                       color: '#374151',
//                     }}
//                   >
//                     Email *
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     style={{
//                       width: '100%',
//                       padding: '0.75rem',
//                       border: '1px solid #d1d5db',
//                       borderRadius: '0.5rem',
//                       fontSize: '1rem',
//                     }}
//                     placeholder="your.email@example.com"
//                   />
//                 </div>

//                 <div style={{ marginBottom: '1.25rem' }}>
//                   <label
//                     style={{
//                       display: 'block',
//                       fontSize: '0.875rem',
//                       fontWeight: '600',
//                       marginBottom: '0.5rem',
//                       color: '#374151',
//                     }}
//                   >
//                     Phone Number
//                   </label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     style={{
//                       width: '100%',
//                       padding: '0.75rem',
//                       border: '1px solid #d1d5db',
//                       borderRadius: '0.5rem',
//                       fontSize: '1rem',
//                     }}
//                     placeholder="+251 911 234 567"
//                   />
//                 </div>

//                 <div style={{ marginBottom: '1.25rem' }}>
//                   <label
//                     style={{
//                       display: 'block',
//                       fontSize: '0.875rem',
//                       fontWeight: '600',
//                       marginBottom: '0.5rem',
//                       color: '#374151',
//                     }}
//                   >
//                     Subject *
//                   </label>
//                   <input
//                     type="text"
//                     name="subject"
//                     value={formData.subject}
//                     onChange={handleChange}
//                     required
//                     style={{
//                       width: '100%',
//                       padding: '0.75rem',
//                       border: '1px solid #d1d5db',
//                       borderRadius: '0.5rem',
//                       fontSize: '1rem',
//                     }}
//                     placeholder="What is this regarding?"
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   style={{
//                     width: '100%',
//                     padding: '0.875rem 1.5rem',
//                     background: loading ? '#9ca3af' : '#2563eb',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '0.5rem',
//                     fontSize: '1rem',
//                     fontWeight: '600',
//                     cursor: loading ? 'not-allowed' : 'pointer',
//                   }}
//                 >
//                   {loading ? 'Sending...' : 'Submit'}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── CTA BANNER ── */}
//       <section className={s.ctaBanner}>
//         <div className={s.ctaTitle}>Ready to book your appointment?</div>
//         <div className={s.ctaSub}>Experience quality healthcare at home.</div>
//         <button
//           className={s.btnCta}
//           onClick={() => router.push('/appointment')}
//         >
//           Book Now
//         </button>
//       </section>

//       {/* ── FOOTER ── */}
//       <footer className={s.footer}>
//         <div className={s.footerBrand}>Nacare Health</div>
//         <div className={s.footerLinks}>
//           <Link href="/">Home</Link>
//           <Link href="/about">About</Link>
//           <Link href="/services">Services</Link>
//           <Link href="/contact">Contact</Link>
//         </div>
//         <div className={s.footerCopy}>
//           &copy; {new Date().getFullYear()} Nacare Health. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// }
//
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import s from '../home.module.css';

export default function AppointmentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    appointmentType: 'Home Medical Checkup',
    preferredDate: '',
    preferredTime: '',
    subCity: '',
    landmark: '',
    specificAddress: '',
    reasonForVisit: '',
    medicalHistory: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          appointmentType: formData.appointmentType,
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
          address: {
            subCity: formData.subCity,
            landmark: formData.landmark,
            specificAddress: formData.specificAddress,
          },
          reasonForVisit: formData.reasonForVisit,
          medicalHistory: formData.medicalHistory,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book appointment');
      }

      setConfirmationCode(data.booking.confirmationCode);
      setSubmitted(true);

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        appointmentType: 'Home Medical Checkup',
        preferredDate: '',
        preferredTime: '',
        subCity: '',
        landmark: '',
        specificAddress: '',
        reasonForVisit: '',
        medicalHistory: '',
      });
    } catch (error) {
      console.error('Error booking appointment:', error);
      setError(
        error.message || 'Failed to book appointment. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
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

      {/* ── APPOINTMENT FORM ── */}
      <section className={s.features}>
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '0 1rem',
          }}
        >
          <div>
            <div className={s.sectionTag}>Book Your Appointment</div>
            <h2 className={s.sectionTitle}>
              Schedule Your Home Healthcare Visit
            </h2>
            <p
              style={{
                textAlign: 'center',
                color: '#6b7280',
                marginBottom: '2rem',
              }}
            >
              Fill out the form below and we&apos;ll contact you to confirm your
              appointment.
            </p>

            {submitted && (
              <div
                style={{
                  background: '#d1fae5',
                  border: '1px solid #6ee7b7',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  marginBottom: '2rem',
                }}
              >
                <h3
                  style={{
                    color: '#065f46',
                    margin: '0 0 0.5rem 0',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                  }}
                >
                  ✓ Appointment Booked Successfully!
                </h3>
                <p style={{ color: '#065f46', margin: '0.5rem 0' }}>
                  Your confirmation code is:{' '}
                  <strong style={{ fontSize: '1.25rem' }}>
                    {confirmationCode}
                  </strong>
                </p>
                <p style={{ color: '#065f46', margin: '0.5rem 0 0 0' }}>
                  We&apos;ve sent a confirmation email to {formData.email}. Our
                  team will contact you shortly to confirm the appointment
                  details.
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
                  marginBottom: '1rem',
                }}
              >
                <p style={{ color: '#991b1b', margin: 0 }}>⚠️ {error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              {/* Personal Information */}
              <div style={{ marginBottom: '2rem' }}>
                <h3
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    color: '#1f2937',
                  }}
                >
                  Personal Information
                </h3>

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
                    name="fullName"
                    value={formData.fullName}
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

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                  }}
                >
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
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
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
                </div>
              </div>

              {/* Appointment Details */}
              <div style={{ marginBottom: '2rem' }}>
                <h3
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    color: '#1f2937',
                  }}
                >
                  Appointment Details
                </h3>

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
                    Service Type *
                  </label>
                  <select
                    name="appointmentType"
                    value={formData.appointmentType}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      backgroundColor: 'white',
                    }}
                  >
                    <option value="Home Medical Checkup">
                      Home Medical Checkup
                    </option>
                    <option value="Lab Test">Lab Test</option>
                    <option value="Chronic Care">
                      Chronic Care Management
                    </option>
                    <option value="Consultation">Medical Consultation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                  }}
                >
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
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      min={getMinDate()}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                      }}
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
                      Preferred Time *
                    </label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        backgroundColor: 'white',
                      }}
                    >
                      <option value="">Select time slot...</option>
                      <option value="Morning (8AM-12PM)">
                        Morning (8AM-12PM)
                      </option>
                      <option value="Afternoon (12PM-4PM)">
                        Afternoon (12PM-4PM)
                      </option>
                      <option value="Evening (4PM-8PM)">
                        Evening (4PM-8PM)
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div style={{ marginBottom: '2rem' }}>
                <h3
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    color: '#1f2937',
                  }}
                >
                  Address Information
                </h3>

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
                    Sub-City
                  </label>
                  <input
                    type="text"
                    name="subCity"
                    value={formData.subCity}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                    }}
                    placeholder="e.g., Bole, Kirkos, Yeka"
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
                    Landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                    }}
                    placeholder="e.g., Near Edna Mall, Behind Mexican Embassy"
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
                    Specific Address
                  </label>
                  <textarea
                    name="specificAddress"
                    value={formData.specificAddress}
                    onChange={handleChange}
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      resize: 'vertical',
                    }}
                    placeholder="House/building number, floor, additional directions..."
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div style={{ marginBottom: '2rem' }}>
                <h3
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    color: '#1f2937',
                  }}
                >
                  Additional Information
                </h3>

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
                    Reason for Visit
                  </label>
                  <textarea
                    name="reasonForVisit"
                    value={formData.reasonForVisit}
                    onChange={handleChange}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      resize: 'vertical',
                    }}
                    placeholder="Briefly describe your health concerns or the purpose of this visit..."
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
                    Medical History (Optional)
                  </label>
                  <textarea
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleChange}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      resize: 'vertical',
                    }}
                    placeholder="Any chronic conditions, allergies, current medications, or relevant medical history..."
                  />
                </div>
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
                  transition: 'background-color 0.2s',
                }}
              >
                {loading ? 'Booking Appointment...' : 'Book Appointment'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── INFO SECTION ── */}
      <section
        className={s.features}
        style={{ background: '#f9fafb', padding: '4rem 1rem' }}
      >
        <div className={s.featuresHeader}>
          <div className={s.sectionTag}>What to Expect</div>
          <h2 className={s.sectionTitle}>After You Book</h2>
        </div>
        <div className={s.featuresGrid}>
          <div className={s.featureCard}>
            <div className={s.featureIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className={s.featureTitle}>1. Confirmation</div>
            <div className={s.featureDesc}>
              You&apos;ll receive an email confirmation with your booking
              details and confirmation code.
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
            <div className={s.featureTitle}>2. Call Back</div>
            <div className={s.featureDesc}>
              Our team will call you within 24 hours to confirm your appointment
              and answer any questions.
            </div>
          </div>

          <div className={s.featureCard}>
            <div className={s.featureIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className={s.featureTitle}>3. Home Visit</div>
            <div className={s.featureDesc}>
              Our healthcare professional will arrive at your home at the
              scheduled time with all necessary equipment.
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className={s.ctaBanner}>
        <div className={s.ctaTitle}>Need help with your booking?</div>
        <div className={s.ctaSub}>Contact us anytime at +251 911 234 567</div>
        <button className={s.btnCta} onClick={() => router.push('/Contact')}>
          Contact Us
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer className={s.footer}>
        <div className={s.footerBrand}>Nacare Health</div>
        <div className={s.footerLinks}>
          <Link href="/">Home</Link>
          <Link href="/About">About</Link>
          <Link href="/Services">Services</Link>
          <Link href="/Contact">Contact</Link>
        </div>
        <div className={s.footerCopy}>
          &copy; {new Date().getFullYear()} Nacare Health. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
