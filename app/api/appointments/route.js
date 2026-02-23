import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Appointment from '../../../models/Appointment';
import Patient from '../../../models/Patient';
import { getUserFromRequest } from '../../../lib/auth';

// GET all appointments — filterable, searchable, paginated
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
    const date = searchParams.get('date'); // YYYY-MM-DD — filter by single day
    const upcoming = searchParams.get('upcoming'); // "true" — future only
    const patientId = searchParams.get('patientId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    let query = {};

    // Server-side enforcement: 'user' role can ONLY ever see their own appointments.
    // This is not based on a frontend param — it is derived from the verified JWT role.
    if (user.role === 'user') {
      query.createdBy = String(user.userId);
    }

    // Filter by status
    if (status) query.status = status;

    // Filter by specific patient
    if (patientId) query.patientId = patientId;

    // Filter by single calendar day
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.appointmentDate = { $gte: start, $lte: end };
    }

    // Show only upcoming (today and future)
    if (upcoming === 'true' && !date) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      query.appointmentDate = { $gte: now };
    }

    // Search: match existing patients OR walk-in name/phone
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

      query.$or = [
        { patientId: { $in: matchingPatients.map((p) => p._id) } },
        { 'walkInPatient.fullName': { $regex: search, $options: 'i' } },
        { 'walkInPatient.phoneNumber': { $regex: search, $options: 'i' } },
        { assignedTo: { $regex: search, $options: 'i' } },
      ];
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'fullName patientId phoneNumber')
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Appointment.countDocuments(query);

    // Stats for the dashboard header
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayCount = await Appointment.countDocuments({
      appointmentDate: { $gte: today, $lt: tomorrow },
      status: { $in: ['Scheduled', 'Confirmed'] },
    });

    return NextResponse.json({
      appointments,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
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

// POST — Create new appointment
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

    // Must have either a linked patient or walk-in details
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

    // Verify patient exists if ID provided
    if (body.patientId) {
      const patient = await Patient.findById(body.patientId);
      if (!patient) {
        return NextResponse.json(
          { error: 'Patient not found' },
          { status: 404 },
        );
      }
    }

    // Check for scheduling conflicts (same date + time + assignedTo)
    if (body.assignedTo) {
      const conflict = await Appointment.findOne({
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

    const appointmentData = {
      patientId: body.patientId || null,
      walkInPatient: body.patientId
        ? undefined
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
      notes: body.notes || '',
      reminderSent: false,
      createdBy: String(user.userId),
    };

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    await appointment.populate('patientId', 'fullName patientId phoneNumber');

    return NextResponse.json(
      { message: 'Appointment scheduled successfully', appointment },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating appointment:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
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
