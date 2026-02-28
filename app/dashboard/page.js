'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Activity, FileText, TrendingUp, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalVisits: 0,
    totalLabResults: 0,
    totalBookings: 0,
    totalAppointments: 0,
    recentPatients: 0,
    pendingBookings: 0,
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fetch dashboard stats
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      // Fetch all stats in parallel
      const [
        patientsRes,
        visitsRes,
        labResultsRes,
        bookingsRes,
        appointmentsRes,
      ] = await Promise.all([
        fetch('/api/patients?limit=1', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/visits?limit=1', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/lab-results?limit=1', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/bookings?limit=1', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/appointments?limit=1', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Parse responses
      const patientsData = patientsRes.ok
        ? await patientsRes.json()
        : { pagination: { total: 0 } };
      const visitsData = visitsRes.ok
        ? await visitsRes.json()
        : { pagination: { total: 0 } };
      const labResultsData = labResultsRes.ok
        ? await labResultsRes.json()
        : { pagination: { total: 0 } };
      const bookingsData = bookingsRes.ok
        ? await bookingsRes.json()
        : { pagination: { total: 0 } };
      const appointmentsData = appointmentsRes.ok
        ? await appointmentsRes.json()
        : { pagination: { total: 0 } };

      // Fetch pending bookings count
      const pendingBookingsRes = await fetch(
        '/api/bookings?status=Pending&limit=1',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const pendingBookingsData = pendingBookingsRes.ok
        ? await pendingBookingsRes.json()
        : { pagination: { total: 0 } };

      // Calculate recent patients (this month)
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const recentPatientsRes = await fetch('/api/patients?limit=1000', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allPatientsData = recentPatientsRes.ok
        ? await recentPatientsRes.json()
        : { patients: [] };
      const recentPatientsCount =
        allPatientsData.patients?.filter(
          (p) => new Date(p.createdAt) >= firstDayOfMonth,
        ).length || 0;

      setStats({
        totalPatients: patientsData.pagination?.total || 0,
        totalVisits: visitsData.pagination?.total || 0,
        totalLabResults: labResultsData.pagination?.total || 0,
        totalBookings: bookingsData.pagination?.total || 0,
        totalAppointments: appointmentsData.pagination?.total || 0,
        recentPatients: recentPatientsCount,
        pendingBookings: pendingBookingsData.pagination?.total || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      color: 'bg-blue-500',
      href: '/dashboard/patients',
    },
    {
      title: 'Total Visits',
      value: stats.totalVisits,
      icon: Activity,
      color: 'bg-green-500',
      href: '/dashboard/visits',
    },
    {
      title: 'Lab Results',
      value: stats.totalLabResults,
      icon: FileText,
      color: 'bg-purple-500',
      href: '/dashboard/lab-results',
    },
    {
      title: 'Appointments',
      value: stats.totalAppointments,
      icon: Calendar,
      color: 'bg-indigo-500',
      href: '/dashboard/appointments',
    },
    {
      title: 'Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'bg-teal-500',
      href: '/dashboard/bookings',
    },
    {
      title: 'This Month',
      value: stats.recentPatients,
      icon: TrendingUp,
      color: 'bg-orange-500',
      href: '/dashboard/patients',
    },
  ];

  const quickActions = [
    {
      title: 'Register New Patient',
      description: 'Add a new patient to the system',
      href: '/dashboard/patients/new',
      icon: Users,
      color: 'bg-primary-600',
    },
    {
      title: 'Record Visit',
      description: 'Record a home visit examination',
      href: '/dashboard/visits',
      icon: Activity,
      color: 'bg-green-600',
    },
    {
      title: 'Add Lab Results',
      description: 'Enter laboratory test results',
      href: '/dashboard/lab-results',
      icon: FileText,
      color: 'bg-purple-600',
    },
    {
      title: 'New Appointment',
      description: 'Schedule a new appointment',
      href: '/dashboard/appointments/new',
      icon: Calendar,
      color: 'bg-indigo-600',
    },
    {
      title: 'View Bookings',
      description: `${stats.pendingBookings} pending bookings`,
      href: '/dashboard/bookings',
      icon: Calendar,
      color: 'bg-teal-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.fullName || 'User'}!
        </h1>
        <p className="text-gray-600">Here's an overview of Nacare Health.</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.title}
                href={stat.href}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
              >
                <div
                  className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Section (Optional Enhancement) */}
      {stats.pendingBookings > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-amber-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Pending Bookings
              </h3>
              <p className="text-sm text-gray-600">
                You have {stats.pendingBookings} pending booking
                {stats.pendingBookings !== 1 ? 's' : ''} that need
                {stats.pendingBookings === 1 ? 's' : ''} attention.
              </p>
            </div>
            <Link
              href="/dashboard/bookings?status=Pending"
              className="ml-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              View Bookings
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
