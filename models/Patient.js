import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  // Section 1A: Patient Identification
  patientId: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true
  },
  fullName: { 
    type: String, 
    required: true,
    trim: true
  },
  sex: { 
    type: String, 
    enum: ['Male', 'Female'], 
    required: true 
  },
  dateOfBirth: { 
    type: Date 
  },
  age: { 
    type: Number 
  },
  phoneNumber: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String,
    trim: true
  },
  emergencyContact: {
    name: { type: String },
    phone: { type: String }
  },
  
  // Section 1B: Past Medical History
  pastMedicalHistory: {
    hypertension: { type: Boolean, default: false },
    diabetesMellitus: { type: Boolean, default: false },
    heartDisease: { type: Boolean, default: false },
    asthmaOrCOPD: { type: Boolean, default: false },
    chronicKidneyDisease: { type: Boolean, default: false },
    other: { type: String }
  },
  pastSurgeries: { 
    type: String 
  },
  hospitalAdmissionLast12Months: { 
    type: Boolean,
    default: false
  },
  
  // Section 1C: Medication History
  medicationHistory: {
    currentMedications: { type: String },
    adherence: { 
      type: String, 
      enum: ['Good', 'Poor', 'Irregular', ''] 
    },
    drugAllergy: { type: Boolean, default: false },
    allergyDetails: { type: String }
  },
  
  // Section 1D: Social History
  socialHistory: {
    smoking: { type: Boolean, default: false },
    alcoholUse: { type: Boolean, default: false },
    physicalActivityLevel: { 
      type: String, 
      enum: ['Low', 'Moderate', 'High', ''] 
    }
  },
  
  // Section 4: Consent
  consentGiven: { 
    type: Boolean, 
    required: true,
    default: false
  },
  consentDate: { 
    type: Date, 
    default: Date.now 
  },
  
  // Metadata
  createdBy: {
    type: String,
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Index for faster searches
PatientSchema.index({ patientId: 1 });
PatientSchema.index({ fullName: 1 });
PatientSchema.index({ phoneNumber: 1 });

// Auto-generate patient ID if not provided
PatientSchema.pre('save', async function(next) {
  if (!this.patientId) {
    const count = await mongoose.model('Patient').countDocuments();
    this.patientId = `NAC${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);
