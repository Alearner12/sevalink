'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Bell, 
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Users,
  TrendingUp,
  Calendar,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminComplaint {
  _id: string;
  complaintId: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  citizen: {
    name: string;
    email: string;
    phone: string;
  };
  department: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState<AdminComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<AdminComplaint | null>(null);
  const [updateData, setUpdateData] = useState({
    status: '',
    note: ''
  });

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'new', label: 'New' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'electricity', label: 'Electricity' },
    { value: 'water', label: 'Water Supply' },
    { value: 'railways', label: 'Railways' },
    { value: 'roads', label: 'Roads' },
    { value: 'municipal', label: 'Municipal' },
    { value: 'police', label: 'Police' },
    { value: 'health', label: 'Health' },
    { value: 'education', label: 'Education' }
  ];

  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-orange-100 text-orange-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  };

  const priorityColors = {
    low: 'text-green-600',
    medium: 'text-yellow-600', 
    high: 'text-orange-600',
    urgent: 'text-red-600'
  };

  useEffect(() => {
    fetchComplaints();
  }, [selectedStatus, selectedCategory]);

  const fetchComplaints = async () => {
    try {
      // Mock data for demo
      const mockComplaints: AdminComplaint[] = [
        {
          _id: '1',
          complaintId: 'SVL2024001234',
          title: 'Power outage in Gandhi Maidan area',
          description: 'There has been no electricity for the past 3 days in our locality...',
          category: 'electricity',
          priority: 'high',
          status: 'new',
          citizen: {
            name: 'Rahul Kumar',
            email: 'rahul@email.com',
            phone: '+91-9876543210'
          },
          department: {
            name: 'Bihar State Electricity Board'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '2',
          complaintId: 'SVL2024001235',
          title: 'Water leakage in main road',
          description: 'Major water leakage causing road damage...',
          category: 'water',
          priority: 'medium',
          status: 'in_progress',
          citizen: {
            name: 'Priya Sharma',
            email: 'priya@email.com',
            phone: '+91-9876543211'
          },
          department: {
            name: 'Patna Municipal Corporation'
          },
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '3',
          complaintId: 'SVL2024001236',
          title: 'Train delay complaint',
          description: 'Regular delays in Rajdhani Express...',
          category: 'railways',
          priority: 'low',
          status: 'resolved',
          citizen: {
            name: 'Amit Singh',
            email: 'amit@email.com',
            phone: '+91-9876543212'
          },
          department: {
            name: 'Indian Railways'
          },
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      // Filter based on status and category
      let filteredComplaints = mockComplaints;
      if (selectedStatus !== 'all') {
        filteredComplaints = filteredComplaints.filter(c => c.status === selectedStatus);
      }
      if (selectedCategory !== 'all') {
        filteredComplaints = filteredComplaints.filter(c => c.category === selectedCategory);
      }

      setComplaints(filteredComplaints);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedComplaint || !updateData.status || !updateData.note) {
      return;
    }

    try {
      // In production, this would be an API call
      console.log('Updating complaint:', selectedComplaint.complaintId, updateData);
      
      // Update local state
      setComplaints(prev => prev.map(complaint => 
        complaint._id === selectedComplaint._id 
          ? { ...complaint, status: updateData.status, updatedAt: new Date().toISOString() }
          : complaint
      ));

      setShowUpdateModal(false);
      setSelectedComplaint(null);
      setUpdateData({ status: '', note: '' });
    } catch (error) {
      console.error('Error updating complaint:', error);
    }
  };

  const exportData = () => {
    // Create CSV data
    const csvData = complaints.map(complaint => ({
      'Complaint ID': complaint.complaintId,
      'Title': complaint.title,
      'Category': complaint.category,
      'Priority': complaint.priority,
      'Status': complaint.status,
      'Citizen Name': complaint.citizen.name,
      'Email': complaint.citizen.email,
      'Phone': complaint.citizen.phone,
      'Department': complaint.department.name,
      'Created': new Date(complaint.createdAt).toLocaleDateString(),
      'Updated': new Date(complaint.updatedAt).toLocaleDateString()
    }));

    // Convert to CSV string
    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complaints-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
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
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-primary-600 hover:text-primary-700">
                <Shield className="w-8 h-8" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Complaint Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="p-2 text-gray-600 hover:text-gray-900"
                aria-label="Notifications"
                title="View notifications"
              >
                <Bell className="w-5 h-5" />
              </button>
              <Link href="/dashboard" className="btn-secondary text-sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Public Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">42</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">98</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                <p className="text-2xl font-bold text-gray-900">86%</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input-field"
                  aria-label="Search complaints"
                />
              </div>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input-field"
                aria-label="Filter by status"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
                aria-label="Filter by category"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={exportData}
              className="btn-secondary"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Complaint ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Priority</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Citizen</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint, index) => (
                  <motion.tr
                    key={complaint._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-mono text-sm">{complaint.complaintId}</td>
                    <td className="py-3 px-4">
                      <div className="max-w-xs truncate">{complaint.title}</div>
                    </td>
                    <td className="py-3 px-4 capitalize">{complaint.category}</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${priorityColors[complaint.priority as keyof typeof priorityColors]}`}>
                        {complaint.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge-status ${statusColors[complaint.status as keyof typeof statusColors]}`}>
                        {complaint.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{complaint.citizen.name}</div>
                        <div className="text-sm text-gray-500">{complaint.citizen.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setUpdateData({ status: complaint.status, note: '' });
                            setShowUpdateModal(true);
                          }}
                          className="text-primary-600 hover:text-primary-700"
                          aria-label={`Edit complaint ${complaint.complaintId}`}
                          title="Edit complaint"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/complaints/track?id=${complaint.complaintId}`}
                          className="text-gray-600 hover:text-gray-700"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Update Complaint Status
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Complaint ID: {selectedComplaint.complaintId}
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, status: e.target.value }))}
                  className="input-field"
                  aria-label="Select new status"
                >
                  <option value="new">New</option>
                  <option value="under_review">Under Review</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Note
                </label>
                <textarea
                  value={updateData.note}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, note: e.target.value }))}
                  rows={3}
                  placeholder="Add a note about this status update..."
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedComplaint(null);
                  setUpdateData({ status: '', note: '' });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={!updateData.status || !updateData.note}
                className="btn-primary disabled:opacity-50"
              >
                Update Status
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 