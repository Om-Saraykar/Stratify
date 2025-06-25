// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_SUPER_SECRET_KEY'; // Replace in production

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return NextResponse.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ message: 'Internal server error during login' }, { status: 500 });
  }
}
