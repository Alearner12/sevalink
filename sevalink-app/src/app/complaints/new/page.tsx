'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';
import { FileText, ArrowLeft, AlertCircle, CheckCircle, Upload, X, Image, FileIcon } from 'lucide-react';

export default function NewComplaint() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    citizen: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    location: {
      pincode: '',
      district: 'Patna',
      state: 'Bihar'
    },
    attachments: [] as string[]
  });

  const categories = [
    { value: 'electricity', label: 'Electricity (BSEB)', icon: '⚡' },
    { value: 'water', label: 'Water Supply', icon: '💧' },
    { value: 'railways', label: 'Railways', icon: '🚂' },
    { value: 'roads', label: 'Roads & Transport', icon: '🛣️' },
    { value: 'municipal', label: 'Municipal Services', icon: '🏛️' },
    { value: 'police', label: 'Police', icon: '👮' },
    { value: 'health', label: 'Health Services', icon: '🏥' },
    { value: 'education', label: 'Education', icon: '📚' },
    { value: 'other', label: 'Other', icon: '📋' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
  ];

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    
    for (const file of acceptedFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
          setUploadedFiles(prev => [...prev, {
            url: result.url,
            fileName: result.fileName,
            fileSize: result.fileSize,
            fileType: result.fileType
          }]);
          
          setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, result.url]
          }));
        } else {
          setError(`Failed to upload ${file.name}: ${result.error}`);
        }
      } catch (error) {
        setError(`Error uploading ${file.name}`);
      }
    }
    
    setUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Complaint filed successfully! Your complaint ID is: ${data.complaintId}`);
        setTimeout(() => {
          router.push(`/complaints/track?id=${data.complaintId}`);
        }, 3000);
      } else {
        setError(data.error || 'Failed to file complaint');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
              <FileText className="w-6 h-6 text-primary-600" />
              <h1 className="text-xl font-semibold text-gray-900">File New Complaint</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-green-800">{success}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Complaint Details */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Complaint Details</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Department/Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                >
                  <option value="">Select Department</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Complaint Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  maxLength={200}
                  placeholder="Brief description of your complaint"
                  className="input-field"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  maxLength={2000}
                  placeholder="Please provide detailed information about your complaint..."
                  className="input-field"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.description.length}/2000 characters
                </p>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  {priorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Supporting Documents & Photos</h2>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isDragActive ? 'Drop files here' : 'Upload Evidence Files'}
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop files here, or click to select files
              </p>
              <p className="text-sm text-gray-500">
                Supported: Images (JPEG, PNG, WebP), Documents (PDF, DOC, DOCX) • Max 10MB per file
              </p>
            </div>

            {uploading && (
              <div className="mt-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mr-2"></div>
                <span className="text-gray-600">Uploading files...</span>
              </div>
            )}

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Uploaded Files</h3>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        {file.fileType.startsWith('image/') ? (
                          <Image className="w-5 h-5 text-green-600 mr-3" />
                        ) : (
                          <FileIcon className="w-5 h-5 text-blue-600 mr-3" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.fileName}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.fileSize)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-700"
                        aria-label={`Remove file ${file.fileName}`}
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Personal Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="citizen.name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="citizen.name"
                  name="citizen.name"
                  value={formData.citizen.name}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="citizen.email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="citizen.email"
                  name="citizen.email"
                  value={formData.citizen.email}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="citizen.phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="citizen.phone"
                  name="citizen.phone"
                  value={formData.citizen.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+91-9876543210"
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="location.pincode" className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  id="location.pincode"
                  name="location.pincode"
                  value={formData.location.pincode}
                  onChange={handleInputChange}
                  required
                  pattern="[0-9]{6}"
                  placeholder="800001"
                  className="input-field"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="citizen.address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  id="citizen.address"
                  name="citizen.address"
                  value={formData.citizen.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  placeholder="Your complete address"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/" className="btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || uploading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Filing Complaint...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  File Complaint
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 