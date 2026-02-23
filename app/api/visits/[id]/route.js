import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Visit from '../../../../models/Visit';
import Patient from '../../../../models/Patient';
import { getUserFromRequest } from '../../../../lib/auth';

// GET single visit by ID
export async function GET(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const visit = await Visit.findById(params.id)
      .populate('patientId', 'fullName patientId phoneNumber')
      .lean();

    if (!visit) {
      return NextResponse.json({ error: 'Visit not found' }, { status: 404 });
    }

    return NextResponse.json({ visit });
  } catch (error) {
    console.error('Error fetching visit:', error);

    if (error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid visit ID' }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch visit' },
      { status: 500 },
    );
  }
}

// PUT - Update existing visit
export async function PUT(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Check visit exists
    const existing = await Visit.findById(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Visit not found' }, { status: 404 });
    }

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

    const updatedData = {
      // Section 2A: Visit Details
      patientId: body.patientId,
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

    const visit = await Visit.findByIdAndUpdate(
      params.id,
      { $set: updatedData },
      { new: true, runValidators: true },
    ).populate('patientId', 'fullName patientId phoneNumber');

    return NextResponse.json({
      message: 'Visit updated successfully',
      visit,
    });
  } catch (error) {
    console.error('Error updating visit:', error);

    if (error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid visit ID' }, { status: 400 });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { error: `Validation error: ${messages.join(', ')}` },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update visit' },
      { status: 500 },
    );
  }
}

// DELETE - Remove a visit
export async function DELETE(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const visit = await Visit.findByIdAndDelete(params.id);

    if (!visit) {
      return NextResponse.json({ error: 'Visit not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Visit deleted successfully' });
  } catch (error) {
    console.error('Error deleting visit:', error);

    if (error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid visit ID' }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Failed to delete visit' },
      { status: 500 },
    );
  }
}
