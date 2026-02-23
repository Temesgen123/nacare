'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import VisitForm from '../../../../../components/forms/VisitForm';

export default function EditVisitPage() {
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

  return (
    <div className="px-4 py-8">
      <div className="max-w-5xl mx-auto mb-6">
        <button
          onClick={() => router.push(`/dashboard/visits/${id}`)}
          className="text-sm text-gray-400 hover:text-gray-600 mb-1 flex items-center gap-1"
        >
          ← Back to View
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Visit</h1>
        <p className="text-sm text-gray-500 mt-1">
          <span className="font-medium text-gray-700">
            {visit.patientId?.fullName || 'Patient'}
          </span>
          <span className="text-gray-400 ml-2">
            ·{' '}
            {new Date(visit.dateOfVisit).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </p>
      </div>

      <VisitForm
        patientId={visit.patientId?._id || visit.patientId}
        initialData={visit}
      />
    </div>
  );
}
