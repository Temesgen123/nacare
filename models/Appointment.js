import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema(
  {
    // Patient reference — either linked to existing patient or walk-in
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      default: null,
    },

    // Used when patient is NOT in the system (walk-in / new patient)
    walkInPatient: {
      fullName: { type: String, trim: true },
      phoneNumber: { type: String, trim: true },
    },

    // Appointment Details
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String, // stored as "HH:MM" e.g. "09:30"
      required: true,
      trim: true,
    },
    duration: {
      type: Number, // minutes e.g. 15, 30, 45, 60
      default: 30,
    },
    type: {
      type: String,
      enum: [
        'General Consultation',
        'Follow-up',
        'Lab Result Review',
        'Medication Review',
        'Home Visit',
        'Emergency',
        'Other',
      ],
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },

    // Assignment
    assignedTo: {
      type: String, // staff/doctor name
      trim: true,
    },
    location: {
      type: String,
      enum: ['Clinic', 'Home Visit', 'Phone Consultation', 'Other'],
      default: 'Clinic',
    },

    // Status lifecycle
    status: {
      type: String,
      enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No-show'],
      default: 'Scheduled',
    },
    cancellationReason: {
      type: String,
      trim: true,
    },

    // Notes
    notes: {
      type: String,
      trim: true,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },

    // Metadata
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for common query patterns
AppointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 });
AppointmentSchema.index({ patientId: 1, appointmentDate: -1 });
AppointmentSchema.index({ status: 1, appointmentDate: 1 });
AppointmentSchema.index({ createdBy: 1 });

export default mongoose.models.Appointment ||
  mongoose.model('Appointment', AppointmentSchema);
