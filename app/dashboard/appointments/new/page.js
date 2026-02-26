//  app/dashboard/appointments/new/page.jsx
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import AppointmentForm from '../../../../components/forms/AppointmentForm';
function NewAppointmentContent() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patientId') || null;
  return (
    <div className="px-4 py-8">
      {/* <div className="max-w-5xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Schedule Appointment
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Select an existing patient or enter walk-in details to schedule a new
          appointment.
        </p>
      </div>
      <AppointmentForm preselectedPatientId={patientId} /> */}
      Under construction!
    </div>
  );
}

export default function NewAppointmentPage() {
  return (
    <Suspense
      fallback={<div className="p-8 text-gray-400 text-sm">Loading...</div>}
    >
      <NewAppointmentContent />
    </Suspense>
  );
}
