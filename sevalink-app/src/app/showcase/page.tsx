'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Download, 
  Award, 
  Users, 
  TrendingUp, 
  Globe,
  Clock,
  Shield,
  Smartphone,
  BarChart3,
  CheckCircle,
  Star,
  Phone,
  Mail,
  Calendar,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Showcase() {
  const [isPlaying, setIsPlaying] = useState(false);

  const keyMetrics = [
    { label: 'Implementation Time', value: '4 Weeks', icon: Clock },
    { label: 'Departments Connected', value: '8+', icon: Shield },
    { label: 'Expected Daily Users', value: '10,000+', icon: Users },
    { label: 'Resolution Time Reduction', value: '60%', icon: TrendingUp },
    { label: 'Digital India Alignment', value: '100%', icon: Award },
    { label: 'Mobile Ready', value: 'Yes', icon: Smartphone }
  ];

  const features = [
    {
      title: 'Unified Portal',
      description: 'Single platform for all government departments',
      benefits: ['Reduced citizen confusion', 'Streamlined processes', 'Better user experience']
    },
    {
      title: 'Smart Routing',
      description: 'AI-powered automatic complaint categorization',
      benefits: ['Faster response times', 'Accurate department assignment', 'Reduced manual work']
    },
    {
      title: 'Real-time Tracking',
      description: 'Live status updates with SMS/Email notifications',
      benefits: ['Increased transparency', 'Better citizen satisfaction', 'Reduced follow-up calls']
    },
    {
      title: 'Public Dashboard',
      description: 'Transparent performance metrics for accountability',
      benefits: ['Government transparency', 'Performance monitoring', 'Public trust building']
    },
    {
      title: 'Mobile-First Design',
      description: 'PWA with offline capability for rural connectivity',
      benefits: ['Rural accessibility', 'Low bandwidth support', 'App-like experience']
    },
    {
      title: 'Multi-language Support',
      description: 'Hindi and English interfaces for all citizens',
      benefits: ['Language inclusivity', 'Wider adoption', 'Cultural sensitivity']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                  SevaLink
                  <span className="block text-3xl md:text-4xl text-blue-600 font-hindi">सेवालिंक</span>
                </h1>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
                Digital Transformation for Bihar Government
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                A comprehensive citizen complaint portal designed to revolutionize government service delivery 
                through technology, transparency, and accountability.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => setIsPlaying(true)}
                className="btn-primary text-lg px-8 py-4"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
              <Link href="/dashboard" className="btn-secondary text-lg px-8 py-4">
                <BarChart3 className="w-5 h-5 mr-2" />
                Live Dashboard
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Project Overview & Impact
            </h2>
            <p className="text-lg text-gray-600">
              Key metrics and expected outcomes from SevaLink implementation
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {keyMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <metric.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Platform Features & Benefits
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive solution addressing all aspects of citizen service delivery
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Government Service Delivery?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join us in revolutionizing citizen-government interaction through SevaLink. 
              Let's build a more transparent, efficient, and accessible government together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/admin" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                <Shield className="w-5 h-5 mr-2 inline" />
                Admin Demo
              </Link>
              <Link href="/complaints/new" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                <FileText className="w-5 h-5 mr-2 inline" />
                Try Platform
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center text-blue-100">
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                <span>+91-612-2234567</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                <span>sevalink@bihar.gov.in</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>Schedule Demo</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Modal */}
      {isPlaying && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setIsPlaying(false)}>
          <div className="bg-white rounded-lg p-4 max-w-4xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">SevaLink Platform Demo</h3>
              <button onClick={() => setIsPlaying(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Demo video would play here</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 