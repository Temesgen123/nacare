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

const SystemBadge = ({ value }) => {
  if (!value) return <span className="text-gray-300">—</span>;
  return (
    <span
      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
        value === 'Normal'
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
      }`}
    >
      {value}
    </span>
  );
};

export default function VisitsPage() {
  const router = useRouter();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [currentPage, setCurrentPage] = useState(1);

  const fetchVisits = useCallback(async (page = 1, query = '') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ page, limit: 10 });
      if (query) params.set('search', query);

      const res = await fetch(`/api/visits?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch visits');
      const data = await res.json();
      setVisits(data.visits || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch {
      toast.error('Failed to load visits.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisits(currentPage, search);
  }, [currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchVisits(1, search);
  };

  const hasAbnormal = (sr) =>
    sr?.cardiovascularSystem === 'Abnormal' ||
    sr?.respiratorySystem === 'Abnormal' ||
    sr?.abdomen === 'Abnormal' ||
    sr?.cns === 'Abnormal';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visits</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pagination.total} record{pagination.total !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push('/dashboard/visits/new')}
        >
          + New Visit
        </Button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient name, ID or phone..."
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
              setCurrentPage(1);
              fetchVisits(1, '');
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
            Loading visits...
          </div>
        ) : visits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-lg font-medium">No visits found</p>
            <p className="text-sm mt-1">Record a new visit to get started.</p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => router.push('/dashboard/visits/new')}
            >
              + New Visit
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
                    Date of Visit
                  </th>
                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Visited By
                  </th>
                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Vital Signs
                  </th>
                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Appearance
                  </th>
                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Systems
                  </th>
                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visits.map((visit) => {
                  const vs = visit.vitalSigns || {};
                  const ge = visit.generalExamination || {};
                  const sr = visit.systemReview || {};
                  const abnormal = hasAbnormal(sr);

                  return (
                    <tr
                      key={visit._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Patient */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          {visit.patientId?.fullName || '—'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {visit.patientId?.patientId} ·{' '}
                          {visit.patientId?.phoneNumber}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-gray-700">
                        {formatDate(visit.dateOfVisit)}
                      </td>

                      {/* Visited By */}
                      <td className="px-5 py-4 text-gray-700">
                        {visit.visitedBy || '—'}
                      </td>

                      {/* Vital Signs */}
                      <td className="px-5 py-4">
                        <div className="space-y-0.5 text-xs text-gray-600">
                          {vs.bloodPressure && (
                            <p>BP: {vs.bloodPressure} mmHg</p>
                          )}
                          {vs.pulseRate && <p>PR: {vs.pulseRate}/min</p>}
                          {vs.randomBloodSugar && (
                            <p>RBS: {vs.randomBloodSugar} mg/dl</p>
                          )}
                          {vs.weight && <p>Wt: {vs.weight} kg</p>}
                          {!vs.bloodPressure &&
                            !vs.pulseRate &&
                            !vs.randomBloodSugar &&
                            !vs.weight && (
                              <span className="text-gray-300">—</span>
                            )}
                        </div>
                      </td>

                      {/* General Appearance */}
                      <td className="px-5 py-4">
                        {ge.generalAppearance ? (
                          <span
                            className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                              ge.generalAppearance === 'Well'
                                ? 'bg-green-100 text-green-700'
                                : ge.generalAppearance === 'Ill'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {ge.generalAppearance}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {ge.pallor && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">
                              Pallor
                            </span>
                          )}
                          {ge.edema && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">
                              Edema
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Systems */}
                      <td className="px-5 py-4">
                        {abnormal ? (
                          <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                            ⚠ Abnormal
                          </span>
                        ) : (
                          <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                            All Normal
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              router.push(`/dashboard/visits/${visit._id}`)
                            }
                            className="text-sm text-primary-600 hover:underline font-medium"
                          >
                            View
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() =>
                              router.push(`/dashboard/visits/${visit._id}/edit`)
                            }
                            className="text-sm text-gray-500 hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
