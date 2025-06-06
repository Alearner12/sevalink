import Link from 'next/link'
import { 
  FileText, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Users,
  TrendingUp,
  Activity
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8" />
                <div>
                  <h1 className="text-2xl font-bold">SevaLink</h1>
                  <p className="text-sm opacity-90 font-hindi">सेवालिंक</p>
                </div>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/complaints/new" className="hover:text-blue-200 transition-colors">
                File Complaint
              </Link>
              <Link href="/complaints/track" className="hover:text-blue-200 transition-colors">
                Track Status
              </Link>
              <Link href="/dashboard" className="hover:text-blue-200 transition-colors">
                Dashboard
              </Link>
              <Link href="/admin" className="hover:text-blue-200 transition-colors">
                Admin Login
              </Link>
              <Link href="/showcase" className="hover:text-blue-200 transition-colors">
                Demo
              </Link>
              <Link href="/system-status" className="hover:text-blue-200 transition-colors">
                System Status
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Connecting Citizens to 
              <span className="text-primary-600"> Government Services</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              File, track, and resolve complaints across all government departments in a single, unified portal. 
              Your voice matters, and we ensure it's heard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/complaints/new" className="btn-primary text-lg px-8 py-3">
                <FileText className="w-5 h-5 mr-2 inline" />
                File a Complaint
              </Link>
              <Link href="/complaints/track" className="btn-secondary text-lg px-8 py-3">
                <Search className="w-5 h-5 mr-2 inline" />
                Track Complaint
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose SevaLink?
            </h2>
            <p className="text-lg text-gray-600">
              Experience the future of citizen-government interaction
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Unified Portal</h3>
              <p className="text-gray-600">
                Single platform for all government departments - no more juggling multiple websites
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Tracking</h3>
              <p className="text-gray-600">
                Track your complaint status with live updates via SMS and email notifications
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 bg-saffron-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-saffron-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Routing</h3>
              <p className="text-gray-600">
                AI-powered system automatically routes complaints to the right department
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Department Categories */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Government Departments
            </h2>
            <p className="text-lg text-gray-600">
              File complaints across all major government services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Electricity (BSEB)', icon: '⚡', category: 'electricity' },
              { name: 'Railways', icon: '🚂', category: 'railways' },
              { name: 'Municipal Services', icon: '🏛️', category: 'municipal' },
              { name: 'Police', icon: '👮', category: 'police' },
              { name: 'Water Supply', icon: '💧', category: 'water' },
              { name: 'Roads & Transport', icon: '🛣️', category: 'roads' },
              { name: 'Health Services', icon: '🏥', category: 'health' },
              { name: 'Education', icon: '📚', category: 'education' }
            ].map((dept) => (
              <Link 
                key={dept.category}
                href={`/complaints/new?category=${dept.category}`}
                className="card hover:shadow-lg transition-shadow cursor-pointer text-center"
              >
                <div className="text-3xl mb-3">{dept.icon}</div>
                <h3 className="font-semibold text-gray-900">{dept.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="gradient-bg text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Making a Difference
            </h2>
            <p className="text-lg opacity-90">
              Real impact through digital governance
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1,000+</div>
              <div className="text-blue-200">Complaints Filed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">85%</div>
              <div className="text-blue-200">Resolution Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24hrs</div>
              <div className="text-blue-200">Avg Response Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">8</div>
              <div className="text-blue-200">Departments Connected</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6" />
                <span className="text-xl font-bold">SevaLink</span>
              </div>
              <p className="text-gray-400">
                Connecting citizens to government services with transparency and efficiency.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/complaints/new" className="block text-gray-400 hover:text-white">
                  File Complaint
                </Link>
                <Link href="/complaints/track" className="block text-gray-400 hover:text-white">
                  Track Status
                </Link>
                <Link href="/dashboard" className="block text-gray-400 hover:text-white">
                  Public Dashboard
                </Link>
                <Link href="/system-status" className="block text-gray-400 hover:text-white">
                  System Status
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Departments</h3>
              <div className="space-y-2 text-gray-400">
                <div>Bihar State Electricity Board</div>
                <div>Indian Railways</div>
                <div>Patna Municipal Corporation</div>
                <div>Bihar Police</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+91-612-2234567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>help@sevalink.gov.in</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Patna, Bihar, India</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <Link href="/system-status" className="hover:text-white">
                    System Status
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SevaLink. All rights reserved. Built for transparent governance.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
