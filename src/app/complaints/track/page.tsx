'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Phone, 
  Mail,
  MapPin,
  Calendar
} from 'lucide-react';

interface Timeline {
  status: string;
  timestamp: string;
  note: string;
  updatedBy?: string;
}

interface Complaint {
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
    address: string;
  };
  department: {
    id: any;
    name: string;
    assignedOfficer?: string;
  };
  location: {
    pincode: string;
    district: string;
    state: string;
  };
  timeline: Timeline[];
  createdAt: string;
  updatedAt: string;
}

export default function TrackComplaint() {
  const searchParams = useSearchParams();
  const [complaintId, setComplaintId] = useState(searchParams?.get('id') || '');
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const fetchComplaint = async (id: string) => {
    if (!id.trim()) {
      setError('Please enter a complaint ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/complaints/${id}`);
      const data = await response.json();

      if (response.ok) {
        setComplaint(data.complaint);
      } else {
        setError(data.error || 'Complaint not found');
        setComplaint(null);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (complaintId) {
      fetchComplaint(complaintId);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchComplaint(complaintId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      case 'under_review':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-orange-600" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

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
              <Search className="w-6 h-6 text-primary-600" />
              <h1 className="text-xl font-semibold text-gray-900">Track Complaint</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Complaint ID</h2>
          <form onSubmit={handleSearch} className="flex space-x-4">
            <input
              type="text"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              placeholder="e.g., SVL2024123456"
              className="input-field flex-1"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Track
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Complaint Details */}
        {complaint && (
          <div className="space-y-6">
            {/* Status Overview */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Complaint #{complaint.complaintId}
                  </h2>
                  <p className="text-gray-600 mt-1">{complaint.title}</p>
                </div>
                <div className="text-right">
                  <span className={`badge-status ${statusColors[complaint.status as keyof typeof statusColors]}`}>
                    {complaint.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <p className={`text-sm font-medium mt-1 ${priorityColors[complaint.priority as keyof typeof priorityColors]}`}>
                    {complaint.priority.toUpperCase()} Priority
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Department Assigned</h3>
                  <p className="text-gray-700">{complaint.department.name}</p>
                  {complaint.department.assignedOfficer && (
                    <p className="text-sm text-gray-600">
                      Officer: {complaint.department.assignedOfficer}
                    </p>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Filed On</h3>
                  <p className="text-gray-700">{formatDate(complaint.createdAt)}</p>
                  <p className="text-sm text-gray-600">
                    Category: {complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1)}
                  </p>
                </div>
              </div>
            </div>

            {/* Complaint Description */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Complaint Details</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{complaint.description}</p>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {complaint.location.district}, {complaint.location.state} - {complaint.location.pincode}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-6">Complaint Timeline</h3>
              <div className="space-y-4">
                {complaint.timeline.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(item.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">
                          {item.status.replace('_', ' ').toUpperCase()}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {formatDate(item.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-1">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>+91-612-2234567</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>help@sevalink.gov.in</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                For any queries related to your complaint, please contact us with your complaint ID.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 