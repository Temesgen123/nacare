import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import LabResult from '../../../../models/LabResult';
import { getUserFromRequest } from '../../../../lib/auth';

// GET single lab result by ID
export async function GET(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const labResult = await LabResult.findById(params.id)
      .populate('patientId', 'fullName patientId phoneNumber')
      .populate('visitId', 'dateOfVisit visitedBy')
      .lean();

    if (!labResult) {
      return NextResponse.json(
        { error: 'Lab result not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ labResult });
  } catch (error) {
    console.error('Error fetching lab result:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lab result' },
      { status: 500 },
    );
  }
}

// PUT - Update lab result
export async function PUT(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();

    // Find existing lab result
    const existingLabResult = await LabResult.findById(params.id);
    if (!existingLabResult) {
      return NextResponse.json(
        { error: 'Lab result not found' },
        { status: 404 },
      );
    }

    // Prepare update data
    const updateData = {
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

      // Update timestamp
      updatedAt: new Date(),
    };

    // Update lab result
    const labResult = await LabResult.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('patientId', 'fullName patientId phoneNumber')
      .populate('visitId', 'dateOfVisit visitedBy');

    return NextResponse.json({
      message: 'Lab result updated successfully',
      labResult,
    });
  } catch (error) {
    console.error('Error updating lab result:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { error: `Validation error: ${messages.join(', ')}` },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update lab result' },
      { status: 500 },
    );
  }
}

// DELETE - Delete lab result
export async function DELETE(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins and doctors can delete lab results
    if (!['admin', 'doctor'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Only administrators and doctors can delete lab results' },
        { status: 403 },
      );
    }

    await connectDB();

    const labResult = await LabResult.findByIdAndDelete(params.id);

    if (!labResult) {
      return NextResponse.json(
        { error: 'Lab result not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: 'Lab result deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting lab result:', error);
    return NextResponse.json(
      { error: 'Failed to delete lab result' },
      { status: 500 },
    );
  }
}
