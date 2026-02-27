import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Appointment from '../../../../models/Appointment';
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
      .populate('patientId', 'fullName patientId phoneNumber email address')
      .lean();

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 },
      );
    }

    // Check if user has permission to view this appointment
    if (user.role === 'user' && appointment.createdBy !== user.username) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment' },
      { status: 500 },
    );
  }
}

// PUT - Update appointment
export async function PUT(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();

    // Find existing appointment
    const existingAppointment = await Appointment.findById(params.id);

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 },
      );
    }

    // Check permissions
    if (
      user.role === 'user' &&
      existingAppointment.createdBy !== user.username
    ) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Prevent modification of completed appointments unless changing to another final state
    if (
      existingAppointment.status === 'Completed' &&
      body.status !== 'Completed'
    ) {
      // Allow only status changes for completed appointments
      if (Object.keys(body).length > 1 || !body.status) {
        return NextResponse.json(
          { error: 'Cannot modify completed appointments except status' },
          { status: 400 },
        );
      }
    }

    // Validate date/time if being changed
    if (body.appointmentDate && body.appointmentTime) {
      const appointmentDateTime = new Date(
        `${body.appointmentDate}T${body.appointmentTime}`,
      );
      const now = new Date();

      if (appointmentDateTime < now && body.status !== 'Completed') {
        return NextResponse.json(
          { error: 'Appointment date and time cannot be in the past' },
          { status: 400 },
        );
      }
    }

    // Check for conflicts if rescheduling
    if (
      (body.appointmentDate || body.appointmentTime || body.assignedTo) &&
      body.status !== 'Cancelled'
    ) {
      const checkDate =
        body.appointmentDate || existingAppointment.appointmentDate;
      const checkTime =
        body.appointmentTime || existingAppointment.appointmentTime;
      const checkAssignedTo = body.assignedTo || existingAppointment.assignedTo;

      if (checkAssignedTo) {
        const conflictingAppointment = await Appointment.findOne({
          _id: { $ne: params.id },
          appointmentDate: checkDate,
          appointmentTime: checkTime,
          assignedTo: checkAssignedTo,
          status: { $in: ['Scheduled', 'Confirmed'] },
        });

        if (conflictingAppointment) {
          return NextResponse.json(
            {
              error: `${checkAssignedTo} already has an appointment at this time`,
            },
            { status: 400 },
          );
        }
      }
    }

    // Prepare update data
    const updateData = {
      updatedAt: new Date(),
    };

    // Update only provided fields
    if (body.appointmentDate !== undefined)
      updateData.appointmentDate = body.appointmentDate;
    if (body.appointmentTime !== undefined)
      updateData.appointmentTime = body.appointmentTime;
    if (body.duration !== undefined) updateData.duration = body.duration;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.reason !== undefined) updateData.reason = body.reason;
    if (body.assignedTo !== undefined) updateData.assignedTo = body.assignedTo;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.cancellationReason !== undefined)
      updateData.cancellationReason = body.cancellationReason;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.reminderSent !== undefined)
      updateData.reminderSent = body.reminderSent;

    // Update walk-in patient data if provided
    if (body.walkInPatient) {
      updateData.walkInPatient = {
        fullName: body.walkInPatient.fullName,
        phoneNumber: body.walkInPatient.phoneNumber,
      };
    }

    // Update appointment
    const appointment = await Appointment.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true },
    ).populate('patientId', 'fullName patientId phoneNumber');

    if (!appointment) {
      return NextResponse.json(
        { error: 'Failed to update appointment' },
        { status: 500 },
      );
    }

    // TODO: Send notification if status changed
    // TODO: Send new reminder if rescheduled

    return NextResponse.json({
      message: 'Appointment updated successfully',
      appointment,
    });
  } catch (error) {
    console.error('Error updating appointment:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { error: `Validation error: ${messages.join(', ')}` },
        { status: 400 },
      );
    }

    // Handle cast errors
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid appointment ID format' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update appointment' },
      { status: 500 },
    );
  }
}

// DELETE - Cancel/Delete appointment
export async function DELETE(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const appointment = await Appointment.findById(params.id);

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 },
      );
    }

    // Check permissions
    if (user.role === 'user' && appointment.createdBy !== user.username) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // For completed appointments, only admin can delete
    if (
      appointment.status === 'Completed' &&
      !['admin', 'doctor'].includes(user.role)
    ) {
      return NextResponse.json(
        { error: 'Only administrators can delete completed appointments' },
        { status: 403 },
      );
    }

    // Soft delete - mark as cancelled instead of deleting
    appointment.status = 'Cancelled';
    appointment.updatedAt = new Date();
    await appointment.save();

    // TODO: Send cancellation notification

    return NextResponse.json({
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);

    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid appointment ID format' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to cancel appointment' },
      { status: 500 },
    );
  }
}
