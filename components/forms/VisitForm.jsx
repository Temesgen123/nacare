'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';

export default function VisitForm({ patientId, initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    // Patient reference
    patientId: patientId || initialData?.patientId || '',

    // Section 2A: Visit Details
    dateOfVisit: initialData?.dateOfVisit
      ? new Date(initialData.dateOfVisit).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    visitedBy: initialData?.visitedBy || '',

    // Section 2B: Vital Signs
    bloodPressure: initialData?.vitalSigns?.bloodPressure || '',
    pulseRate: initialData?.vitalSigns?.pulseRate || '',
    randomBloodSugar: initialData?.vitalSigns?.randomBloodSugar || '',
    weight: initialData?.vitalSigns?.weight || '',

    // Section 2C: General Examination
    generalAppearance: initialData?.generalExamination?.generalAppearance || '',
    pallor: initialData?.generalExamination?.pallor || false,
    edema: initialData?.generalExamination?.edema || false,

    // Section 2D: System Review
    cardiovascularSystem: initialData?.systemReview?.cardiovascularSystem || '',
    respiratorySystem: initialData?.systemReview?.respiratorySystem || '',
    abdomen: initialData?.systemReview?.abdomen || '',
    cns: initialData?.systemReview?.cns || '',
    abnormalFindings: initialData?.systemReview?.abnormalFindings || '',
  });

  // Fetch patients list if no patientId provided
  useEffect(() => {
    if (!patientId) {
      fetchPatients();
    }
  }, [patientId]);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/patients', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPatients(data.patients || []);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

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
    if (!formData.patientId || !formData.dateOfVisit || !formData.visitedBy) {
      toast.error(
        'Please fill in all required fields (Patient, Date of Visit, Visited By)',
      );
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API
      const visitData = {
        patientId: formData.patientId,
        dateOfVisit: formData.dateOfVisit,
        visitedBy: formData.visitedBy,
        vitalSigns: {
          bloodPressure: formData.bloodPressure,
          pulseRate: formData.pulseRate ? parseFloat(formData.pulseRate) : null,
          randomBloodSugar: formData.randomBloodSugar
            ? parseFloat(formData.randomBloodSugar)
            : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
        },
        generalExamination: {
          generalAppearance: formData.generalAppearance,
          pallor: formData.pallor,
          edema: formData.edema,
        },
        systemReview: {
          cardiovascularSystem: formData.cardiovascularSystem,
          respiratorySystem: formData.respiratorySystem,
          abdomen: formData.abdomen,
          cns: formData.cns,
          abnormalFindings: formData.abnormalFindings,
        },
      };

      const token = localStorage.getItem('token');
      const url = initialData
        ? `/api/visits/${initialData._id}`
        : '/api/visits';

      const method = initialData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(visitData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save visit');
      }

      toast.success(
        initialData
          ? 'Visit updated successfully!'
          : 'Visit recorded successfully!',
      );
      router.push('/dashboard/visits');
    } catch (error) {
      console.error('Error saving visit:', error);
      toast.error(error.message || 'Failed to save visit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Check if any system is abnormal
  const hasAbnormalFindings =
    formData.cardiovascularSystem === 'Abnormal' ||
    formData.respiratorySystem === 'Abnormal' ||
    formData.abdomen === 'Abnormal' ||
    formData.cns === 'Abnormal';

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
      {/* Patient Selection */}
      {!patientId && (
        <div className="card">
          <h2 className="section-title">Select Patient</h2>
          <Select
            label="Patient"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
            options={[
              { value: '', label: 'Select a patient...' },
              ...patients.map((patient) => ({
                value: patient._id,
                label: `${patient.fullName} - ${patient.patientId}`,
              })),
            ]}
          />
        </div>
      )}

      {/* SECTION 2A: Visit Details */}
      <div className="card">
        <h2 className="section-title">Section 2A: Visit Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Date of Visit"
            name="dateOfVisit"
            type="date"
            value={formData.dateOfVisit}
            onChange={handleChange}
            required
          />

          <Input
            label="Visited By (Nurse/Phlebotomist Name)"
            name="visitedBy"
            value={formData.visitedBy}
            onChange={handleChange}
            required
            placeholder="Enter nurse or phlebotomist name"
          />
        </div>
      </div>

      {/* SECTION 2B: Vital Signs */}
      <div className="card">
        <h2 className="section-title">Section 2B: Vital Signs</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Blood Pressure (mmHg)"
            name="bloodPressure"
            value={formData.bloodPressure}
            onChange={handleChange}
            placeholder="e.g., 140/90"
          />

          <Input
            label="Pulse Rate (/min)"
            name="pulseRate"
            type="number"
            value={formData.pulseRate}
            onChange={handleChange}
            placeholder="Enter pulse rate"
          />

          <Input
            label="Random Blood Sugar (mg/dl)"
            name="randomBloodSugar"
            type="number"
            value={formData.randomBloodSugar}
            onChange={handleChange}
            placeholder="Enter blood sugar level"
          />

          <Input
            label="Weight (kg) - Optional"
            name="weight"
            type="number"
            step="0.1"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Enter weight"
          />
        </div>
      </div>

      {/* SECTION 2C: General Examination */}
      <div className="card">
        <h2 className="section-title">Section 2C: General Examination</h2>

        <Select
          label="General Appearance"
          name="generalAppearance"
          value={formData.generalAppearance}
          onChange={handleChange}
          options={[
            { value: '', label: 'Select...' },
            { value: 'Well', label: 'Well' },
            { value: 'Ill', label: 'Ill' },
            { value: 'Distressed', label: 'Distressed' },
          ]}
        />

        <div className="space-y-3 mt-4">
          <Checkbox
            label="Pallor"
            name="pallor"
            checked={formData.pallor}
            onChange={handleChange}
          />
          <Checkbox
            label="Edema"
            name="edema"
            checked={formData.edema}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* SECTION 2D: System Review */}
      <div className="card">
        <h2 className="section-title">Section 2D: System Review</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Cardiovascular System"
            name="cardiovascularSystem"
            value={formData.cardiovascularSystem}
            onChange={handleChange}
            options={[
              { value: '', label: 'Select...' },
              { value: 'Normal', label: 'Normal' },
              { value: 'Abnormal', label: 'Abnormal' },
            ]}
          />

          <Select
            label="Respiratory System"
            name="respiratorySystem"
            value={formData.respiratorySystem}
            onChange={handleChange}
            options={[
              { value: '', label: 'Select...' },
              { value: 'Normal', label: 'Normal' },
              { value: 'Abnormal', label: 'Abnormal' },
            ]}
          />

          <Select
            label="Abdomen"
            name="abdomen"
            value={formData.abdomen}
            onChange={handleChange}
            options={[
              { value: '', label: 'Select...' },
              { value: 'Normal', label: 'Normal' },
              { value: 'Abnormal', label: 'Abnormal' },
            ]}
          />

          <Select
            label="Central Nervous System (CNS)"
            name="cns"
            value={formData.cns}
            onChange={handleChange}
            options={[
              { value: '', label: 'Select...' },
              { value: 'Normal', label: 'Normal' },
              { value: 'Abnormal', label: 'Abnormal' },
            ]}
          />
        </div>

        {hasAbnormalFindings && (
          <div className="mt-4">
            <Textarea
              label="Brief Note on Abnormal Findings (Optional)"
              name="abnormalFindings"
              value={formData.abnormalFindings}
              onChange={handleChange}
              rows={3}
              placeholder="Describe any abnormal findings..."
            />
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/dashboard/visits')}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading
            ? 'Saving...'
            : initialData
              ? 'Update Visit'
              : 'Record Visit'}
        </Button>
      </div>
    </form>
  );
}
