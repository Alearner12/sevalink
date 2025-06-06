import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  role: 'admin' | 'department_admin' | 'citizen';
  department?: mongoose.Types.ObjectId;
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'department_admin', 'citizen'],
    default: 'citizen'
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Department'
  },
  permissions: [{
    type: String,
    enum: ['view_complaints', 'update_status', 'respond', 'escalate', 'view_analytics', 'manage_users']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster searches
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ department: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 