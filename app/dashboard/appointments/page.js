'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Button from '../../../components/ui/Button';

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

const STATUS_COLORS = {
  Scheduled: 'bg-blue-100 text-blue-700',
  Confirmed: 'bg-green-100 text-green-700',
  Completed: 'bg-gray-100 text-gray-600',
  Cancelled: 'bg-red-100 text-red-700',
  'No-show': 'bg-orange-100 text-orange-700',
};

const TYPE_COLORS = {
  Emergency: 'bg-red-100 text-red-700',
  'General Consultation': 'bg-primary-100 text-primary-700',
  'Follow-up': 'bg-purple-100 text-purple-700',
  'Lab Result Review': 'bg-yellow-100 text-yellow-700',
  'Medication Review': 'bg-teal-100 text-teal-700',
  'Home Visit': 'bg-indigo-100 text-indigo-700',
  Other: 'bg-gray-100 text-gray-600',
};

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [upcomingOnly, setUpcomingOnly] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [todayCount, setTodayCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  // Read user synchronously so isUserRole is correct on the very first render/fetch
  const [currentUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const fetchAppointments = useCallback(
    async (page = 1, query = '', status = '', upcoming = true) => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams({ page, limit: 10 });
        if (query) params.set('search', query);
        if (status) params.set('status', status);
        if (upcoming) params.set('upcoming', 'true');
        // Always send mine=true for user role — currentUser is set synchronously
        if (currentUser?.role === 'user') params.set('mine', 'true');

        const res = await fetch(`/api/appointments?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setAppointments(data.appointments || []);
        setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
        setTodayCount(data.todayCount ?? 0);
      } catch {
        toast.error('Failed to load appointments.');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchAppointments(currentPage, search, statusFilter, upcomingOnly);
  }, [currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAppointments(1, search, statusFilter, upcomingOnly);
  };

  const handleFilterChange = (newStatus, newUpcoming) => {
    setStatusFilter(newStatus);
    setUpcomingOnly(newUpcoming);
    setCurrentPage(1);
    fetchAppointments(1, search, newStatus, newUpcoming);
  };

  const getPatientName = (appt) =>
    appt.patientId?.fullName || appt.walkInPatient?.fullName || '—';

  const getPatientPhone = (appt) =>
    appt.patientId?.phoneNumber || appt.walkInPatient?.phoneNumber || '';

  const getPatientSubline = (appt) => {
    if (appt.patientId)
      return `${appt.patientId.patientId} · ${appt.patientId.phoneNumber}`;
    if (appt.walkInPatient?.fullName)
      return `Walk-in · ${appt.walkInPatient.phoneNumber}`;
    return '';
  };

  const isUserRole = currentUser?.role === 'user';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isUserRole ? 'My Appointments' : 'Appointments'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {pagination.total} appointment{pagination.total !== 1 ? 's' : ''}
            {!isUserRole && todayCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {todayCount} today
              </span>
            )}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push('/dashboard/appointments/new')}
        >
          + New Appointment
        </Button>
      </div>

      {/* Filters row — hidden for user role */}
      {!isUserRole && (
        <div className="flex flex-wrap gap-2 items-center">
          {/* Quick filters */}
          {[
            { label: 'Upcoming', status: '', upcoming: true },
            { label: 'All', status: '', upcoming: false },
            { label: 'Scheduled', status: 'Scheduled', upcoming: false },
            { label: 'Confirmed', status: 'Confirmed', upcoming: false },
            { label: 'Completed', status: 'Completed', upcoming: false },
            { label: 'Cancelled', status: 'Cancelled', upcoming: false },
          ].map((f) => (
            <button
              key={f.label}
              onClick={() => handleFilterChange(f.status, f.upcoming)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                statusFilter === f.status && upcomingOnly === f.upcoming
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient name, ID, phone or staff..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <Button type="submit" variant="secondary">
          Search
        </Button>
        {search && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setSearch('');
              fetchAppointments(1, '', statusFilter, upcomingOnly);
            }}
          >
            Clear
          </Button>
        )}
      </form>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
            Loading appointments...
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-lg font-medium">No appointments found</p>
            <p className="text-sm mt-1">
              {isUserRole
                ? 'You have no appointments yet.'
                : 'Schedule a new appointment to get started.'}
            </p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => router.push('/dashboard/appointments/new')}
            >
              + New Appointment
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-left">
                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Patient
                  </th>
                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Date & Time
                  </th>
                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Type
                  </th>
                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Location
                  </th>
                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Assigned To
                  </th>
                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((appt) => (
                  <tr
                    key={appt._id}
                    className={`hover:bg-gray-50 transition-colors ${appt.type === 'Emergency' ? 'bg-red-50' : ''}`}
                  >
                    {/* Patient */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">
                        {getPatientName(appt)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {getPatientSubline(appt)}
                      </p>
                    </td>

                    {/* Date & Time */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">
                        {formatDate(appt.appointmentDate)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {appt.appointmentTime}
                        {appt.duration && (
                          <span className="text-gray-400">
                            {' '}
                            · {appt.duration}min
                          </span>
                        )}
                      </p>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_COLORS[appt.type] || 'bg-gray-100 text-gray-600'}`}
                      >
                        {appt.type}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4 text-gray-600 text-sm">
                      {appt.location || '—'}
                    </td>

                    {/* Assigned */}
                    <td className="px-5 py-4 text-gray-600 text-sm">
                      {appt.assignedTo || '—'}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[appt.status] || 'bg-gray-100 text-gray-600'}`}
                      >
                        {appt.status}
                      </span>
                      {appt.reminderSent && (
                        <p className="text-xs text-gray-400 mt-1">✓ Reminded</p>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            router.push(`/dashboard/appointments/${appt._id}`)
                          }
                          className="text-sm text-primary-600 hover:underline font-medium"
                        >
                          View
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/appointments/${appt._id}/edit`,
                            )
                          }
                          className="text-sm text-gray-500 hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Page {pagination.page} of {pagination.pages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              ← Previous
            </Button>
            <Button
              variant="secondary"
              disabled={currentPage >= pagination.pages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
