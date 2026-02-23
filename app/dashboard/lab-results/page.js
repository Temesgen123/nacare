'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Button from '../../../components/ui/Button';

export default function LabResultsPage() {
  const router = useRouter();
  const [labResults, setLabResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [currentPage, setCurrentPage] = useState(1);

  const fetchLabResults = useCallback(async (page = 1, patientSearch = '') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ page, limit: 10 });
      if (patientSearch) params.set('search', patientSearch);

      const res = await fetch(`/api/lab-results?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch lab results');
      const data = await res.json();
      setLabResults(data.labResults || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (error) {
      toast.error('Failed to load lab results.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLabResults(currentPage, search);
  }, [currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchLabResults(1, search);
  };

  const getTestBadges = (labTests) => {
    if (!labTests) return [];
    const labels = {
      fbs: 'FBS',
      rbs: 'RBS',
      cbc: 'CBC',
      lipidProfile: 'Lipid',
      rft: 'RFT',
    };
    const active = Object.entries(labels)
      .filter(([key]) => labTests[key])
      .map(([, label]) => label);
    if (labTests.other) active.push('Other');
    return active;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lab Results</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pagination.total} record{pagination.total !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push('/dashboard/lab-results/new')}
        >
          + New Lab Result
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
              fetchLabResults(1, '');
              setCurrentPage(1);
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
            Loading lab results...
          </div>
        ) : labResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-lg font-medium">No lab results found</p>
            <p className="text-sm mt-1">
              Record a new lab result to get started.
            </p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => router.push('/dashboard/lab-results/new')}
            >
              + New Lab Result
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
                    Tests
                  </th>
                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Lab Partner
                  </th>
                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Sample Date
                  </th>
                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Results Date
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
                {labResults.map((result) => {
                  const badges = getTestBadges(result.labTests);
                  return (
                    <tr
                      key={result._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Patient */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          {result.patientId?.fullName || '—'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {result.patientId?.patientId} ·{' '}
                          {result.patientId?.phoneNumber}
                        </p>
                      </td>

                      {/* Test Badges */}
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {badges.length > 0 ? (
                            badges.map((b) => (
                              <span
                                key={b}
                                className="inline-block bg-primary-100 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full"
                              >
                                {b}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </div>
                      </td>

                      {/* Lab Partner */}
                      <td className="px-5 py-4 text-gray-700">
                        {result.labPartnerName || '—'}
                      </td>

                      {/* Sample Date */}
                      <td className="px-5 py-4 text-gray-700">
                        {formatDate(result.dateSampleCollected)}
                      </td>

                      {/* Results Date */}
                      <td className="px-5 py-4 text-gray-700">
                        {formatDate(result.dateResultsReceived)}
                      </td>

                      {/* Status Flags */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          {result.criticalValuesPresent && (
                            <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                              ⚠ Critical
                            </span>
                          )}
                          {result.doctorReview?.referralRequired && (
                            <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                              Referral
                            </span>
                          )}
                          {result.doctorReview?.followUpPlanned && (
                            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                              Follow-up
                            </span>
                          )}
                          {!result.criticalValuesPresent &&
                            !result.doctorReview?.referralRequired &&
                            !result.doctorReview?.followUpPlanned && (
                              <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                Normal
                              </span>
                            )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/lab-results/${result._id}`,
                              )
                            }
                            className="text-sm text-primary-600 hover:underline font-medium"
                          >
                            View
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/lab-results/${result._id}/edit`,
                              )
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
