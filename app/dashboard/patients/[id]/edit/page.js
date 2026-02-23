'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import PatientForm from '../../../../../components/forms/PatientForm';

export default function EditPatientPage() {
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

  return (
    <div className="px-4 py-8">
      <div className="max-w-5xl mx-auto mb-6">
        <button
          onClick={() => router.push(`/dashboard/patients/${id}`)}
          className="text-sm text-gray-400 hover:text-gray-600 mb-1 flex items-center gap-1"
        >
          ← Back to View
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Patient</h1>
        <p className="text-sm text-gray-500 mt-1">
          <span className="font-medium text-gray-700">{patient.fullName}</span>
          <span className="text-gray-400 ml-2">· {patient.patientId}</span>
        </p>
      </div>

      <PatientForm initialData={patient} />
    </div>
  );
}
