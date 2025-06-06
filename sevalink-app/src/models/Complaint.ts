import mongoose, { Document, Schema } from 'mongoose';

export interface IComplaint extends Document {
  complaintId: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'under_review' | 'in_progress' | 'resolved' | 'closed';
  citizen: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  department: {
    id: mongoose.Types.ObjectId;
    name: string;
    assignedOfficer?: string;
  };
  location: {
    pincode: string;
    district: string;
    state: string;
  };
  attachments: string[];
  tags: string[];
  timeline: Array<{
    status: string;
    timestamp: Date;
    note: string;
    updatedBy?: mongoose.Types.ObjectId;
  }>;
  escalations: Array<{
    level: number;
    timestamp: Date;
    reason: string;
    escalatedTo: mongoose.Types.ObjectId;
  }>;
  citizenRating?: number;
  citizenFeedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema = new Schema<IComplaint>({
  complaintId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: ['electricity', 'water', 'roads', 'railways', 'police', 'municipal', 'health', 'education', 'other']
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    required: true,
    enum: ['new', 'under_review', 'in_progress', 'resolved', 'closed'],
    default: 'new'
  },
  citizen: {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true }
  },
  department: {
    id: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    name: { type: String, required: true },
    assignedOfficer: { type: String, trim: true }
  },
  location: {
    pincode: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true, default: 'Bihar' }
  },
  attachments: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  timeline: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  }],
  escalations: [{
    level: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    reason: { type: String, required: true },
    escalatedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  }],
  citizenRating: {
    type: Number,
    min: 1,
    max: 5
  },
  citizenFeedback: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Index for faster searches
ComplaintSchema.index({ complaintId: 1 });
ComplaintSchema.index({ status: 1 });
ComplaintSchema.index({ category: 1 });
ComplaintSchema.index({ 'citizen.email': 1 });
ComplaintSchema.index({ 'department.id': 1 });
ComplaintSchema.index({ createdAt: -1 });

export default mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', ComplaintSchema); 