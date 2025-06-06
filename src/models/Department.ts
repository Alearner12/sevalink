import mongoose, { Document, Schema } from 'mongoose';

export interface IDepartment extends Document {
  name: string;
  shortName: string;
  email: string;
  phone: string;
  category: string;
  location: string[];
  responseTime: number; // hours
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema = new Schema<IDepartment>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  shortName: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['utilities', 'transportation', 'municipal', 'police', 'health', 'education', 'other']
  },
  location: [{
    type: String,
    required: true
  }],
  responseTime: {
    type: Number,
    required: true,
    default: 48
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Department || mongoose.model<IDepartment>('Department', DepartmentSchema); 