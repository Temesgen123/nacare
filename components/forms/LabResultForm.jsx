'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';

export default function LabResultForm({
  patientId,
  visitId,
  initialData = null,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [visits, setVisits] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    // References
    patientId: patientId || initialData?.patientId || '',
    visitId: visitId || initialData?.visitId || '',

    // Section 3A: Laboratory Information
    labTestsFBS: initialData?.labTests?.fbs || false,
    labTestsRBS: initialData?.labTests?.rbs || false,
    labTestsCBC: initialData?.labTests?.cbc || false,
    labTestsLipidProfile: initialData?.labTests?.lipidProfile || false,
    labTestsRFT: initialData?.labTests?.rft || false,
    labTestsOther: initialData?.labTests?.other || '',
    labPartnerName: initialData?.labPartnerName || '',
    dateSampleCollected: initialData?.dateSampleCollected
      ? new Date(initialData.dateSampleCollected).toISOString().split('T')[0]
      : '',
    dateResultsReceived: initialData?.dateResultsReceived
      ? new Date(initialData.dateResultsReceived).toISOString().split('T')[0]
      : '',

    // Section 3B: Key Results Summary
    abnormalResults: initialData?.abnormalResults || '',
    criticalValuesPresent: initialData?.criticalValuesPresent || false,

    // Section 3C: Doctor Review
    assessment: initialData?.doctorReview?.assessment || '',
    adviceGiven: initialData?.doctorReview?.adviceGiven || '',
    referralRequired: initialData?.doctorReview?.referralRequired || false,
    followUpPlanned: initialData?.doctorReview?.followUpPlanned || false,
    doctorName: initialData?.doctorReview?.doctorName || '',
  });

  // Fetch patients and visits if no IDs provided
  useEffect(() => {
    if (!patientId) {
      fetchPatients();
    }
    if (!visitId && formData.patientId) {
      fetchVisits(formData.patientId);
    }
  }, [patientId, visitId, formData.patientId]);

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

  const fetchVisits = async (selectedPatientId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/visits?patientId=${selectedPatientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setVisits(data.visits || []);
      }
    } catch (error) {
      console.error('Error fetching visits:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // When patient changes, fetch their visits
    if (name === 'patientId' && value) {
      fetchVisits(value);
      setFormData((prev) => ({ ...prev, visitId: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.patientId) {
      toast.error('Please select a patient');
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API
      const labResultData = {
        patientId: formData.patientId,
        visitId: formData.visitId || null,
        labTests: {
          fbs: formData.labTestsFBS,
          rbs: formData.labTestsRBS,
          cbc: formData.labTestsCBC,
          lipidProfile: formData.labTestsLipidProfile,
          rft: formData.labTestsRFT,
          other: formData.labTestsOther,
        },
        labPartnerName: formData.labPartnerName,
        dateSampleCollected: formData.dateSampleCollected || null,
        dateResultsReceived: formData.dateResultsReceived || null,
        abnormalResults: formData.abnormalResults,
        criticalValuesPresent: formData.criticalValuesPresent,
        doctorReview: {
          assessment: formData.assessment,
          adviceGiven: formData.adviceGiven,
          referralRequired: formData.referralRequired,
          followUpPlanned: formData.followUpPlanned,
          doctorName: formData.doctorName,
        },
      };

      const token = localStorage.getItem('token');
      const url = initialData
        ? `/api/lab-results/${initialData._id}`
        : '/api/lab-results';

      const method = initialData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(labResultData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save lab results');
      }

      toast.success(
        initialData
          ? 'Lab results updated successfully!'
          : 'Lab results recorded successfully!',
      );
      router.push('/dashboard/lab-results');
    } catch (error) {
      console.error('Error saving lab results:', error);
      toast.error(
        error.message || 'Failed to save lab results. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
      {/* Patient & Visit Selection */}
      {!patientId && (
        <div className="card">
          <h2 className="section-title">Select Patient & Visit</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <Select
              label="Associated Visit (Optional)"
              name="visitId"
              value={formData.visitId}
              onChange={handleChange}
              disabled={!formData.patientId}
              options={[
                { value: '', label: 'Select a visit...' },
                ...visits.map((visit) => ({
                  value: visit._id,
                  label: `Visit on ${new Date(visit.dateOfVisit).toLocaleDateString()}`,
                })),
              ]}
            />
          </div>
        </div>
      )}

      {/* SECTION 3A: Laboratory Information */}
      <div className="card">
        <h2 className="section-title">Section 3A: Laboratory Information</h2>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Lab Tests Requested:
          </p>
          <div className="space-y-2">
            <Checkbox
              label="FBS (Fasting Blood Sugar)"
              name="labTestsFBS"
              checked={formData.labTestsFBS}
              onChange={handleChange}
            />
            <Checkbox
              label="RBS (Random Blood Sugar)"
              name="labTestsRBS"
              checked={formData.labTestsRBS}
              onChange={handleChange}
            />
            <Checkbox
              label="CBC (Complete Blood Count)"
              name="labTestsCBC"
              checked={formData.labTestsCBC}
              onChange={handleChange}
            />
            <Checkbox
              label="Lipid Profile"
              name="labTestsLipidProfile"
              checked={formData.labTestsLipidProfile}
              onChange={handleChange}
            />
            <Checkbox
              label="RFT (Renal Function Test)"
              name="labTestsRFT"
              checked={formData.labTestsRFT}
              onChange={handleChange}
            />
          </div>
        </div>

        <Input
          label="Other Lab Tests"
          name="labTestsOther"
          value={formData.labTestsOther}
          onChange={handleChange}
          placeholder="Specify other tests if any"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Input
            label="Lab Partner Name"
            name="labPartnerName"
            value={formData.labPartnerName}
            onChange={handleChange}
            placeholder="Enter lab partner name"
          />

          <Input
            label="Date Sample Collected"
            name="dateSampleCollected"
            type="date"
            value={formData.dateSampleCollected}
            onChange={handleChange}
          />

          <Input
            label="Date Results Received"
            name="dateResultsReceived"
            type="date"
            value={formData.dateResultsReceived}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* SECTION 3B: Key Results Summary */}
      <div className="card">
        <h2 className="section-title">Section 3B: Key Results Summary</h2>

        <Textarea
          label="Abnormal Results (Summary)"
          name="abnormalResults"
          value={formData.abnormalResults}
          onChange={handleChange}
          rows={4}
          placeholder="Summarize any abnormal lab results..."
        />

        <div className="mt-4">
          <Checkbox
            label="Critical Values Present?"
            name="criticalValuesPresent"
            checked={formData.criticalValuesPresent}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* SECTION 3C: Doctor Review */}
      <div className="card bg-blue-50 border-2 border-blue-200">
        <h2 className="section-title text-blue-900">
          Section 3C: Doctor Review
        </h2>

        <Textarea
          label="Assessment (Brief)"
          name="assessment"
          value={formData.assessment}
          onChange={handleChange}
          rows={3}
          placeholder="Doctor's assessment based on visit and lab results..."
        />

        <Textarea
          label="Advice Given"
          name="adviceGiven"
          value={formData.adviceGiven}
          onChange={handleChange}
          rows={3}
          placeholder="Medical advice and recommendations..."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-3">
            <Checkbox
              label="Referral Required?"
              name="referralRequired"
              checked={formData.referralRequired}
              onChange={handleChange}
            />
            <Checkbox
              label="Follow-up Planned?"
              name="followUpPlanned"
              checked={formData.followUpPlanned}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Doctor Name"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            placeholder="Enter doctor's name"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/dashboard/lab-results')}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading
            ? 'Saving...'
            : initialData
              ? 'Update Lab Results'
              : 'Record Lab Results'}
        </Button>
      </div>
    </form>
  );
}
