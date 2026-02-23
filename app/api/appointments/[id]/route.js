import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Appointment from '../../../../models/Appointment';
import Patient from '../../../../models/Patient';
import { getUserFromRequest } from '../../../../lib/auth';

// GET single appointment by ID
export async function GET(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const appointment = await Appointment.findById(params.id)
      .populate(
        'patientId',
        'fullName patientId phoneNumber sex dateOfBirth age',
      )
      .lean();

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 },
      );
    }

    // 'user' role can only view their own appointments
    if (
      user.role === 'user' &&
      String(appointment.createdBy) !== String(user.userId)
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid appointment ID' },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch appointment' },
      { status: 500 },
    );
  }
}

// PUT — Update appointment
export async function PUT(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const existing = await Appointment.findById(params.id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 },
      );
    }

    // 'user' role can only edit their own appointments
    if (
      user.role === 'user' &&
      String(existing.createdBy) !== String(user.userId)
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    if (!body.appointmentDate || !body.appointmentTime || !body.type) {
      return NextResponse.json(
        { error: 'Appointment date, time, and type are required' },
        { status: 400 },
      );
    }

    if (
      !body.patientId &&
      (!body.walkInPatient?.fullName || !body.walkInPatient?.phoneNumber)
    ) {
      return NextResponse.json(
        {
          error:
            'Either select an existing patient or provide walk-in name and phone number',
        },
        { status: 400 },
      );
    }

    if (body.patientId) {
      const patient = await Patient.findById(body.patientId);
      if (!patient) {
        return NextResponse.json(
          { error: 'Patient not found' },
          { status: 404 },
        );
      }
    }

    // Conflict check — exclude current appointment
    if (body.assignedTo) {
      const conflict = await Appointment.findOne({
        _id: { $ne: params.id },
        appointmentDate: new Date(body.appointmentDate),
        appointmentTime: body.appointmentTime,
        assignedTo: body.assignedTo,
        status: { $in: ['Scheduled', 'Confirmed'] },
      });
      if (conflict) {
        return NextResponse.json(
          {
            error: `${body.assignedTo} already has an appointment at this time`,
          },
          { status: 409 },
        );
      }
    }

    const updatedData = {
      patientId: body.patientId || null,
      walkInPatient: body.patientId
        ? { fullName: '', phoneNumber: '' }
        : {
            fullName: body.walkInPatient?.fullName || '',
            phoneNumber: body.walkInPatient?.phoneNumber || '',
          },
      appointmentDate: new Date(body.appointmentDate),
      appointmentTime: body.appointmentTime,
      duration: body.duration || 30,
      type: body.type,
      reason: body.reason || '',
      assignedTo: body.assignedTo || '',
      location: body.location || 'Clinic',
      status: body.status || 'Scheduled',
      cancellationReason:
        body.status === 'Cancelled' ? body.cancellationReason || '' : '',
      notes: body.notes || '',
      reminderSent: body.reminderSent || false,
    };

    const appointment = await Appointment.findByIdAndUpdate(
      params.id,
      { $set: updatedData },
      { new: true, runValidators: true },
    ).populate(
      'patientId',
      'fullName patientId phoneNumber sex dateOfBirth age',
    );

    return NextResponse.json({
      message: 'Appointment updated successfully',
      appointment,
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid appointment ID' },
        { status: 400 },
      );
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json(
        { error: `Validation error: ${messages.join(', ')}` },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to update appointment' },
      { status: 500 },
    );
  }
}

// DELETE — Remove appointment
export async function DELETE(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // 'user' role can only delete their own appointments
    const appointmentToDelete = await Appointment.findById(params.id);
    if (!appointmentToDelete) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 },
      );
    }
    if (
      user.role === 'user' &&
      String(appointmentToDelete.createdBy) !== String(user.userId)
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await appointmentToDelete.deleteOne();
    return NextResponse.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid appointment ID' },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 },
    );
  }
}
