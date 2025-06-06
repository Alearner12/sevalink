'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Database,
  Mail,
  Upload,
  Search,
  BarChart3,
  Settings,
  RefreshCw,
  AlertTriangle,
  Wifi,
  Server
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'checking';
  responseTime?: number;
  lastChecked: Date;
  details?: string;
  endpoint?: string;
}

interface SystemHealth {
  database: ServiceStatus;
  fileUpload: ServiceStatus;
  notifications: ServiceStatus;
  analytics: ServiceStatus;
  search: ServiceStatus;
  api: ServiceStatus;
}

export default function SystemStatus() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    checkSystemHealth();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(checkSystemHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkSystemHealth = async () => {
    setLoading(true);
    
    const services: (keyof SystemHealth)[] = [
      'database', 'fileUpload', 'notifications', 'analytics', 'search', 'api'
    ];
    
    const healthChecks = await Promise.allSettled(
      services.map(async (service) => {
        const startTime = Date.now();
        let status: ServiceStatus;
        
        try {
          let response: Response;
          
          switch (service) {
            case 'database':
              response = await fetch('/api/test-db');
              break;
            case 'fileUpload':
              // Check if upload endpoint is responsive (we'll just check if it exists)
              response = await fetch('/api/upload', { method: 'GET' });
              break;
            case 'notifications':
              response = await fetch('/api/notifications/status');
              break;
            case 'analytics':
              response = await fetch('/api/analytics?timeframe=7');
              break;
            case 'search':
              response = await fetch('/api/complaints/search?q=test&limit=1');
              break;
            case 'api':
              response = await fetch('/api/complaints?limit=1');
              break;
            default:
              throw new Error('Unknown service');
          }
          
          const responseTime = Date.now() - startTime;
          const isHealthy = response.ok;
          
          status = {
            name: service.charAt(0).toUpperCase() + service.slice(1),
            status: isHealthy ? 'healthy' : 'error',
            responseTime,
            lastChecked: new Date(),
            details: isHealthy ? 'Service operational' : `HTTP ${response.status}`,
            endpoint: response.url
          };
          
          // Add warning for slow response times
          if (isHealthy && responseTime > 2000) {
            status.status = 'warning';
            status.details = `Slow response: ${responseTime}ms`;
          }
          
        } catch (error) {
          status = {
            name: service.charAt(0).toUpperCase() + service.slice(1),
            status: 'error',
            lastChecked: new Date(),
            details: error instanceof Error ? error.message : 'Service unavailable'
          };
        }
        
        return { service, status };
      })
    );
    
    const health: Partial<SystemHealth> = {};
    
    healthChecks.forEach((result, index) => {
      const service = services[index];
      if (result.status === 'fulfilled') {
        health[service] = result.value.status;
      } else {
        health[service] = {
          name: service.charAt(0).toUpperCase() + service.slice(1),
          status: 'error',
          lastChecked: new Date(),
          details: 'Health check failed'
        };
      }
    });
    
    setSystemHealth(health as SystemHealth);
    setLastRefresh(new Date());
    setLoading(false);
  };

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'checking':
        return <Clock className="w-6 h-6 text-gray-600 animate-spin" />;
      default:
        return <Clock className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'healthy':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getOverallStatus = () => {
    if (!systemHealth) return 'checking';
    
    const statuses = Object.values(systemHealth).map(service => service.status);
    
    if (statuses.includes('error')) return 'error';
    if (statuses.includes('warning')) return 'warning';
    return 'healthy';
  };

  const ServiceCard = ({ service }: { service: ServiceStatus }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-lg border-2 ${getStatusColor(service.status)}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon(service.status)}
          <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
        </div>
        {service.responseTime && (
          <span className="text-sm text-gray-600">
            {service.responseTime}ms
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-700">{service.details}</p>
        <p className="text-xs text-gray-500">
          Last checked: {service.lastChecked.toLocaleTimeString()}
        </p>
        {service.endpoint && (
          <p className="text-xs text-gray-500 font-mono">
            {service.endpoint}
          </p>
        )}
      </div>
    </motion.div>
  );

  if (loading && !systemHealth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking system health...</p>
        </div>
      </div>
    );
  }

  const overallStatus = getOverallStatus();

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
              <Activity className="w-6 h-6 text-primary-600" />
              <h1 className="text-xl font-semibold text-gray-900">System Status</h1>
            </div>
            <button
              onClick={checkSystemHealth}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 p-6 rounded-lg border-2 ${getStatusColor(overallStatus)}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getStatusIcon(overallStatus)}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  SevaLink System Status
                </h2>
                <p className="text-gray-600">
                  {overallStatus === 'healthy' && 'All systems operational'}
                  {overallStatus === 'warning' && 'Some services experiencing issues'}
                  {overallStatus === 'error' && 'Service disruption detected'}
                  {overallStatus === 'checking' && 'Checking system health...'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Last updated</p>
              <p className="text-lg font-semibold text-gray-900">
                {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Service Status Grid */}
        {systemHealth && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard service={{
              ...systemHealth.database,
              name: 'Database Connection'
            }} />
            <ServiceCard service={{
              ...systemHealth.fileUpload,
              name: 'File Upload Service'
            }} />
            <ServiceCard service={{
              ...systemHealth.notifications,
              name: 'Notification System'
            }} />
            <ServiceCard service={{
              ...systemHealth.analytics,
              name: 'Analytics Engine'
            }} />
            <ServiceCard service={{
              ...systemHealth.search,
              name: 'Search Service'
            }} />
            <ServiceCard service={{
              ...systemHealth.api,
              name: 'API Gateway'
            }} />
          </div>
        )}

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white rounded-lg shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              href="/api/test-db"
              className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50"
            >
              <Database className="w-5 h-5 text-gray-600" />
              <span>Test Database</span>
            </Link>
            <Link 
              href="/api/analytics"
              className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50"
            >
              <BarChart3 className="w-5 h-5 text-gray-600" />
              <span>View Analytics</span>
            </Link>
            <Link 
              href="/dashboard"
              className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50"
            >
              <Activity className="w-5 h-5 text-gray-600" />
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/admin"
              className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50"
            >
              <Settings className="w-5 h-5 text-gray-600" />
              <span>Admin Panel</span>
            </Link>
          </div>
        </motion.div>

        {/* System Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-white rounded-lg shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Version Information</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>SevaLink v1.0.0</p>
                <p>Next.js 15.3.3</p>
                <p>Node.js Environment</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Environment</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Environment: Development</p>
                <p>Database: MongoDB</p>
                <p>File Storage: Cloudinary</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 