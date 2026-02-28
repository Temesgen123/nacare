'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Mail, MailOpen, Eye, Trash2, MessageSquare } from 'lucide-react';

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [unreadCount, setUnreadCount] = useState(0);

  // Check authentication and role
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      toast.error('Please login to access this page');
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin' && user.role !== 'doctor') {
        toast.error('Access denied. Admin or Doctor role required.');
        router.push('/dashboard');
        return;
      }
    } catch (error) {
      toast.error('Invalid session. Please login again.');
      router.push('/login');
      return;
    }

    fetchContacts();
  };

  const fetchContacts = async (
    page = 1,
    status = filter,
    searchTerm = search,
  ) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let url = `/api/contacts?page=${page}&limit=10`;

      if (status === 'unread') {
        url += `&isRead=false`;
      } else if (status !== 'all') {
        url += `&status=${status}`;
      }

      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }

      const data = await response.json();
      setContacts(data.contacts);
      setPagination(data.pagination);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    fetchContacts(1, newFilter, search);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchContacts(1, filter, search);
  };

  const handleViewContact = async (contact) => {
    setSelectedContact(contact);
    setShowDetailModal(true);

    // Mark as read if not already read
    if (!contact.isRead) {
      await markAsRead(contact._id);
    }
  };

  const markAsRead = async (contactId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isRead: true }),
      });

      if (response.ok) {
        // Update local state
        setContacts(
          contacts.map((c) =>
            c._id === contactId ? { ...c, isRead: true } : c,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking contact as read:', error);
    }
  };

  const handleUpdateStatus = async (contactId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      toast.success(`Status updated to ${newStatus}`);
      fetchContacts(pagination.page, filter, search);

      // Update selected contact if viewing
      if (selectedContact && selectedContact._id === contactId) {
        setSelectedContact({ ...selectedContact, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (contactId) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }

      toast.success('Contact deleted successfully');
      setShowDetailModal(false);
      fetchContacts(pagination.page, filter, search);
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      New: 'bg-blue-100 text-blue-800',
      Read: 'bg-gray-100 text-gray-800',
      Replied: 'bg-green-100 text-green-800',
      Archived: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Contact Messages
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and respond to customer inquiries
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <div className="flex flex-wrap gap-2">
                {['all', 'unread', 'New', 'Read', 'Replied', 'Archived'].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => handleFilterChange(status)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        filter === status
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status === 'all'
                        ? 'All'
                        : status === 'unread'
                          ? `Unread (${unreadCount})`
                          : status}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Messages
              </label>
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, or message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Search
                </button>
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      fetchContacts(1, filter, '');
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Clear
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading contacts...
            </div>
          ) : contacts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No contacts found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contacts.map((contact) => (
                      <tr
                        key={contact._id}
                        className={`hover:bg-gray-50 transition-colors ${!contact.isRead ? 'bg-blue-50' : ''}`}
                      >
                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {!contact.isRead ? (
                              <Mail className="w-4 h-4 text-blue-600" />
                            ) : (
                              <MailOpen className="w-4 h-4 text-gray-400" />
                            )}
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(contact.status)}`}
                            >
                              {contact.status}
                            </span>
                          </div>
                        </td>

                        {/* Contact Info */}
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {contact.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {contact.email}
                          </div>
                          {contact.phone && (
                            <div className="text-sm text-gray-500">
                              {contact.phone}
                            </div>
                          )}
                        </td>

                        {/* Subject */}
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 font-medium max-w-xs truncate">
                            {contact.subject}
                          </div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {contact.message}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(contact.createdAt)}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewContact(contact)}
                              className="text-primary-600 hover:text-primary-900"
                              title="View details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(contact._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() =>
                        fetchContacts(pagination.page - 1, filter, search)
                      }
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        fetchContacts(pagination.page + 1, filter, search)
                      }
                      disabled={pagination.page === pagination.pages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing page{' '}
                        <span className="font-medium">{pagination.page}</span>{' '}
                        of{' '}
                        <span className="font-medium">{pagination.pages}</span>{' '}
                        ({pagination.total} total contacts)
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() =>
                            fetchContacts(pagination.page - 1, filter, search)
                          }
                          disabled={pagination.page === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() =>
                            fetchContacts(pagination.page + 1, filter, search)
                          }
                          disabled={pagination.page === pagination.pages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedContact && (
        <ContactDetailModal
          contact={selectedContact}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedContact(null);
          }}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
          formatDate={formatDate}
        />
      )}
    </div>
  );
}

// Contact Detail Modal Component
function ContactDetailModal({
  contact,
  onClose,
  onUpdateStatus,
  onDelete,
  formatDate,
}) {
  const [adminNotes, setAdminNotes] = useState(contact.adminNotes || '');
  const [saving, setSaving] = useState(false);

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/contacts/${contact._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adminNotes }),
      });
      toast.success('Notes saved');
    } catch (error) {
      toast.error('Failed to save notes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Contact Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Contact Information
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div>
                <strong>Name:</strong> {contact.name}
              </div>
              <div>
                <strong>Email:</strong> {contact.email}
              </div>
              {contact.phone && (
                <div>
                  <strong>Phone:</strong> {contact.phone}
                </div>
              )}
              <div>
                <strong>Date:</strong> {formatDate(contact.createdAt)}
              </div>
              <div>
                <strong>Status:</strong> {contact.status}
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Subject</h4>
            <p className="text-gray-900 font-medium">{contact.subject}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Message</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">
                {contact.message}
              </p>
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Admin Notes
            </h4>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Add internal notes..."
            />
            <button
              onClick={handleSaveNotes}
              disabled={saving}
              className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Notes'}
            </button>
          </div>

          {/* Status Update */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Update Status
            </h4>
            <div className="flex gap-2">
              {['New', 'Read', 'Replied', 'Archived'].map((status) => (
                <button
                  key={status}
                  onClick={() => onUpdateStatus(contact._id, status)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    contact.status === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={() => onDelete(contact._id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
