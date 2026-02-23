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
    yellow: 'bg-yellow-100 text-yellow-700',
    orange: 'bg-orange-100 text-orange-700',
    blue: 'bg-primary-100 text-primary-700',
    gray: 'bg-gray-100 text-gray-600',
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

const SystemRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-600">{label}</span>
    {value ? (
      <Badge label={value} color={value === 'Normal' ? 'green' : 'red'} />
    ) : (
      <span className="text-sm text-gray-300">—</span>
    )}
  </div>
);

export default function ViewVisitPage() {
  const router = useRouter();
  const { id } = useParams();
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchVisit = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/visits/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setVisit(data.visit || data);
      } catch {
        toast.error('Failed to load visit.');
        router.push('/dashboard/visits');
      } finally {
        setLoading(false);
      }
    };
    fetchVisit();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64 text-gray-400 text-sm">
        Loading visit...
      </div>
    );
  }

  if (!visit) return null;

  const vs = visit.vitalSigns || {};
  const ge = visit.generalExamination || {};
  const sr = visit.systemReview || {};

  const hasAbnormal =
    sr.cardiovascularSystem === 'Abnormal' ||
    sr.respiratorySystem === 'Abnormal' ||
    sr.abdomen === 'Abnormal' ||
    sr.cns === 'Abnormal';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <button
            onClick={() => router.push('/dashboard/visits')}
            className="text-sm text-gray-400 hover:text-gray-600 mb-1 flex items-center gap-1"
          >
            ← Back to Visits
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Visit Detail</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Recorded {formatDate(visit.createdAt)}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push(`/dashboard/visits/${id}/edit`)}
        >
          Edit
        </Button>
      </div>

      {/* Patient Info */}
      <div className="card">
        <h2 className="section-title">Patient</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Full Name" value={visit.patientId?.fullName} />
          <Field label="Patient ID" value={visit.patientId?.patientId} />
          <Field label="Phone" value={visit.patientId?.phoneNumber} />
        </div>
      </div>

      {/* Section 2A: Visit Details */}
      <div className="card">
        <h2 className="section-title">Section 2A: Visit Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Date of Visit" value={formatDate(visit.dateOfVisit)} />
          <Field label="Visited By" value={visit.visitedBy} />
        </div>
      </div>

      {/* Section 2B: Vital Signs */}
      <div className="card">
        <h2 className="section-title">Section 2B: Vital Signs</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Blood Pressure
            </p>
            <p className="text-lg font-bold text-gray-900">
              {vs.bloodPressure || '—'}
            </p>
            {vs.bloodPressure && <p className="text-xs text-gray-400">mmHg</p>}
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Pulse Rate
            </p>
            <p className="text-lg font-bold text-gray-900">
              {vs.pulseRate ?? '—'}
            </p>
            {vs.pulseRate && <p className="text-xs text-gray-400">/min</p>}
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Blood Sugar
            </p>
            <p className="text-lg font-bold text-gray-900">
              {vs.randomBloodSugar ?? '—'}
            </p>
            {vs.randomBloodSugar && (
              <p className="text-xs text-gray-400">mg/dl</p>
            )}
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Weight
            </p>
            <p className="text-lg font-bold text-gray-900">
              {vs.weight ?? '—'}
            </p>
            {vs.weight && <p className="text-xs text-gray-400">kg</p>}
          </div>
        </div>
      </div>

      {/* Section 2C: General Examination */}
      <div className="card">
        <h2 className="section-title">Section 2C: General Examination</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              General Appearance
            </p>
            {ge.generalAppearance ? (
              <Badge
                label={ge.generalAppearance}
                color={
                  ge.generalAppearance === 'Well'
                    ? 'green'
                    : ge.generalAppearance === 'Ill'
                      ? 'yellow'
                      : 'red'
                }
              />
            ) : (
              <span className="text-sm text-gray-400">—</span>
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Clinical Signs
            </p>
            <div className="space-y-2">
              <BoolField label="Pallor" value={ge.pallor} />
              <BoolField label="Edema" value={ge.edema} />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2D: System Review */}
      <div className={`card ${hasAbnormal ? 'border-2 border-red-200' : ''}`}>
        <h2 className="section-title">Section 2D: System Review</h2>

        {hasAbnormal && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm font-medium">
            ⚠️ One or more systems marked as abnormal.
          </div>
        )}

        <div className="rounded-lg border border-gray-100 overflow-hidden mb-4">
          <SystemRow
            label="Cardiovascular System"
            value={sr.cardiovascularSystem}
          />
          <SystemRow label="Respiratory System" value={sr.respiratorySystem} />
          <SystemRow label="Abdomen" value={sr.abdomen} />
          <SystemRow label="Central Nervous System (CNS)" value={sr.cns} />
        </div>

        {sr.abnormalFindings && (
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Abnormal Findings
            </p>
            <p className="text-sm text-gray-800 whitespace-pre-wrap bg-red-50 border border-red-100 rounded-lg p-3">
              {sr.abnormalFindings}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-4">
        <Button
          variant="secondary"
          onClick={() => router.push('/dashboard/visits')}
        >
          Back to List
        </Button>
        <Button
          variant="primary"
          onClick={() => router.push(`/dashboard/visits/${id}/edit`)}
        >
          Edit This Visit
        </Button>
      </div>
    </div>
  );
}
