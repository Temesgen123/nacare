'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Button from '../../../../components/ui/Button';

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
      {label}
    </p>
    <p className="text-sm text-gray-800">{value || '—'}</p>
  </div>
);

const Badge = ({ label, color }) => {
  const colors = {
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-primary-100 text-primary-700',
    gray: 'bg-gray-100 text-gray-600',
    yellow: 'bg-yellow-100 text-yellow-700',
  };
  return (
    <span
      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${colors[color] || colors.gray}`}
    >
      {label}
    </span>
  );
};

const BoolField = ({ label, value }) => (
  <div className="flex items-center gap-2">
    <span
      className={`w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 ${
        value ? 'bg-primary-600 border-primary-600' : 'border-gray-300'
      }`}
    >
      {value && (
        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
          <path
            d="M1.5 5l2.5 2.5 4.5-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
    <span className="text-sm text-gray-700">{label}</span>
  </div>
);

export default function ViewPatientPage() {
  const router = useRouter();
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setPatient(data.patient || data);
      } catch {
        toast.error('Failed to load patient.');
        router.push('/dashboard/patients');
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64 text-gray-400 text-sm">
        Loading patient...
      </div>
    );
  }

  if (!patient) return null;

  const pmh = patient.pastMedicalHistory || {};
  const mh = patient.medicationHistory || {};
  const sh = patient.socialHistory || {};
  const ec = patient.emergencyContact || {};

  const conditions = [
    { key: 'hypertension', label: 'Hypertension' },
    { key: 'diabetesMellitus', label: 'Diabetes Mellitus' },
    { key: 'heartDisease', label: 'Heart Disease' },
    { key: 'asthmaOrCOPD', label: 'Asthma / COPD' },
    { key: 'chronicKidneyDisease', label: 'Chronic Kidney Disease' },
  ];
  const activeConditions = conditions.filter(({ key }) => pmh[key]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <button
            onClick={() => router.push('/dashboard/patients')}
            className="text-sm text-gray-400 hover:text-gray-600 mb-1 flex items-center gap-1"
          >
            ← Back to Patients
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {patient.fullName}
          </h1>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
              {patient.patientId}
            </span>
            <span className="text-sm text-gray-400">
              Registered {formatDate(patient.createdAt)}
            </span>
            {patient.consentGiven ? (
              <Badge label="Consent Given" color="green" />
            ) : (
              <Badge label="No Consent" color="red" />
            )}
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="secondary"
            onClick={() =>
              router.push(`/dashboard/lab-results/new?patientId=${id}`)
            }
          >
            + Lab Result
          </Button>
          <Button
            variant="primary"
            onClick={() => router.push(`/dashboard/patients/${id}/edit`)}
          >
            Edit
          </Button>
        </div>
      </div>

      {/* Section 1A: Patient Identification */}
      <div className="card">
        <h2 className="section-title">Section 1A: Patient Identification</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          <Field label="Full Name" value={patient.fullName} />
          <Field label="Patient ID" value={patient.patientId} />
          <Field label="Sex" value={patient.sex} />
          <Field
            label="Date of Birth"
            value={formatDate(patient.dateOfBirth)}
          />
          <Field
            label="Age"
            value={patient.age ? `${patient.age} yrs` : null}
          />
          <Field label="Phone Number" value={patient.phoneNumber} />
        </div>

        {patient.address && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Field label="Address" value={patient.address} />
          </div>
        )}

        {(ec.name || ec.phone) && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Emergency Contact
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name" value={ec.name} />
              <Field label="Phone" value={ec.phone} />
            </div>
          </div>
        )}
      </div>

      {/* Section 1B: Past Medical History */}
      <div className="card">
        <h2 className="section-title">Section 1B: Past Medical History</h2>

        <div className="mb-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            Medical Conditions
          </p>
          {activeConditions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {activeConditions.map(({ label }) => (
                <Badge key={label} label={label} color="yellow" />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No conditions recorded</p>
          )}
        </div>

        {pmh.other && (
          <div className="mb-4">
            <Field label="Other Conditions" value={pmh.other} />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <Field label="Past Surgeries" value={patient.pastSurgeries} />
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Hospital Admission (Last 12 Months)
            </p>
            <Badge
              label={patient.hospitalAdmissionLast12Months ? 'Yes' : 'No'}
              color={patient.hospitalAdmissionLast12Months ? 'yellow' : 'gray'}
            />
          </div>
        </div>
      </div>

      {/* Section 1C: Medication History */}
      <div className="card">
        <h2 className="section-title">Section 1C: Medication History</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <Field label="Current Medications" value={mh.currentMedications} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Medication Adherence
            </p>
            {mh.adherence ? (
              <Badge
                label={mh.adherence}
                color={
                  mh.adherence === 'Good'
                    ? 'green'
                    : mh.adherence === 'Poor'
                      ? 'red'
                      : 'yellow'
                }
              />
            ) : (
              <span className="text-sm text-gray-400">—</span>
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Drug Allergy
            </p>
            <Badge
              label={mh.drugAllergy ? 'Yes' : 'No'}
              color={mh.drugAllergy ? 'red' : 'gray'}
            />
          </div>
          {mh.drugAllergy && mh.allergyDetails && (
            <div className="sm:col-span-2">
              <Field label="Allergy Details" value={mh.allergyDetails} />
            </div>
          )}
        </div>
      </div>

      {/* Section 1D: Social History */}
      <div className="card">
        <h2 className="section-title">Section 1D: Social History</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Lifestyle
            </p>
            <div className="space-y-2">
              <BoolField label="Smoking" value={sh.smoking} />
              <BoolField label="Alcohol Use" value={sh.alcoholUse} />
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Physical Activity Level
            </p>
            {sh.physicalActivityLevel ? (
              <Badge
                label={sh.physicalActivityLevel}
                color={
                  sh.physicalActivityLevel === 'High'
                    ? 'green'
                    : sh.physicalActivityLevel === 'Moderate'
                      ? 'blue'
                      : 'yellow'
                }
              />
            ) : (
              <span className="text-sm text-gray-400">—</span>
            )}
          </div>
        </div>
      </div>

      {/* Section 4: Consent */}
      <div
        className={`card border-2 ${patient.consentGiven ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
      >
        <h2 className="section-title">Section 4: Consent & Data Use</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Status
            </p>
            <Badge
              label={
                patient.consentGiven ? 'Consent Given' : 'Consent Not Given'
              }
              color={patient.consentGiven ? 'green' : 'red'}
            />
          </div>
          <Field label="Consent Date" value={formatDate(patient.consentDate)} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-4">
        <Button
          variant="secondary"
          onClick={() => router.push('/dashboard/patients')}
        >
          Back to List
        </Button>
        <Button
          variant="primary"
          onClick={() => router.push(`/dashboard/patients/${id}/edit`)}
        >
          Edit Patient
        </Button>
      </div>
    </div>
  );
}
