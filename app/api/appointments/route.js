import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Appointment from '../../../models/Appointment';
import { getUserFromRequest } from '../../../lib/auth';

// GET all appointments
export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const upcoming = searchParams.get('upcoming') === 'true';
    const mine = searchParams.get('mine') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by creator for regular users
    if (user.role === 'user' || mine) {
      query.createdBy = user.username;
    }

    // Search functionality
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };

      // Try to find by patient ID, name, phone, or assigned staff
      query.$or = [
        { assignedTo: searchRegex },
        { 'walkInPatient.fullName': searchRegex },
        { 'walkInPatient.phoneNumber': searchRegex },
      ];

      // Also search in populated patient fields
      const patients = await mongoose
        .model('Patient')
        .find({
          $or: [
            { fullName: searchRegex },
            { patientId: searchRegex },
            { phoneNumber: searchRegex },
          ],
        })
        .select('_id')
        .lean();

      if (patients.length > 0) {
        query.$or.push({ patientId: { $in: patients.map((p) => p._id) } });
      }
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter upcoming appointments
    if (upcoming) {
      const now = new Date();
      query.appointmentDate = { $gte: now };
      query.status = { $in: ['Scheduled', 'Confirmed'] };
    }

    // Get appointments
    const appointments = await Appointment.find(query)
      .populate('patientId', 'fullName patientId phoneNumber')
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Appointment.countDocuments(query);

    // Count today's appointments (for admin dashboard)
    let todayCount = 0;
    if (user.role !== 'user') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      todayCount = await Appointment.countDocuments({
        appointmentDate: { $gte: today, $lt: tomorrow },
        status: { $in: ['Scheduled', 'Confirmed'] },
      });
    }

    return NextResponse.json({
      appointments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      todayCount,
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 },
    );
  }
}

// POST - Create new appointment
export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.appointmentDate || !body.appointmentTime || !body.type) {
      return NextResponse.json(
        { error: 'Appointment date, time, and type are required' },
        { status: 400 },
      );
    }

    // Validate patient reference
    if (!body.patientId && !body.walkInPatient) {
      return NextResponse.json(
        { error: 'Either patientId or walkInPatient information is required' },
        { status: 400 },
      );
    }

    // If walk-in, validate walk-in patient data
    if (body.walkInPatient) {
      if (!body.walkInPatient.fullName || !body.walkInPatient.phoneNumber) {
        return NextResponse.json(
          { error: 'Walk-in patient requires full name and phone number' },
          { status: 400 },
        );
      }
    }

    // Validate appointment is not in the past
    const appointmentDateTime = new Date(
      `${body.appointmentDate}T${body.appointmentTime}`,
    );
    const now = new Date();

    if (appointmentDateTime < now) {
      return NextResponse.json(
        { error: 'Appointment date and time cannot be in the past' },
        { status: 400 },
      );
    }

    // Check for conflicting appointments (same date/time, same assigned staff)
    if (body.assignedTo) {
      const conflictingAppointment = await Appointment.findOne({
        appointmentDate: body.appointmentDate,
        appointmentTime: body.appointmentTime,
        assignedTo: body.assignedTo,
        status: { $in: ['Scheduled', 'Confirmed'] },
      });

      if (conflictingAppointment) {
        return NextResponse.json(
          {
            error: `${body.assignedTo} already has an appointment at this time`,
          },
          { status: 400 },
        );
      }
    }

    // Prepare appointment data
    const appointmentData = {
      appointmentDate: body.appointmentDate,
      appointmentTime: body.appointmentTime,
      duration: body.duration || 30,
      type: body.type,
      reason: body.reason || '',
      assignedTo: body.assignedTo || '',
      location: body.location || 'Clinic',
      status: 'Scheduled',
      notes: body.notes || '',
      createdBy: body.createdBy || user.username,
      reminderSent: false,
    };

    // Add patient reference or walk-in data
    if (body.patientId) {
      appointmentData.patientId = body.patientId;
      appointmentData.walkInPatient = null;
    } else if (body.walkInPatient) {
      appointmentData.patientId = null;
      appointmentData.walkInPatient = {
        fullName: body.walkInPatient.fullName,
        phoneNumber: body.walkInPatient.phoneNumber,
      };
    }

    // Create appointment
    const appointment = new Appointment(appointmentData);
    await appointment.save();

    // Populate patient data if linked
    if (appointment.patientId) {
      await appointment.populate('patientId', 'fullName patientId phoneNumber');
    }

    // TODO: Send appointment confirmation email/SMS
    // TODO: Schedule reminder notification

    return NextResponse.json(
      {
        message: 'Appointment created successfully',
        appointment,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating appointment:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { error: `Validation error: ${messages.join(', ')}` },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create appointment' },
      { status: 500 },
    );
  }
}
