import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Contact from '../../../models/Contact';
import { getUserFromRequest } from '../../../lib/auth';

// GET all contacts (for admin dashboard - requires authentication)
export async function GET(request) {
  try {
    // Check authentication for GET requests (admin only)
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin and doctor can view contacts
    if (!['admin', 'doctor'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Access denied. Admin or Doctor role required.' },
        { status: 403 },
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const isRead = searchParams.get('isRead');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by read status
    if (isRead !== null && isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    // Search functionality
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
        { message: searchRegex },
      ];
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Contact.countDocuments(query);

    // Count unread contacts
    const unreadCount = await Contact.countDocuments({ isRead: false });

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 },
    );
  }
}

// POST - Create new contact submission (PUBLIC - no authentication required)
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required' },
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

    // Prepare contact data
    const contactData = {
      name: body.name,
      email: body.email.toLowerCase(),
      phone: body.phone || '',
      subject: body.subject,
      message: body.message,
      status: 'New',
      isRead: false,
    };

    // Create new contact
    const contact = new Contact(contactData);
    await contact.save();

    // TODO: Send notification email to admin
    // TODO: Send auto-reply email to user

    return NextResponse.json(
      {
        message: 'Thank you for contacting us! We will get back to you soon.',
        contact: {
          _id: contact._id,
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating contact:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { error: `Validation error: ${messages.join(', ')}` },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to submit contact form' },
      { status: 500 },
    );
  }
}
