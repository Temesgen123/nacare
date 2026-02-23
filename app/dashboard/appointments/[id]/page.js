'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Button from '../../../../components/ui/Button';

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
      {label}
    </p>
    <p className="text-sm text-gray-800">{value || '—'}</p>
  </div>
);

const STATUS_COLORS = {
  Scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
  Confirmed: 'bg-green-100 text-green-700 border-green-200',
  Completed: 'bg-gray-100 text-gray-600 border-gray-200',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
  'No-show': 'bg-orange-100 text-orange-700 border-orange-200',
};

export default function ViewAppointmentPage() {
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

  const handleQuickStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...appt,
          status: newStatus,
          patientId: appt.patientId?._id || appt.patientId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAppt(data.appointment);
      toast.success(`Marked as ${newStatus}`);
    } catch (e) {
      toast.error(e.message || 'Failed to update status');
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-64 text-gray-400 text-sm">
        Loading appointment...
      </div>
    );
  if (!appt) return null;

  const isRegistered = !!appt.patientId;
  const patientName =
    appt.patientId?.fullName || appt.walkInPatient?.fullName || '—';
  const patientPhone =
    appt.patientId?.phoneNumber || appt.walkInPatient?.phoneNumber || '—';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <button
            onClick={() => router.push('/dashboard/appointments')}
            className="text-sm text-gray-400 hover:text-gray-600 mb-1 flex items-center gap-1"
          >
            ← Back to Appointments
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Appointment Detail
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Booked {formatDate(appt.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Quick status buttons */}
          {appt.status === 'Scheduled' && (
            <Button
              variant="secondary"
              onClick={() => handleQuickStatus('Confirmed')}
            >
              ✓ Confirm
            </Button>
          )}
          {(appt.status === 'Scheduled' || appt.status === 'Confirmed') && (
            <>
              <Button
                variant="secondary"
                onClick={() => handleQuickStatus('Completed')}
              >
                Mark Complete
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleQuickStatus('No-show')}
              >
                No-show
              </Button>
            </>
          )}
          <Button
            variant="primary"
            onClick={() => router.push(`/dashboard/appointments/${id}/edit`)}
          >
            Edit
          </Button>
        </div>
      </div>

      {/* Status banner */}
      <div
        className={`flex items-center justify-between rounded-xl border px-5 py-4 ${STATUS_COLORS[appt.status] || 'bg-gray-100'}`}
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-wide opacity-70 mb-0.5">
            Status
          </p>
          <p className="text-lg font-semibold">{appt.status}</p>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-70 mb-0.5">Appointment</p>
          <p className="text-lg font-semibold">
            {formatDate(appt.appointmentDate)} at {appt.appointmentTime}
          </p>
        </div>
      </div>

      {/* Patient */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title mb-0">Patient</h2>
          {!isRegistered && (
            <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
              Walk-in / Unregistered
            </span>
          )}
          {isRegistered && (
            <button
              onClick={() =>
                router.push(`/dashboard/patients/${appt.patientId._id}`)
              }
              className="text-sm text-primary-600 hover:underline"
            >
              View Patient Record →
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Field label="Full Name" value={patientName} />
          <Field label="Phone" value={patientPhone} />
          {isRegistered && (
            <Field label="Patient ID" value={appt.patientId?.patientId} />
          )}
          {isRegistered && appt.patientId?.age && (
            <Field label="Age" value={`${appt.patientId.age} yrs`} />
          )}
          {isRegistered && appt.patientId?.sex && (
            <Field label="Sex" value={appt.patientId.sex} />
          )}
        </div>
      </div>

      {/* Appointment Info */}
      <div className="card">
        <h2 className="section-title">Appointment Information</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          <Field label="Date" value={formatDate(appt.appointmentDate)} />
          <Field label="Time" value={appt.appointmentTime} />
          <Field
            label="Duration"
            value={appt.duration ? `${appt.duration} minutes` : null}
          />
          <Field label="Type" value={appt.type} />
          <Field label="Location" value={appt.location} />
          <Field label="Assigned To" value={appt.assignedTo} />
        </div>
        {appt.reason && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Field label="Reason for Appointment" value={appt.reason} />
          </div>
        )}
      </div>

      {/* Cancellation reason */}
      {appt.status === 'Cancelled' && appt.cancellationReason && (
        <div className="card border-2 border-red-200 bg-red-50">
          <h2 className="section-title">Cancellation Details</h2>
          <Field label="Reason" value={appt.cancellationReason} />
        </div>
      )}

      {/* Notes */}
      {appt.notes && (
        <div className="card">
          <h2 className="section-title">Internal Notes</h2>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">
            {appt.notes}
          </p>
        </div>
      )}

      {/* Meta */}
      <div className="card bg-gray-50">
        <h2 className="section-title text-gray-500">Record Info</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Field label="Created" value={formatDate(appt.createdAt)} />
          <Field label="Last Updated" value={formatDate(appt.updatedAt)} />
          <Field
            label="Reminder Sent"
            value={appt.reminderSent ? 'Yes' : 'No'}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-4">
        <Button
          variant="secondary"
          onClick={() => router.push('/dashboard/appointments')}
        >
          Back to List
        </Button>
        <Button
          variant="primary"
          onClick={() => router.push(`/dashboard/appointments/${id}/edit`)}
        >
          Edit Appointment
        </Button>
      </div>
    </div>
  );
}
