// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Assuming this correctly imports your Prisma client instance
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    console.log('--- Starting Signup POST Request ---');
    const { email, password, name } = await request.json();
    // Mask password and conditionally log name (optional)
    console.log('Received request body:', { email, name: name ? '***' : null });

    // 1. Basic Input Validation (Backend)
    // ONLY email and password are required as per schema and your intention
    if (!email || !password) {
      console.log('Validation Error: Missing email or password.');
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }
    if (password.length < 8) {
      console.log('Validation Error: Password too short.');
      return NextResponse.json({ message: 'Password must be at least 8 characters long' }, { status: 400 });
    }
    console.log('Input validation passed.');

    // 2. Check if user already exists
    console.log(`Checking for existing user with email: ${email}`);
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`Conflict: User with email ${email} already registered.`);
      return NextResponse.json({ message: 'Email already registered' }, { status: 409 });
    }
    console.log('No existing user found with this email.');

    // 3. Hash Password
    console.log('Hashing password...');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Password hashed successfully.');

    // 4. Create User in Database
    console.log('Attempting to create new user in database...');
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        // Set name to null if it's an empty string or undefined/null from the frontend
        // This correctly maps to Prisma's String? type
        // The `name` variable from `request.json()` can be `undefined`, `null`, or an empty string `""`
        // The `name ? name : null` handles all these cases correctly.
        name: name ? name : null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        // REMOVED: createdAt: true, // Your schema does not have a `createdAt` field on User
      }
    });
    console.log('New user created successfully:', newUser.id);

    return NextResponse.json({ message: 'User registered successfully!', user: newUser }, { status: 201 });

  } catch (error) {
    console.error('--- Signup Error Caught in Catch Block ---');
    console.error('Signup Error Details:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      if (error.stack) {
        console.error('Error stack:', error.stack);
      }
    }
    // It's generally good to return a generic error message to the client
    // for security reasons, and log the detailed error on the server.
    return NextResponse.json({ message: 'Internal server error during registration' }, { status: 500 });
  } finally {
    console.log('--- Finished Signup POST Request ---');
    // Important: If `@/lib/prisma` is a global singleton instance,
    // you generally do NOT call prisma.$disconnect() here.
    // If it's a new instance per request, then you would.
    // Assume it's a singleton for Next.js best practices, so commented out.
    // await prisma.$disconnect();
  }
}