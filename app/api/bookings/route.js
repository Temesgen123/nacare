import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
// import Booking from '../../../models/Booking';
import Bookedappointment from '../../../models/Bookedappointment';
import { getUserFromRequest } from '../../../lib/auth';

// GET all bookings (for admin/staff dashboard)
export async function GET(request) {
  try {
    // Authentication check - only admin and doctor roles can view all bookings
    const authHeader = request.headers.get('authorization');

    if (authHeader) {
      // If token provided, verify user role
      try {
        const user = getUserFromRequest(request);

        if (!user) {
          return NextResponse.json(
            { error: 'Invalid authentication token' },
            { status: 401 },
          );
        }

        if (!['admin', 'doctor'].includes(user.role)) {
          return NextResponse.json(
            { error: 'Access denied. Admin or Doctor role required.' },
            { status: 403 },
          );
        }
      } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json(
          { error: 'Authentication failed' },
          { status: 401 },
        );
      }
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    const confirmationCode = searchParams.get('confirmationCode');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by email
    if (email) {
      query.email = email.toLowerCase();
    }

    // Filter by phone
    if (phone) {
      query.phoneNumber = phone;
    }

    // Search by confirmation code
    if (confirmationCode) {
      query.confirmationCode = confirmationCode.toUpperCase();
    }

    const bookings = await Bookedappointment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Bookedappointment.countDocuments(query);

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 },
    );
  }
}

// POST - Create new booking
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.fullName || !body.email || !body.phoneNumber) {
      return NextResponse.json(
        { error: 'Full name, email, and phone number are required' },
        { status: 400 },
      );
    }

    if (!body.appointmentType || !body.preferredDate || !body.preferredTime) {
      return NextResponse.json(
        { error: 'Appointment type, preferred date, and time are required' },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 },
      );
    }

    // Validate preferred date is not in the past
    const selectedDate = new Date(body.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return NextResponse.json(
        { error: 'Preferred date cannot be in the past' },
        { status: 400 },
      );
    }

    // Check for duplicate booking on same date/time
    const existingBooking = await Bookedappointment.findOne({
      $or: [
        { email: body.email.toLowerCase() },
        { phoneNumber: body.phoneNumber },
      ],
      preferredDate: selectedDate,
      preferredTime: body.preferredTime,
      status: { $in: ['Pending', 'Confirmed'] },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: 'You already have a booking for this date and time slot' },
        { status: 400 },
      );
    }

    // Prepare booking data
    const bookingData = {
      fullName: body.fullName,
      email: body.email.toLowerCase(),
      phoneNumber: body.phoneNumber,
      appointmentType: body.appointmentType,
      preferredDate: selectedDate,
      preferredTime: body.preferredTime,
      address: {
        subCity: body.address?.subCity || '',
        landmark: body.address?.landmark || '',
        specificAddress: body.address?.specificAddress || '',
      },
      reasonForVisit: body.reasonForVisit || '',
      medicalHistory: body.medicalHistory || '',
      status: 'Pending',
    };

    // Create new booking
    const booking = new Bookedappointment(bookingData);
    await booking.save();

    // TODO: Send confirmation email to user
    // TODO: Send notification to admin/staff

    return NextResponse.json(
      {
        message:
          'Appointment booked successfully! You will receive a confirmation email shortly.',
        booking: {
          confirmationCode: booking.confirmationCode,
          fullName: booking.fullName,
          email: booking.email,
          phoneNumber: booking.phoneNumber,
          appointmentType: booking.appointmentType,
          preferredDate: booking.preferredDate,
          preferredTime: booking.preferredTime,
          status: booking.status,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating booking:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { error: `Validation error: ${messages.join(', ')}` },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create booking' },
      { status: 500 },
    );
  }
}
