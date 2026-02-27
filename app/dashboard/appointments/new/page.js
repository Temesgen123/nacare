//  app/dashboard/appointments/new/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Textarea from '../../../../components/ui/Textarea';

export default function NewAppointmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [isWalkIn, setIsWalkIn] = useState(false);

  const [formData, setFormData] = useState({
    // Patient selection
    patientId: '',
    walkInFullName: '',
    walkInPhoneNumber: '',

    // Appointment details
    appointmentDate: '',
    appointmentTime: '',
    duration: '30',
    type: 'General Consultation',
    reason: '',

    // Assignment & Location
    assignedTo: '',
    location: 'Clinic',

    // Notes
    notes: '',
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/patients?limit=1000', {
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
    } finally {
      setLoadingPatients(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!isWalkIn && !formData.patientId) {
      toast.error('Please select a patient or use walk-in option');
      return;
    }

    if (isWalkIn && (!formData.walkInFullName || !formData.walkInPhoneNumber)) {
      toast.error('Please provide walk-in patient name and phone number');
      return;
    }

    if (!formData.appointmentDate || !formData.appointmentTime) {
      toast.error('Please provide appointment date and time');
      return;
    }

    // Validate date is not in the past
    const selectedDateTime = new Date(
      `${formData.appointmentDate}T${formData.appointmentTime}`,
    );
    const now = new Date();

    if (selectedDateTime < now) {
      toast.error('Appointment date and time cannot be in the past');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      const appointmentData = {
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        duration: parseInt(formData.duration),
        type: formData.type,
        reason: formData.reason,
        assignedTo: formData.assignedTo,
        location: formData.location,
        notes: formData.notes,
        createdBy: user?.username || 'system',
      };

      // Add patient reference or walk-in data
      if (isWalkIn) {
        appointmentData.walkInPatient = {
          fullName: formData.walkInFullName,
          phoneNumber: formData.walkInPhoneNumber,
        };
      } else {
        appointmentData.patientId = formData.patientId;
      }

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(appointmentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create appointment');
      }

      toast.success('Appointment created successfully!');
      router.push('/dashboard/appointments');
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error(error.message || 'Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get minimum time if today is selected
  const getMinTime = () => {
    if (formData.appointmentDate === getMinDate()) {
      const now = new Date();
      return now.toTimeString().slice(0, 5);
    }
    return '';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Appointment</h1>
        <p className="text-sm text-gray-500 mt-1">
          Schedule a new appointment for a patient
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Patient Selection Section */}
        <div className="card">
          <h2 className="section-title">Patient Information</h2>

          {/* Walk-in Toggle */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isWalkIn}
                onChange={(e) => {
                  setIsWalkIn(e.target.checked);
                  if (e.target.checked) {
                    setFormData((prev) => ({ ...prev, patientId: '' }));
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      walkInFullName: '',
                      walkInPhoneNumber: '',
                    }));
                  }
                }}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Walk-in Patient (not in system)
              </span>
            </label>
          </div>

          {isWalkIn ? (
            // Walk-in patient fields
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="walkInFullName"
                value={formData.walkInFullName}
                onChange={handleChange}
                required
                placeholder="Enter patient name"
              />
              <Input
                label="Phone Number"
                name="walkInPhoneNumber"
                type="tel"
                value={formData.walkInPhoneNumber}
                onChange={handleChange}
                required
                placeholder="+251 911 234 567"
              />
            </div>
          ) : (
            // Existing patient selection
            <Select
              label="Select Patient"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
              options={[
                {
                  value: '',
                  label: loadingPatients
                    ? 'Loading patients...'
                    : 'Select a patient...',
                },
                ...patients.map((patient) => ({
                  value: patient._id,
                  label: `${patient.fullName} - ${patient.patientId} (${patient.phoneNumber})`,
                })),
              ]}
            />
          )}
        </div>

        {/* Appointment Details Section */}
        <div className="card">
          <h2 className="section-title">Appointment Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Appointment Date"
              name="appointmentDate"
              type="date"
              value={formData.appointmentDate}
              onChange={handleChange}
              min={getMinDate()}
              required
            />

            <Input
              label="Appointment Time"
              name="appointmentTime"
              type="time"
              value={formData.appointmentTime}
              onChange={handleChange}
              min={getMinTime()}
              required
            />

            <Select
              label="Duration (minutes)"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              options={[
                { value: '15', label: '15 minutes' },
                { value: '30', label: '30 minutes' },
                { value: '45', label: '45 minutes' },
                { value: '60', label: '1 hour' },
                { value: '90', label: '1.5 hours' },
                { value: '120', label: '2 hours' },
              ]}
            />

            <Select
              label="Appointment Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              options={[
                {
                  value: 'General Consultation',
                  label: 'General Consultation',
                },
                { value: 'Follow-up', label: 'Follow-up' },
                { value: 'Lab Result Review', label: 'Lab Result Review' },
                { value: 'Medication Review', label: 'Medication Review' },
                { value: 'Home Visit', label: 'Home Visit' },
                { value: 'Emergency', label: 'Emergency' },
                { value: 'Other', label: 'Other' },
              ]}
            />
          </div>

          <Textarea
            label="Reason for Appointment"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={3}
            placeholder="Brief description of the reason for this appointment..."
          />
        </div>

        {/* Assignment & Location Section */}
        <div className="card">
          <h2 className="section-title">Assignment & Location</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Assigned To (Staff/Doctor)"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              placeholder="e.g., Dr. Smith, Nurse Sarah"
            />

            <Select
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              options={[
                { value: 'Clinic', label: 'Clinic' },
                { value: 'Home Visit', label: 'Home Visit' },
                { value: 'Phone Consultation', label: 'Phone Consultation' },
                { value: 'Other', label: 'Other' },
              ]}
            />
          </div>
        </div>

        {/* Additional Notes Section */}
        <div className="card">
          <h2 className="section-title">Additional Notes</h2>

          <Textarea
            label="Internal Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Any additional notes or special instructions..."
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/dashboard/appointments')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Appointment'}
          </Button>
        </div>
      </form>
    </div>
  );
}
