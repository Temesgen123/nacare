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

const Badge = ({ label, color }) => {
  const colors = {
    blue: 'bg-primary-100 text-primary-700',
    red: 'bg-red-100 text-red-700',
    orange: 'bg-orange-100 text-orange-700',
    green: 'bg-green-100 text-green-700',
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

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
      {label}
    </p>
    <p className="text-sm text-gray-800">{value || '—'}</p>
  </div>
);

export default function ViewLabResultPage() {
  const router = useRouter();
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/lab-results/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setResult(data.labResult || data);
      } catch {
        toast.error('Failed to load lab result.');
        router.push('/dashboard/lab-results');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64 text-gray-400 text-sm">
        Loading lab result...
      </div>
    );
  }

  if (!result) return null;

  const tests = result.labTests || {};
  const testLabels = {
    fbs: 'FBS',
    rbs: 'RBS',
    cbc: 'CBC',
    lipidProfile: 'Lipid Profile',
    rft: 'RFT',
  };
  const activeTests = Object.entries(testLabels)
    .filter(([key]) => tests[key])
    .map(([, label]) => label);
  if (tests.other) activeTests.push(`Other: ${tests.other}`);

  const dr = result.doctorReview || {};

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => router.push('/dashboard/lab-results')}
            className="text-sm text-gray-400 hover:text-gray-600 mb-1 flex items-center gap-1"
          >
            ← Back to Lab Results
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Lab Result Detail
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Recorded {formatDate(result.createdAt)}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push(`/dashboard/lab-results/${id}/edit`)}
        >
          Edit
        </Button>
      </div>

      {/* Patient Info */}
      <div className="card">
        <h2 className="section-title">Patient</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Full Name" value={result.patientId?.fullName} />
          <Field label="Patient ID" value={result.patientId?.patientId} />
          <Field label="Phone" value={result.patientId?.phoneNumber} />
        </div>
        {result.visitId && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Field
              label="Linked Visit"
              value={
                result.visitId?.dateOfVisit
                  ? `Visit on ${formatDate(result.visitId.dateOfVisit)}`
                  : result.visitId?.toString()
              }
            />
          </div>
        )}
      </div>

      {/* Section 3A: Lab Information */}
      <div className="card">
        <h2 className="section-title">Section 3A: Laboratory Information</h2>

        <div className="mb-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            Tests Ordered
          </p>
          <div className="flex flex-wrap gap-2">
            {activeTests.length > 0 ? (
              activeTests.map((t) => <Badge key={t} label={t} color="blue" />)
            ) : (
              <span className="text-sm text-gray-400">None recorded</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Lab Partner" value={result.labPartnerName} />
          <Field
            label="Sample Collected"
            value={formatDate(result.dateSampleCollected)}
          />
          <Field
            label="Results Received"
            value={formatDate(result.dateResultsReceived)}
          />
        </div>
      </div>

      {/* Section 3B: Results Summary */}
      <div
        className={`card ${result.criticalValuesPresent ? 'border-2 border-red-200 bg-red-50' : ''}`}
      >
        <h2 className="section-title">Section 3B: Key Results Summary</h2>

        {result.criticalValuesPresent && (
          <div className="flex items-center gap-2 bg-red-100 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm font-medium">
            ⚠️ Critical values present — immediate doctor review required.
          </div>
        )}

        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
            Abnormal Results
          </p>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">
            {result.abnormalResults || 'No abnormal results recorded.'}
          </p>
        </div>
      </div>

      {/* Section 3C: Doctor Review */}
      <div className="card">
        <h2 className="section-title">Section 3C: Doctor Review</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Field label="Reviewing Doctor" value={dr.doctorName} />
          <div className="flex flex-wrap gap-2 items-center">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide w-full mb-1">
              Flags
            </p>
            {dr.referralRequired && (
              <Badge label="Referral Required" color="orange" />
            )}
            {dr.followUpPlanned && (
              <Badge label="Follow-up Planned" color="blue" />
            )}
            {!dr.referralRequired && !dr.followUpPlanned && (
              <Badge label="No follow-up needed" color="green" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Assessment
            </p>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">
              {dr.assessment || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Advice Given
            </p>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">
              {dr.adviceGiven || '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex justify-end gap-4">
        <Button
          variant="secondary"
          onClick={() => router.push('/dashboard/lab-results')}
        >
          Back to List
        </Button>
        <Button
          variant="primary"
          onClick={() => router.push(`/dashboard/lab-results/${id}/edit`)}
        >
          Edit This Record
        </Button>
      </div>
    </div>
  );
}
