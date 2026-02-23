import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User.js';
import { hashPassword } from '../../../../lib/auth';

export async function POST(request) {
  try {
    await connectDB();

    const { fullName, username, email, password } = await request.json();

    // Validate required fields
    if (!fullName || !username || !password) {
      return NextResponse.json(
        { error: 'Full name, username, and password are required' },
        { status: 400 },
      );
    }

    // Enforce minimum password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 },
      );
    }

    // Check username is not already taken (case-insensitive — model lowercases it)
    const existingUser = await User.findOne({
      username: username.toLowerCase(),
    });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username is already taken. Please choose another.' },
        { status: 409 },
      );
    }

    // Check email uniqueness if provided
    if (email) {
      const existingEmail = await User.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return NextResponse.json(
          { error: 'An account with this email already exists.' },
          { status: 409 },
        );
      }
    }

    // Hash password and create user — role defaults to 'user' per schema
    const hashedPassword = hashPassword(password);

    const user = new User({
      fullName,
      username,
      email: email || undefined,
      password: hashedPassword,
      role: 'user', // always 'user' on self-registration
      isActive: true,
    });

    await user.save();

    return NextResponse.json(
      {
        message: 'Account created successfully. Please sign in.',
        user: {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Registration error:', error);

    // Mongoose duplicate key (race condition safety net)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || 'field';
      return NextResponse.json(
        { error: `An account with this ${field} already exists.` },
        { status: 409 },
      );
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json({ error: messages.join(', ') }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 },
    );
  }
}
