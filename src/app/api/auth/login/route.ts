// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust path
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Make sure JWT_SECRET is set in your .env file
const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_SUPER_SECRET_KEY'; // **Change this in production!**

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Basic Input Validation
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // 2. Find User by Email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // 3. Compare Passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email }, // Payload
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // 5. Success Response
    // You might set the token as an HttpOnly cookie here for better security
    // For simplicity, returning it in the body for now.
    return NextResponse.json({
      message: 'Login successful!',
      token,
      user: { id: user.id, email: user.email, name: user.name },
    }, { status: 200 });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ message: 'Internal server error during login' }, { status: 500 });
  }
}