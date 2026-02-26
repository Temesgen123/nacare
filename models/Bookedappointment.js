import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    // Patient/User Information
    fullName: {
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
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    // Appointment Details
    appointmentType: {
      type: String,
      required: true,
      enum: [
        'Home Medical Checkup',
        'Lab Test',
        'Chronic Care',
        'Consultation',
        'Other',
      ],
      default: 'Home Medical Checkup',
    },
    preferredDate: {
      type: Date,
      required: true,
    },
    preferredTime: {
      type: String,
      required: true,
      enum: ['Morning (8AM-12PM)', 'Afternoon (12PM-4PM)', 'Evening (4PM-8PM)'],
    },

    // Address Information
    address: {
      subCity: { type: String, trim: true },
      landmark: { type: String, trim: true },
      specificAddress: { type: String, trim: true },
    },

    // Additional Information
    reasonForVisit: {
      type: String,
      trim: true,
    },
    medicalHistory: {
      type: String,
      trim: true,
    },

    // Booking Status
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending',
    },

    // Admin/Staff Notes
    staffNotes: {
      type: String,
      trim: true,
    },
    assignedTo: {
      type: String,
      trim: true,
    },

    // Confirmation
    confirmationCode: {
      type: String,
      unique: true,
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
// Generate confirmation code before saving
BookingSchema.pre('save', function (next) {
  if (!this.confirmationCode) {
    this.confirmationCode =
      'NAC' +
      Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

// Add indexes for better query performance
BookingSchema.index({ email: 1 });
BookingSchema.index({ phoneNumber: 1 });
BookingSchema.index({ confirmationCode: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ preferredDate: 1 });
BookingSchema.index({ createdAt: -1 });

export default mongoose.models.Bookedappointment ||
  mongoose.model('Bookedappointment', BookingSchema);
