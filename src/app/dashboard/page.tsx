'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Users,
  Building,
  Calendar,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardStats {
  totalComplaints: number;
  resolvedComplaints: number;
  activeComplaints: number;
  avgResolutionTime: number;
  departmentStats: Array<{
    name: string;
    total: number;
    resolved: number;
    avgResponseTime: number;
    resolutionRate: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    complaints: number;
    resolved: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
}

export default function PublicDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30');

  useEffect(() => {
    fetchDashboardStats();
  }, [selectedTimeframe]);

  const fetchDashboardStats = async () => {
    try {
      // Mock data for demo - in production, this would come from your API
      const mockStats: DashboardStats = {
        totalComplaints: 2847,
        resolvedComplaints: 2156,
        activeComplaints: 691,
        avgResolutionTime: 36,
        departmentStats: [
          {
            name: 'Bihar State Electricity Board',
            total: 856,
            resolved: 734,
            avgResponseTime: 24,
            resolutionRate: 85.7
          },
          {
            name: 'Patna Municipal Corporation',
            total: 623,
            resolved: 567,
            avgResponseTime: 18,
            resolutionRate: 91.0
          },
          {
            name: 'Indian Railways - Patna',
            total: 445,
            resolved: 378,
            avgResponseTime: 48,
            resolutionRate: 84.9
          },
          {
            name: 'Bihar Police',
            total: 234,
            resolved: 198,
            avgResponseTime: 12,
            resolutionRate: 84.6
          },
          {
            name: 'Public Health Department',
            total: 345,
            resolved: 279,
            avgResponseTime: 36,
            resolutionRate: 80.9
          },
          {
            name: 'Education Department',
            total: 344,
            resolved: 278,
            avgResponseTime: 42,
            resolutionRate: 80.8
          }
        ],
        monthlyTrends: [
          { month: 'Jan', complaints: 245, resolved: 198 },
          { month: 'Feb', complaints: 267, resolved: 223 },
          { month: 'Mar', complaints: 289, resolved: 251 },
          { month: 'Apr', complaints: 234, resolved: 201 },
          { month: 'May', complaints: 298, resolved: 267 },
          { month: 'Jun', complaints: 312, resolved: 289 }
        ],
        categoryBreakdown: [
          { category: 'Electricity', count: 856, percentage: 30.1 },
          { category: 'Municipal', count: 623, percentage: 21.9 },
          { category: 'Railways', count: 445, percentage: 15.6 },
          { category: 'Health', count: 345, percentage: 12.1 },
          { category: 'Education', count: 344, percentage: 12.1 },
          { category: 'Police', count: 234, percentage: 8.2 }
        ]
      };

      // Simulate API delay
      setTimeout(() => {
        setStats(mockStats);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, color }: {
    title: string;
    value: string | number;
    icon: any;
    change?: string;
    color: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${color}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color.includes('green') ? 'bg-green-100' : color.includes('blue') ? 'bg-blue-100' : color.includes('orange') ? 'bg-orange-100' : 'bg-gray-100'}`}>
          <Icon className={`w-6 h-6 ${color.includes('green') ? 'text-green-600' : color.includes('blue') ? 'text-blue-600' : color.includes('orange') ? 'text-orange-600' : 'text-gray-600'}`} />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-primary-600" />
              <h1 className="text-xl font-semibold text-gray-900">Public Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            SevaLink Transparency Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Real-time insights into government complaint resolution performance across Bihar departments.
            Transparency and accountability in public service delivery.
          </p>
        </div>

        {/* Time Filter */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white rounded-lg p-1 shadow-md">
            {['7', '30', '90', '365'].map((days) => (
              <button
                key={days}
                onClick={() => setSelectedTimeframe(days)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTimeframe === days
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {days === '7' ? 'Last 7 days' : 
                 days === '30' ? 'Last 30 days' :
                 days === '90' ? 'Last 3 months' : 'Last year'}
              </button>
            ))}
          </div>
        </div>

        {stats && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Complaints"
                value={stats.totalComplaints.toLocaleString()}
                icon={Users}
                change="+12% from last month"
                color="text-blue-600"
              />
              <StatCard
                title="Resolved"
                value={stats.resolvedComplaints.toLocaleString()}
                icon={CheckCircle}
                change={`${((stats.resolvedComplaints / stats.totalComplaints) * 100).toFixed(1)}% resolution rate`}
                color="text-green-600"
              />
              <StatCard
                title="Active Cases"
                value={stats.activeComplaints.toLocaleString()}
                icon={AlertTriangle}
                change="Being processed"
                color="text-orange-600"
              />
              <StatCard
                title="Avg Resolution"
                value={`${stats.avgResolutionTime}h`}
                icon={Clock}
                change="-8% from last month"
                color="text-green-600"
              />
            </div>

            {/* Department Performance */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Department Performance</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Total</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Resolved</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Resolution Rate</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.departmentStats.map((dept, index) => (
                      <motion.tr
                        key={dept.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Building className="w-4 h-4 text-gray-400 mr-2" />
                            {dept.name}
                          </div>
                        </td>
                        <td className="py-3 px-4">{dept.total}</td>
                        <td className="py-3 px-4">{dept.resolved}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${dept.resolutionRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{dept.resolutionRate}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            dept.avgResponseTime <= 24 ? 'bg-green-100 text-green-800' :
                            dept.avgResponseTime <= 48 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {dept.avgResponseTime}h
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Complaints by Category</h2>
                <div className="space-y-4">
                  {stats.categoryBreakdown.map((category, index) => (
                    <motion.div
                      key={category.category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-primary-600 mr-3"></div>
                        <span className="font-medium text-gray-900">{category.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{category.count}</div>
                        <div className="text-xs text-gray-500">{category.percentage}%</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Trends</h2>
                <div className="space-y-4">
                  {stats.monthlyTrends.map((month, index) => (
                    <motion.div
                      key={month.month}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between"
                    >
                      <span className="font-medium text-gray-900">{month.month}</span>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Filed: {month.complaints}</div>
                          <div className="text-sm text-green-600">Resolved: {month.resolved}</div>
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(month.resolved / month.complaints) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Updates */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Live Updates</h2>
                <div className="flex items-center space-x-2 text-green-600">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm font-medium">Live</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">New complaint filed - Electricity outage in Boring Road</span>
                  <span className="text-xs text-gray-400">2 minutes ago</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Complaint resolved - Water leakage in Gandhi Maidan</span>
                  <span className="text-xs text-gray-400">5 minutes ago</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Status updated - Road repair in progress at Bailey Road</span>
                  <span className="text-xs text-gray-400">12 minutes ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="text-center mt-12 p-6 bg-white rounded-lg shadow-sm">
          <p className="text-gray-600">
            This dashboard is updated in real-time to provide complete transparency in government complaint resolution.
            Data reflects the performance of participating departments in Bihar state.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {new Date().toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  );
} 