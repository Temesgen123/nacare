'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';

export default function PatientForm({ initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Section 1A: Patient Identification
    patientId: initialData?.patientId || '',
    fullName: initialData?.fullName || '',
    sex: initialData?.sex || '',
    dateOfBirth: initialData?.dateOfBirth
      ? new Date(initialData.dateOfBirth).toISOString().split('T')[0]
      : '',
    age: initialData?.age || '',
    phoneNumber: initialData?.phoneNumber || '',
    address: initialData?.address || '',
    emergencyContactName: initialData?.emergencyContact?.name || '',
    emergencyContactPhone: initialData?.emergencyContact?.phone || '',

    // Section 1B: Past Medical History
    hypertension: initialData?.pastMedicalHistory?.hypertension || false,
    diabetesMellitus:
      initialData?.pastMedicalHistory?.diabetesMellitus || false,
    heartDisease: initialData?.pastMedicalHistory?.heartDisease || false,
    asthmaOrCOPD: initialData?.pastMedicalHistory?.asthmaOrCOPD || false,
    chronicKidneyDisease:
      initialData?.pastMedicalHistory?.chronicKidneyDisease || false,
    otherMedicalHistory: initialData?.pastMedicalHistory?.other || '',
    pastSurgeries: initialData?.pastSurgeries || '',
    hospitalAdmissionLast12Months:
      initialData?.hospitalAdmissionLast12Months || false,

    // Section 1C: Medication History
    currentMedications:
      initialData?.medicationHistory?.currentMedications || '',
    medicationAdherence: initialData?.medicationHistory?.adherence || '',
    drugAllergy: initialData?.medicationHistory?.drugAllergy || false,
    allergyDetails: initialData?.medicationHistory?.allergyDetails || '',

    // Section 1D: Social History
    smoking: initialData?.socialHistory?.smoking || false,
    alcoholUse: initialData?.socialHistory?.alcoholUse || false,
    physicalActivityLevel:
      initialData?.socialHistory?.physicalActivityLevel || '',

    // Section 4: Consent
    consentGiven: initialData?.consentGiven || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.patientId || !formData.fullName || !formData.phoneNumber) {
      toast.error(
        'Please fill in all required fields (Patient ID, Full Name, Phone Number)',
      );
      return;
    }

    if (!formData.consentGiven) {
      toast.error('Patient consent is required to proceed');
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API
      const patientData = {
        patientId: formData.patientId,
        fullName: formData.fullName,
        sex: formData.sex,
        dateOfBirth: formData.dateOfBirth || null,
        age: formData.age ? parseInt(formData.age) : null,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
        },
        pastMedicalHistory: {
          hypertension: formData.hypertension,
          diabetesMellitus: formData.diabetesMellitus,
          heartDisease: formData.heartDisease,
          asthmaOrCOPD: formData.asthmaOrCOPD,
          chronicKidneyDisease: formData.chronicKidneyDisease,
          other: formData.otherMedicalHistory,
        },
        pastSurgeries: formData.pastSurgeries,
        hospitalAdmissionLast12Months: formData.hospitalAdmissionLast12Months,
        medicationHistory: {
          currentMedications: formData.currentMedications,
          adherence: formData.medicationAdherence,
          drugAllergy: formData.drugAllergy,
          allergyDetails: formData.allergyDetails,
        },
        socialHistory: {
          smoking: formData.smoking,
          alcoholUse: formData.alcoholUse,
          physicalActivityLevel: formData.physicalActivityLevel,
        },
        consentGiven: formData.consentGiven,
      };

      const token = localStorage.getItem('token');
      const url = initialData
        ? `/api/patients/${initialData._id}`
        : '/api/patients';

      const method = initialData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(patientData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save patient');
      }

      toast.success(
        initialData
          ? 'Patient updated successfully!'
          : 'Patient registered successfully!',
      );
      router.push('/dashboard/patients');
    } catch (error) {
      console.error('Error saving patient:', error);
      toast.error(error.message || 'Failed to save patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
      {/* SECTION 1A: Patient Identification */}
      <div className="card">
        <h2 className="section-title">Section 1A: Patient Identification</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Patient ID"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
            placeholder="Entered by staff"
            disabled={!!initialData}
          />

          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder="Enter full name"
          />

          <Select
            label="Sex"
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            options={[
              { value: '', label: 'Select...' },
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
            ]}
          />

          <Input
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />

          <Input
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            placeholder="Enter age"
          />

          <Input
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            placeholder="Enter phone number"
          />
        </div>

        <Textarea
          label="Address (Sub-city + landmark)"
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          placeholder="Enter address with sub-city and landmark"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Emergency Contact Name"
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={handleChange}
            placeholder="Enter emergency contact name"
          />

          <Input
            label="Emergency Contact Phone"
            name="emergencyContactPhone"
            type="tel"
            value={formData.emergencyContactPhone}
            onChange={handleChange}
            placeholder="Enter emergency contact phone"
          />
        </div>
      </div>

      {/* SECTION 1B: Past Medical History */}
      <div className="card">
        <h2 className="section-title">Section 1B: Past Medical History</h2>

        <div className="space-y-2 mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Medical Conditions (select all that apply):
          </p>
          <Checkbox
            label="Hypertension"
            name="hypertension"
            checked={formData.hypertension}
            onChange={handleChange}
          />
          <Checkbox
            label="Diabetes Mellitus"
            name="diabetesMellitus"
            checked={formData.diabetesMellitus}
            onChange={handleChange}
          />
          <Checkbox
            label="Heart Disease"
            name="heartDisease"
            checked={formData.heartDisease}
            onChange={handleChange}
          />
          <Checkbox
            label="Asthma / COPD"
            name="asthmaOrCOPD"
            checked={formData.asthmaOrCOPD}
            onChange={handleChange}
          />
          <Checkbox
            label="Chronic Kidney Disease"
            name="chronicKidneyDisease"
            checked={formData.chronicKidneyDisease}
            onChange={handleChange}
          />
        </div>

        <Input
          label="Other Medical Conditions"
          name="otherMedicalHistory"
          value={formData.otherMedicalHistory}
          onChange={handleChange}
          placeholder="Specify other conditions"
        />

        <Input
          label="Past Surgeries"
          name="pastSurgeries"
          value={formData.pastSurgeries}
          onChange={handleChange}
          placeholder="List any past surgeries"
        />

        <div className="mt-4">
          <Checkbox
            label="Hospital admission in last 12 months?"
            name="hospitalAdmissionLast12Months"
            checked={formData.hospitalAdmissionLast12Months}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* SECTION 1C: Medication History */}
      <div className="card">
        <h2 className="section-title">Section 1C: Medication History</h2>

        <Textarea
          label="Current Medications (name + dose)"
          name="currentMedications"
          value={formData.currentMedications}
          onChange={handleChange}
          rows={3}
          placeholder="List current medications with dosages"
        />

        <Select
          label="Medication Adherence"
          name="medicationAdherence"
          value={formData.medicationAdherence}
          onChange={handleChange}
          options={[
            { value: '', label: 'Select...' },
            { value: 'Good', label: 'Good' },
            { value: 'Poor', label: 'Poor' },
            { value: 'Irregular', label: 'Irregular' },
          ]}
        />

        <div className="mb-4">
          <Checkbox
            label="Drug Allergy"
            name="drugAllergy"
            checked={formData.drugAllergy}
            onChange={handleChange}
          />
        </div>

        {formData.drugAllergy && (
          <Input
            label="Specify Allergy Details"
            name="allergyDetails"
            value={formData.allergyDetails}
            onChange={handleChange}
            placeholder="Describe drug allergies"
          />
        )}
      </div>

      {/* SECTION 1D: Social History */}
      <div className="card">
        <h2 className="section-title">Section 1D: Social History</h2>

        <div className="space-y-3 mb-4">
          <Checkbox
            label="Smoking"
            name="smoking"
            checked={formData.smoking}
            onChange={handleChange}
          />
          <Checkbox
            label="Alcohol Use"
            name="alcoholUse"
            checked={formData.alcoholUse}
            onChange={handleChange}
          />
        </div>

        <Select
          label="Physical Activity Level"
          name="physicalActivityLevel"
          value={formData.physicalActivityLevel}
          onChange={handleChange}
          options={[
            { value: '', label: 'Select...' },
            { value: 'Low', label: 'Low' },
            { value: 'Moderate', label: 'Moderate' },
            { value: 'High', label: 'High' },
          ]}
        />
      </div>

      {/* SECTION 4: Consent & Data Use */}
      <div className="card border-2 border-primary-200 bg-primary-50">
        <h2 className="section-title text-primary-900">
          Section 4: Consent & Data Use
        </h2>

        <div className="bg-white p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            I consent to home health check-up, sample collection, and secure
            storage of my medical data by Nacare for continuity of care. I
            understand this service does not replace hospital care.
          </p>
        </div>

        <Checkbox
          label="I Agree (Required)"
          name="consentGiven"
          checked={formData.consentGiven}
          onChange={handleChange}
        />

        {!formData.consentGiven && (
          <p className="text-red-500 text-sm mt-2">
            ⚠️ Patient consent is required to proceed with registration
          </p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/dashboard/patients')}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading || !formData.consentGiven}
        >
          {loading
            ? 'Saving...'
            : initialData
              ? 'Update Patient'
              : 'Register Patient'}
        </Button>
      </div>
    </form>
  );
}
