import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Visit from '../../../models/Visit';
import Patient from '../../../models/Patient';
import { getUserFromRequest } from '../../../lib/auth';

// GET all visits — filterable by patientId, searchable by patient name/ID/phone
export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by specific patient
    if (patientId) {
      query.patientId = patientId;
    }

    // If a search term is given, find matching patients first then filter visits
    if (search) {
      const matchingPatients = await Patient.find({
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { patientId: { $regex: search, $options: 'i' } },
          { phoneNumber: { $regex: search, $options: 'i' } },
        ],
      })
        .select('_id')
        .lean();

      query.patientId = { $in: matchingPatients.map((p) => p._id) };
    }

    const visits = await Visit.find(query)
      .populate('patientId', 'fullName patientId phoneNumber')
      .sort({ dateOfVisit: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Visit.countDocuments(query);

    return NextResponse.json({
      visits,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching visits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visits' },
      { status: 500 },
    );
  }
}

// POST - Create new visit
export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.patientId || !body.dateOfVisit || !body.visitedBy) {
      return NextResponse.json(
        { error: 'Patient, date of visit, and visited by are required' },
        { status: 400 },
      );
    }

    // Verify patient exists
    const patient = await Patient.findById(body.patientId);
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const visitData = {
      // References
      patientId: body.patientId,

      // Section 2A: Visit Details
      dateOfVisit: body.dateOfVisit,
      visitedBy: body.visitedBy,

      // Section 2B: Vital Signs
      vitalSigns: {
        bloodPressure: body.vitalSigns?.bloodPressure || '',
        pulseRate: body.vitalSigns?.pulseRate
          ? parseFloat(body.vitalSigns.pulseRate)
          : null,
        randomBloodSugar: body.vitalSigns?.randomBloodSugar
          ? parseFloat(body.vitalSigns.randomBloodSugar)
          : null,
        weight: body.vitalSigns?.weight
          ? parseFloat(body.vitalSigns.weight)
          : null,
      },

      // Section 2C: General Examination
      generalExamination: {
        generalAppearance: body.generalExamination?.generalAppearance || '',
        pallor: body.generalExamination?.pallor || false,
        edema: body.generalExamination?.edema || false,
      },

      // Section 2D: System Review
      systemReview: {
        cardiovascularSystem: body.systemReview?.cardiovascularSystem || '',
        respiratorySystem: body.systemReview?.respiratorySystem || '',
        abdomen: body.systemReview?.abdomen || '',
        cns: body.systemReview?.cns || '',
        abnormalFindings: body.systemReview?.abnormalFindings || '',
      },
    };

    const visit = new Visit(visitData);
    await visit.save();

    await visit.populate('patientId', 'fullName patientId phoneNumber');

    return NextResponse.json(
      {
        message: 'Visit recorded successfully',
        visit,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating visit:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { error: `Validation error: ${messages.join(', ')}` },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create visit' },
      { status: 500 },
    );
  }
}
