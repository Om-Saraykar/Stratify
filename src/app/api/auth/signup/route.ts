// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    console.log('--- Starting Signup POST Request ---');
    const { email, password, name } = await request.json();
    console.log('Received request body:', { email, name: name ? '***' : null });

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name ? name : null,
      },
      select: {
        id: true,
        email: true,
        name: true,
      }
    });

    console.log('New user created:', newUser.id);
    return NextResponse.json({ message: 'User registered successfully!', user: newUser }, { status: 201 });

  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ message: 'Internal server error during registration' }, { status: 500 });
  } finally {
    console.log('--- Finished Signup POST Request ---');
  }
}
