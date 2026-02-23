'user client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';

const APPOINTMENT_TYPES = [
  'General Consultation',
  'Follow-up',
  'Lab Result Review',
  'Medication Review',
  'Home Visit',
  'Emergency',
  'Other',
];

const DURATIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
];

const LOCATIONS = ['Clinic', 'Home Visit', 'Phone Consultation', 'Other'];
const STATUSES = [
  'Scheduled',
  'Confirmed',
  'Completed',
  'Cancelled',
  'No-show',
];

export default function AppointmentForm({
  initialData = null,
  preselectedPatientId = null,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedAppt, setSavedAppt] = useState(null);
  const [patientMode, setPatientMode] = useState('search'); // 'search' | 'walkin'
  const [patientSearch, setPatientSearch] = useState('');
  const [patientResults, setPatientResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searching, setSearching] = useState(false);

  const [formData, setFormData] = useState({
    patientId:
      initialData?.patientId?._id ||
      initialData?.patientId ||
      preselectedPatientId ||
      '',
    walkInName: initialData?.walkInPatient?.fullName || '',
    walkInPhone: initialData?.walkInPatient?.phoneNumber || '',
    appointmentDate: initialData?.appointmentDate
      ? new Date(initialData.appointmentDate).toISOString().split('T')[0]
      : '',
    appointmentTime: initialData?.appointmentTime || '',
    duration: initialData?.duration || 30,
    type: initialData?.type || '',
    reason: initialData?.reason || '',
    assignedTo: initialData?.assignedTo || '',
    location: initialData?.location || 'Clinic',
    status: initialData?.status || 'Scheduled',
    cancellationReason: initialData?.cancellationReason || '',
    notes: initialData?.notes || '',
    reminderSent: initialData?.reminderSent || false,
  });

  // Determine initial patient mode from initialData
  useEffect(() => {
    if (initialData?.walkInPatient?.fullName) {
      setPatientMode('walkin');
    } else if (initialData?.patientId || preselectedPatientId) {
      setPatientMode('search');
      const idToLoad =
        initialData?.patientId?._id ||
        initialData?.patientId ||
        preselectedPatientId;
      if (idToLoad) fetchPatientById(idToLoad);
    }
  }, []);

  const fetchPatientById = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedPatient(data.patient || data);
      }
    } catch {
      /* silent */
    }
  };

  const handlePatientSearch = async (value) => {
    setPatientSearch(value);
    if (value.length < 2) {
      setPatientResults([]);
      return;
    }
    setSearching(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `/api/patients?search=${encodeURIComponent(value)}&limit=6`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setPatientResults(data.patients || []);
    } catch {
      setPatientResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setFormData((prev) => ({ ...prev, patientId: patient._id }));
    setPatientSearch('');
    setPatientResults([]);
  };

  const clearPatient = () => {
    setSelectedPatient(null);
    setFormData((prev) => ({ ...prev, patientId: '' }));
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

    // Patient validation
    if (patientMode === 'search' && !formData.patientId) {
      toast.error('Please search and select a patient.');
      return;
    }
    if (
      patientMode === 'walkin' &&
      (!formData.walkInName || !formData.walkInPhone)
    ) {
      toast.error('Walk-in patient name and phone number are required.');
      return;
    }
    if (
      !formData.appointmentDate ||
      !formData.appointmentTime ||
      !formData.type
    ) {
      toast.error('Please fill in date, time, and appointment type.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        patientId: patientMode === 'search' ? formData.patientId : null,
        walkInPatient:
          patientMode === 'walkin'
            ? {
                fullName: formData.walkInName,
                phoneNumber: formData.walkInPhone,
              }
            : undefined,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        duration: parseInt(formData.duration),
        type: formData.type,
        reason: formData.reason,
        assignedTo: formData.assignedTo,
        location: formData.location,
        status: formData.status,
        cancellationReason:
          formData.status === 'Cancelled' ? formData.cancellationReason : '',
        notes: formData.notes,
        reminderSent: formData.reminderSent,
      };

      const token = localStorage.getItem('token');
      const url = initialData
        ? `/api/appointments/${initialData._id}`
        : '/api/appointments';
      const method = initialData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || 'Failed to save appointment');

      const storedUser = localStorage.getItem('user');
      const me = storedUser ? JSON.parse(storedUser) : null;

      toast.success(
        initialData ? 'Appointment updated!' : 'Appointment scheduled!',
      );

      if (me?.role === 'user' && !initialData) {
        // Show confirmation screen instead of navigating away to a list they shouldn't see
        setSavedAppt(data.appointment);
        setSaved(true);
      } else {
        router.push('/dashboard/appointments');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isCancelled = formData.status === 'Cancelled';

  // ── Confirmation screen for user role after booking ──
  if (saved && savedAppt) {
    const apptDate = savedAppt.appointmentDate
      ? new Date(savedAppt.appointmentDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : '';
    const patientName =
      savedAppt.patientId?.fullName || savedAppt.walkInPatient?.fullName || '';
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Appointment Scheduled
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {patientName && (
            <>
              <span className="font-medium text-gray-700">{patientName}</span>{' '}
              —{' '}
            </>
          )}
          {apptDate} at {savedAppt.appointmentTime}
          {savedAppt.assignedTo && <> · {savedAppt.assignedTo}</>}
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              setSaved(false);
              setSavedAppt(null);
            }}
            className="w-full py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            + Book Another Appointment
          </button>
          <button
            onClick={() => router.push('/dashboard/appointments')}
            className="w-full py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            View My Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
      {/* ── PATIENT ── */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">Patient</h2>
          {/* Toggle: Existing patient ↔ Walk-in */}
          {!initialData && (
            <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
              <button
                type="button"
                onClick={() => {
                  setPatientMode('search');
                  clearPatient();
                }}
                className={`px-4 py-1.5 font-medium transition-colors ${
                  patientMode === 'search'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                Existing Patient
              </button>
              <button
                type="button"
                onClick={() => {
                  setPatientMode('walkin');
                  clearPatient();
                }}
                className={`px-4 py-1.5 font-medium transition-colors border-l border-gray-200 ${
                  patientMode === 'walkin'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                Walk-in / New
              </button>
            </div>
          )}
        </div>

        {/* ── Existing patient search ── */}
        {patientMode === 'search' && (
          <>
            {selectedPatient ? (
              <div className="flex items-center justify-between bg-primary-50 border border-primary-200 rounded-lg p-4">
                <div>
                  <p className="font-semibold text-gray-900">
                    {selectedPatient.fullName}
                  </p>
                  <p className="text-sm text-gray-500">
                    ID: {selectedPatient.patientId}
                    &nbsp;·&nbsp;{selectedPatient.phoneNumber}
                    {selectedPatient.age && (
                      <>&nbsp;·&nbsp;Age {selectedPatient.age}</>
                    )}
                  </p>
                </div>
                {!preselectedPatientId && !initialData && (
                  <button
                    type="button"
                    onClick={clearPatient}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Change
                  </button>
                )}
              </div>
            ) : (
              <div className="relative">
                <Input
                  label="Search patient by name, ID, or phone"
                  name="patientSearch"
                  value={patientSearch}
                  onChange={(e) => handlePatientSearch(e.target.value)}
                  placeholder="Type at least 2 characters..."
                />
                {searching && (
                  <p className="text-xs text-gray-400 mt-1">Searching...</p>
                )}
                {patientResults.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-56 overflow-y-auto">
                    {patientResults.map((p) => (
                      <li
                        key={p._id}
                        onClick={() => handleSelectPatient(p)}
                        className="px-4 py-3 cursor-pointer hover:bg-primary-50 border-b last:border-0"
                      >
                        <span className="font-medium text-gray-900">
                          {p.fullName}
                        </span>
                        <span className="text-sm text-gray-400 ml-2">
                          {p.patientId} · {p.phoneNumber}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {patientSearch.length >= 2 &&
                  !searching &&
                  patientResults.length === 0 && (
                    <p className="text-sm text-gray-400 mt-1">
                      No patients found.{' '}
                      <button
                        type="button"
                        onClick={() => setPatientMode('walkin')}
                        className="text-primary-600 hover:underline"
                      >
                        Add as walk-in instead →
                      </button>
                    </p>
                  )}
              </div>
            )}
          </>
        )}

        {/* ── Walk-in / new patient ── */}
        {patientMode === 'walkin' && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-3 py-2 text-sm mb-3">
              ℹ️ This patient is not registered in the system. Their details
              will be saved with the appointment only.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Patient Full Name"
                name="walkInName"
                value={formData.walkInName}
                onChange={handleChange}
                placeholder="Enter patient's full name"
                required
              />
              <Input
                label="Phone Number"
                name="walkInPhone"
                type="tel"
                value={formData.walkInPhone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>
        )}
      </div>

      {/* ── APPOINTMENT DETAILS ── */}
      <div className="card">
        <h2 className="section-title">Appointment Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Date"
            name="appointmentDate"
            type="date"
            value={formData.appointmentDate}
            onChange={handleChange}
            required
          />
          <Input
            label="Time"
            name="appointmentTime"
            type="time"
            value={formData.appointmentTime}
            onChange={handleChange}
            required
          />
          <Select
            label="Appointment Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            options={[
              { value: '', label: 'Select type...' },
              ...APPOINTMENT_TYPES.map((t) => ({ value: t, label: t })),
            ]}
          />
          <Select
            label="Duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            options={DURATIONS.map((d) => ({ value: d.value, label: d.label }))}
          />
          <Select
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            options={LOCATIONS.map((l) => ({ value: l, label: l }))}
          />
          <Input
            label="Assigned To (Doctor / Nurse)"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            placeholder="Enter staff name"
          />
        </div>
        <div className="mt-4">
          <Textarea
            label="Reason for Appointment"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={2}
            placeholder="Brief reason or chief complaint"
          />
        </div>
      </div>

      {/* ── STATUS ── */}
      <div className="card">
        <h2 className="section-title">Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Appointment Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={STATUSES.map((s) => ({ value: s, label: s }))}
          />
          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="reminderSent"
              name="reminderSent"
              checked={formData.reminderSent}
              onChange={handleChange}
              className="w-4 h-4 accent-primary-600"
            />
            <label htmlFor="reminderSent" className="text-sm text-gray-700">
              Reminder sent to patient
            </label>
          </div>
        </div>
        {isCancelled && (
          <div className="mt-4">
            <Input
              label="Cancellation Reason"
              name="cancellationReason"
              value={formData.cancellationReason}
              onChange={handleChange}
              placeholder="Why was this appointment cancelled?"
            />
          </div>
        )}
      </div>

      {/* ── NOTES ── */}
      <div className="card">
        <h2 className="section-title">Additional Notes</h2>
        <Textarea
          label="Internal Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Any internal notes about this appointment"
        />
      </div>

      {/* ── ACTIONS ── */}
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
          {loading
            ? 'Saving...'
            : initialData
              ? 'Update Appointment'
              : 'Schedule Appointment'}
        </Button>
      </div>
    </form>
  );
}
