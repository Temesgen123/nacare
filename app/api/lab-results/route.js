import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import LabResult from '../../../models/LabResult';
import Patient from '../../../models/Patient';
import Visit from '../../../models/Visit';
import { getUserFromRequest } from '../../../lib/auth';

// GET all lab results or filter by patient
export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const visitId = searchParams.get('visitId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    let query = {};

    if (patientId) {
      query.patientId = patientId;
    }

    if (visitId) {
      query.visitId = visitId;
    }

    const labResults = await LabResult.find(query)
      .populate('patientId', 'fullName patientId phoneNumber')
      .populate('visitId', 'dateOfVisit visitedBy')
      .sort({ dateResultsReceived: -1, dateSampleCollected: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await LabResult.countDocuments(query);

    return NextResponse.json({
      labResults,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching lab results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lab results' },
      { status: 500 },
    );
  }
}

// POST - Create new lab result
export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.patientId) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 },
      );
    }

    // Verify patient exists
    const patient = await Patient.findById(body.patientId);
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Verify visit exists if visitId is provided
    if (body.visitId) {
      const visit = await Visit.findById(body.visitId);
      if (!visit) {
        return NextResponse.json({ error: 'Visit not found' }, { status: 404 });
      }

      // Verify visit belongs to the same patient
      if (visit.patientId.toString() !== body.patientId) {
        return NextResponse.json(
          { error: 'Visit does not belong to the selected patient' },
          { status: 400 },
        );
      }
    }

    // Prepare lab result data with all sections
    const labResultData = {
      // References
      patientId: body.patientId,
      visitId: body.visitId || null,

      // Section 3A: Laboratory Information
      labTests: {
        fbs: body.labTests?.fbs || false,
        rbs: body.labTests?.rbs || false,
        cbc: body.labTests?.cbc || false,
        lipidProfile: body.labTests?.lipidProfile || false,
        rft: body.labTests?.rft || false,
        other: body.labTests?.other || '',
      },
      labPartnerName: body.labPartnerName || '',
      dateSampleCollected: body.dateSampleCollected || null,
      dateResultsReceived: body.dateResultsReceived || null,

      // Section 3B: Key Results Summary
      abnormalResults: body.abnormalResults || '',
      criticalValuesPresent: body.criticalValuesPresent || false,

      // Section 3C: Doctor Review
      doctorReview: {
        assessment: body.doctorReview?.assessment || '',
        adviceGiven: body.doctorReview?.adviceGiven || '',
        referralRequired: body.doctorReview?.referralRequired || false,
        followUpPlanned: body.doctorReview?.followUpPlanned || false,
        doctorName: body.doctorReview?.doctorName || '',
      },
    };

    // Create new lab result
    const labResult = new LabResult(labResultData);

    await labResult.save();

    // Populate patient and visit data before returning
    await labResult.populate('patientId', 'fullName patientId phoneNumber');
    if (labResult.visitId) {
      await labResult.populate('visitId', 'dateOfVisit visitedBy');
    }

    return NextResponse.json(
      {
        message: 'Lab results recorded successfully',
        labResult,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating lab result:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { error: `Validation error: ${messages.join(', ')}` },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create lab result' },
      { status: 500 },
    );
  }
}
