import mongoose from 'mongoose';

const VisitSchema = new mongoose.Schema(
  {
    // Reference to Patient
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },

    // Section 2A: Visit Details
    dateOfVisit: {
      type: Date,
      required: true,
    },
    visitedBy: {
      type: String,
      required: true,
      trim: true,
    },

    // Section 2B: Vital Signs
    vitalSigns: {
      bloodPressure: {
        type: String,
        trim: true,
      },
      pulseRate: {
        type: Number,
      },
      randomBloodSugar: {
        type: Number,
      },
      weight: {
        type: Number,
      },
    },

    // Section 2C: General Examination
    generalExamination: {
      generalAppearance: {
        type: String,
        enum: ['Well', 'Ill', 'Distressed', ''],
        default: '',
      },
      pallor: {
        type: Boolean,
        default: false,
      },
      edema: {
        type: Boolean,
        default: false,
      },
    },

    // Section 2D: System Review
    systemReview: {
      cardiovascularSystem: {
        type: String,
        enum: ['Normal', 'Abnormal', ''],
        default: '',
      },
      respiratorySystem: {
        type: String,
        enum: ['Normal', 'Abnormal', ''],
        default: '',
      },
      abdomen: {
        type: String,
        enum: ['Normal', 'Abnormal', ''],
        default: '',
      },
      cns: {
        type: String,
        enum: ['Normal', 'Abnormal', ''],
        default: '',
      },
      abnormalFindings: {
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
VisitSchema.index({ patientId: 1, dateOfVisit: -1 });
VisitSchema.index({ dateOfVisit: -1 });

export default mongoose.models.Visit || mongoose.model('Visit', VisitSchema);
