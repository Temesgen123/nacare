import { NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
import connectDB from '../../../../lib/mongodb';
// import User from '@/models/User';
import User from '../../../../models/User.js';
// import { comparePassword, generateToken } from '@/lib/auth';
import { comparePassword, generateToken } from '../../../../lib/auth';

export async function POST(request) {
  try {
    await connectDB();
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 },
      );
    }

    // Find user
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is inactive. Please contact administrator.' },
        { status: 403 },
      );
    }

    // Verify password
    const isPasswordValid = comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    // Generate JWT token
    const token = generateToken(user);

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 },
    );
  }
}
