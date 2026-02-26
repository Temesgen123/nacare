import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
// import Booking from '../../../../models/Booking';
import Bookedappointment from '../../../../models/Bookedappointment';

// GET single booking by ID or confirmation code
export async function GET(request, { params }) {
  try {
    await connectDB();

    let booking;

    // Check if it's a confirmation code (starts with NAC) or MongoDB ID
    if (params.id.startsWith('NAC')) {
      booking = await Bookedappointment.findOne({
        confirmationCode: params.id.toUpperCase(),
      }).lean();
    } else {
      booking = await Bookedappointment.findById(params.id).lean();
    }

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 },
    );
  }
}

// PUT - Update booking (for admin/staff or user modifications)
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const body = await request.json();

    // Find existing booking
    let existingBooking;
    if (params.id.startsWith('NAC')) {
      existingBooking = await Booking.findOne({
        confirmationCode: params.id.toUpperCase(),
      });
    } else {
      existingBooking = await Booking.findById(params.id);
    }

    if (!existingBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Prevent modification of completed or cancelled bookings
    if (
      ['Completed', 'Cancelled'].includes(existingBooking.status) &&
      body.status !== existingBooking.status
    ) {
      return NextResponse.json(
        { error: 'Cannot modify completed or cancelled bookings' },
        { status: 400 },
      );
    }

    // Validate date if being changed
    if (body.preferredDate) {
      const selectedDate = new Date(body.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return NextResponse.json(
          { error: 'Preferred date cannot be in the past' },
          { status: 400 },
        );
      }
    }

    // Prepare update data
    const updateData = {
      fullName: body.fullName || existingBooking.fullName,
      email: body.email ? body.email.toLowerCase() : existingBooking.email,
      phoneNumber: body.phoneNumber || existingBooking.phoneNumber,
      appointmentType: body.appointmentType || existingBooking.appointmentType,
      preferredDate: body.preferredDate || existingBooking.preferredDate,
      preferredTime: body.preferredTime || existingBooking.preferredTime,
      status: body.status || existingBooking.status,
      updatedAt: new Date(),
    };

    // Update address if provided
    if (body.address) {
      updateData.address = {
        subCity: body.address.subCity || existingBooking.address?.subCity || '',
        landmark:
          body.address.landmark || existingBooking.address?.landmark || '',
        specificAddress:
          body.address.specificAddress ||
          existingBooking.address?.specificAddress ||
          '',
      };
    }

    // Update additional fields if provided
    if (body.reasonForVisit !== undefined) {
      updateData.reasonForVisit = body.reasonForVisit;
    }
    if (body.medicalHistory !== undefined) {
      updateData.medicalHistory = body.medicalHistory;
    }
    if (body.staffNotes !== undefined) {
      updateData.staffNotes = body.staffNotes;
    }
    if (body.assignedTo !== undefined) {
      updateData.assignedTo = body.assignedTo;
    }

    // Update booking
    const booking = await Booking.findByIdAndUpdate(
      existingBooking._id,
      updateData,
      { new: true, runValidators: true },
    );

    // TODO: Send notification email if status changed

    return NextResponse.json({
      message: 'Booking updated successfully',
      booking,
    });
  } catch (error) {
    console.error('Error updating booking:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { error: `Validation error: ${messages.join(', ')}` },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update booking' },
      { status: 500 },
    );
  }
}

// DELETE - Cancel booking
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    let booking;

    // Find booking by ID or confirmation code
    if (params.id.startsWith('NAC')) {
      booking = await Booking.findOne({
        confirmationCode: params.id.toUpperCase(),
      });
    } else {
      booking = await Booking.findById(params.id);
    }

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Instead of deleting, mark as cancelled
    booking.status = 'Cancelled';
    booking.updatedAt = new Date();
    await booking.save();

    // TODO: Send cancellation confirmation email

    return NextResponse.json({
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 },
    );
  }
}
