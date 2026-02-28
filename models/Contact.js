import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema(
  {
    // Contact Information
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },

    // Message Details
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Status & Management
    status: {
      type: String,
      enum: ['New', 'Read', 'Replied', 'Archived'],
      default: 'New',
    },
    isRead: {
      type: Boolean,
      default: false,
    },

    // Admin Notes
    adminNotes: {
      type: String,
      trim: true,
    },
    repliedBy: {
      type: String,
      trim: true,
    },
    repliedAt: {
      type: Date,
    },

    // Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Add indexes for better query performance
ContactSchema.index({ email: 1 });
ContactSchema.index({ status: 1 });
ContactSchema.index({ isRead: 1 });
ContactSchema.index({ createdAt: -1 });

export default mongoose.models.Contact ||
  mongoose.model('Contact', ContactSchema);
