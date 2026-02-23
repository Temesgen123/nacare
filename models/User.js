import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      // 'user' = self-registered, read-only access (no dashboard)
      // All other roles are assigned by an admin
      enum: ['user', 'admin', 'doctor', 'nurse', 'staff'],
      required: true,
      default: 'user',
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // provides createdAt + updatedAt automatically
  },
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
