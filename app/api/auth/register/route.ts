import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbOperations } from "@/lib/db";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await dbOperations.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await dbOperations.createUser({
      name,
      email,
      password: hashedPassword,
    });

    const userId = newUser.id || newUser._id.toString();

    // Sign token & set cookie
    const token = signToken({
      userId,
      email: newUser.email,
      name: newUser.name,
    });

    setAuthCookie(token);

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: userId,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error during registration" },
      { status: 500 }
    );
  }
}