import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Patient from '../../../../models/Patient';
import { getUserFromRequest } from '../../../../lib/auth';

// GET single patient by ID
export async function GET(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const patient = await Patient.findById(params.id).lean();

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({ patient });
  } catch (error) {
    console.error('Error fetching patient:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient' },
      { status: 500 },
    );
  }
}

// PUT - Update patient
export async function PUT(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();

    // Find existing patient
    const existingPatient = await Patient.findById(params.id);
    if (!existingPatient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Validate required fields
    if (!body.patientId || !body.fullName || !body.phoneNumber) {
      return NextResponse.json(
        { error: 'Patient ID, full name, and phone number are required' },
        { status: 400 },
      );
    }

    // Check if patient ID is being changed and if it conflicts
    if (body.patientId !== existingPatient.patientId) {
      const conflictingPatientId = await Patient.findOne({
        patientId: body.patientId,
        _id: { $ne: params.id },
      });

      if (conflictingPatientId) {
        return NextResponse.json(
          { error: 'A patient with this Patient ID already exists' },
          { status: 400 },
        );
      }
    }

    // Check if phone number is being changed and if it conflicts
    if (body.phoneNumber !== existingPatient.phoneNumber) {
      const conflictingPhone = await Patient.findOne({
        phoneNumber: body.phoneNumber,
        _id: { $ne: params.id },
      });

      if (conflictingPhone) {
        return NextResponse.json(
          { error: 'A patient with this phone number already exists' },
          { status: 400 },
        );
      }
    }

    // Prepare update data
    const updateData = {
      // Section 1A: Patient Identification
      patientId: body.patientId,
      fullName: body.fullName,
      sex: body.sex || '',
      dateOfBirth: body.dateOfBirth || null,
      age: body.age || null,
      phoneNumber: body.phoneNumber,
      address: body.address || '',
      emergencyContact: {
        name: body.emergencyContact?.name || '',
        phone: body.emergencyContact?.phone || '',
      },

      // Section 1B: Past Medical History
      pastMedicalHistory: {
        hypertension: body.pastMedicalHistory?.hypertension || false,
        diabetesMellitus: body.pastMedicalHistory?.diabetesMellitus || false,
        heartDisease: body.pastMedicalHistory?.heartDisease || false,
        asthmaOrCOPD: body.pastMedicalHistory?.asthmaOrCOPD || false,
        chronicKidneyDisease:
          body.pastMedicalHistory?.chronicKidneyDisease || false,
        other: body.pastMedicalHistory?.other || '',
      },
      pastSurgeries: body.pastSurgeries || '',
      hospitalAdmissionLast12Months:
        body.hospitalAdmissionLast12Months || false,

      // Section 1C: Medication History
      medicationHistory: {
        currentMedications: body.medicationHistory?.currentMedications || '',
        adherence: body.medicationHistory?.adherence || '',
        drugAllergy: body.medicationHistory?.drugAllergy || false,
        allergyDetails: body.medicationHistory?.allergyDetails || '',
      },

      // Section 1D: Social History
      socialHistory: {
        smoking: body.socialHistory?.smoking || false,
        alcoholUse: body.socialHistory?.alcoholUse || false,
        physicalActivityLevel: body.socialHistory?.physicalActivityLevel || '',
      },

      // Section 4: Consent
      consentGiven: body.consentGiven,

      // Update timestamp
      updatedAt: new Date(),
    };

    // Update patient
    const patient = await Patient.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({
      message: 'Patient updated successfully',
      patient,
    });
  } catch (error) {
    console.error('Error updating patient:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { error: `Validation error: ${messages.join(', ')}` },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update patient' },
      { status: 500 },
    );
  }
}

// DELETE - Delete patient
export async function DELETE(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can delete patients
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only administrators can delete patients' },
        { status: 403 },
      );
    }

    await connectDB();

    const patient = await Patient.findByIdAndDelete(params.id);

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Patient deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting patient:', error);
    return NextResponse.json(
      { error: 'Failed to delete patient' },
      { status: 500 },
    );
  }
}
