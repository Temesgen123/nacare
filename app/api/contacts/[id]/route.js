import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Contact from '../../../../models/Contact';
import { getUserFromRequest } from '../../../../lib/auth';

// GET single contact by ID
export async function GET(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const contact = await Contact.findById(params.id).lean();

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ contact });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 },
    );
  }
}

// PUT - Update contact (mark as read, change status, add notes)
export async function PUT(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();

    // Find existing contact
    const existingContact = await Contact.findById(params.id);

    if (!existingContact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData = {
      updatedAt: new Date(),
    };

    // Update only provided fields
    if (body.status !== undefined) updateData.status = body.status;
    if (body.isRead !== undefined) updateData.isRead = body.isRead;
    if (body.adminNotes !== undefined) updateData.adminNotes = body.adminNotes;

    // Track who replied and when
    if (body.status === 'Replied' && existingContact.status !== 'Replied') {
      updateData.repliedBy = user.username;
      updateData.repliedAt = new Date();
    }

    // Update contact
    const contact = await Contact.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!contact) {
      return NextResponse.json(
        { error: 'Failed to update contact' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: 'Contact updated successfully',
      contact,
    });
  } catch (error) {
    console.error('Error updating contact:', error);

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
        { error: 'Invalid contact ID format' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update contact' },
      { status: 500 },
    );
  }
}

// DELETE - Delete contact (admin only)
export async function DELETE(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin can delete contacts
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Admin role required.' },
        { status: 403 },
      );
    }

    await connectDB();

    const contact = await Contact.findById(params.id);

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Delete the contact
    await Contact.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting contact:', error);

    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid contact ID format' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 },
    );
  }
}
