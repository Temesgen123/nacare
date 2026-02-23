'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import LabResultForm from '../../../../../components/forms/LabResultForm';

export default function EditLabResultPage() {
  const router = useRouter();
  const { id } = useParams();
  const [labResult, setLabResult] = useState(null);
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
        setLabResult(data.labResult || data);
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

  if (!labResult) return null;

  return (
    <div className="px-4 py-8">
      <div className="max-w-5xl mx-auto mb-6">
        <button
          onClick={() => router.push(`/dashboard/lab-results/${id}`)}
          className="text-sm text-gray-400 hover:text-gray-600 mb-1 flex items-center gap-1"
        >
          ← Back to View
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Lab Result</h1>
        <p className="text-sm text-gray-500 mt-1">
          Patient:{' '}
          <span className="font-medium text-gray-700">
            {labResult.patientId?.fullName || 'Unknown'}
          </span>
          {labResult.patientId?.patientId && (
            <span className="text-gray-400">
              {' '}
              · {labResult.patientId.patientId}
            </span>
          )}
        </p>
      </div>

      <LabResultForm initialData={labResult} />
    </div>
  );
}
