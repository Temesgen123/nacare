import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Patient from '../../../models/Patient';
import { getUserFromRequest } from '../../../lib/auth';

// GET all patients or search
export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
      query = {
        $or: [
          { patientId: { $regex: search, $options: 'i' } },
          { fullName: { $regex: search, $options: 'i' } },
          { phoneNumber: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const patients = await Patient.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Patient.countDocuments(query);

    return NextResponse.json({
      patients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 },
    );
  }
}

// POST - Create new patient
export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();

    // Validate required fields (patientId, fullName, phoneNumber are required)
    if (!body.patientId || !body.fullName || !body.phoneNumber) {
      return NextResponse.json(
        { error: 'Patient ID, full name, and phone number are required' },
        { status: 400 },
      );
    }

    // Validate consent is given
    if (!body.consentGiven) {
      return NextResponse.json(
        { error: 'Patient consent is required' },
        { status: 400 },
      );
    }

    // Check if patient ID already exists
    const existingPatientById = await Patient.findOne({
      patientId: body.patientId,
    });
    if (existingPatientById) {
      return NextResponse.json(
        { error: 'A patient with this Patient ID already exists' },
        { status: 400 },
      );
    }

    // Check if phone number already exists
    const existingPatientByPhone = await Patient.findOne({
      phoneNumber: body.phoneNumber,
    });
    if (existingPatientByPhone) {
      return NextResponse.json(
        { error: 'A patient with this phone number already exists' },
        { status: 400 },
      );
    }

    // Prepare patient data with all sections
    const patientData = {
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

      // Metadata — JWT payload contains: { userId, username, role, fullName }
      createdBy: user.userId,
    };

    // Create new patient
    const patient = new Patient(patientData);

    await patient.save();

    return NextResponse.json(
      {
        message: 'Patient registered successfully',
        patient,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating patient:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { error: `Validation error: ${messages.join(', ')}` },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create patient' },
      { status: 500 },
    );
  }
}
