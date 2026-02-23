//  app/dashboard/appointments/[id]/edit/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import AppointmentForm from '../../../../../components/forms/AppointmentForm';

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

export default function EditAppointmentPage() {
  const router = useRouter();
  const { id } = useParams();
  const [appt, setAppt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/appointments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setAppt(data.appointment || data);
      } catch {
        toast.error('Failed to load appointment.');
        router.push('/dashboard/appointments');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-64 text-gray-400 text-sm">
        Loading appointment...
      </div>
    );
  if (!appt) return null;

  const patientName =
    appt.patientId?.fullName || appt.walkInPatient?.fullName || 'Patient';

  return (
    <div className="px-4 py-8">
      <div className="max-w-5xl mx-auto mb-6">
        <button
          onClick={() => router.push(`/dashboard/appointments/${id}`)}
          className="text-sm text-gray-400 hover:text-gray-600 mb-1 flex items-center gap-1"
        >
          ← Back to View
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Appointment</h1>
        <p className="text-sm text-gray-500 mt-1">
          <span className="font-medium text-gray-700">{patientName}</span>
          <span className="text-gray-400 ml-2">
            · {formatDate(appt.appointmentDate)} at {appt.appointmentTime}
          </span>
        </p>
      </div>
      <AppointmentForm initialData={appt} />
    </div>
  );
}
