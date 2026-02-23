'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import VisitForm from '../../../../components/forms/VisitForm';

function NewVisitContent() {
  const searchParams = useSearchParams();
  // Allows linking from a patient profile: /dashboard/visits/new?patientId=xxx
  const patientId = searchParams.get('patientId') || null;

  return (
    <div className="px-4 py-8">
      <div className="max-w-5xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Record New Visit</h1>
        <p className="text-sm text-gray-500 mt-1">
          Fill in all relevant sections. Fields marked as required must be
          completed.
        </p>
      </div>
      <VisitForm patientId={patientId} />
    </div>
  );
}

export default function NewVisitPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-gray-400 text-sm">Loading form...</div>
      }
    >
      <NewVisitContent />
    </Suspense>
  );
}
