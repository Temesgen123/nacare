'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Activity, FileText, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalVisits: 0,
    totalLabResults: 0,
    recentPatients: 0,
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fetch dashboard stats
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch patients count
      const patientsRes = await fetch('/api/patients?limit=1', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const patientsData = await patientsRes.json();

      setStats((prev) => ({
        ...prev,
        totalPatients: patientsData.pagination?.total || 0,
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    </div>
  );
}
