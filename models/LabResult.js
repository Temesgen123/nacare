import mongoose from 'mongoose';

const LabResultSchema = new mongoose.Schema(
  {
    // References
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    visitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Visit',
      default: null,
    },

    // Section 3A: Laboratory Information
    labTests: {
      fbs: { type: Boolean, default: false },
      rbs: { type: Boolean, default: false },
      cbc: { type: Boolean, default: false },
      lipidProfile: { type: Boolean, default: false },
      rft: { type: Boolean, default: false },
      other: { type: String, trim: true },
    },
    labPartnerName: {
      type: String,
      trim: true,
    },
    dateSampleCollected: {
      type: Date,
    },
    dateResultsReceived: {
      type: Date,
    },

    // Section 3B: Key Results Summary
    abnormalResults: {
      type: String,
      trim: true,
    },
    criticalValuesPresent: {
      type: Boolean,
      default: false,
    },

    // Section 3C: Doctor Review
    doctorReview: {
      assessment: {
        type: String,
        trim: true,
      },
      adviceGiven: {
        type: String,
        trim: true,
      },
      referralRequired: {
        type: Boolean,
        default: false,
      },
      followUpPlanned: {
        type: Boolean,
        default: false,
      },
      doctorName: {
        type: String,
        trim: true,
      },
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
LabResultSchema.index({ patientId: 1, dateResultsReceived: -1 });
LabResultSchema.index({ visitId: 1 });
LabResultSchema.index({ dateSampleCollected: -1 });
LabResultSchema.index({ dateResultsReceived: -1 });

export default mongoose.models.LabResult ||
  mongoose.model('LabResult', LabResultSchema);
