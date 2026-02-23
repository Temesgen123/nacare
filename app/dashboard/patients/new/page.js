'use client';

// import PatientForm from '@/components/forms/PatientForm';
import PatientForm from '../../../../components/forms/PatientForm';

export default function NewPatientPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Register New Patient
        </h1>
        <p className="text-gray-600 mt-1">
          Complete all required sections to register a patient
        </p>
      </div>

      <PatientForm />
    </div>
  );
}
