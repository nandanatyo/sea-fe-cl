import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Mock database - in real app, use proper database
const users = [];

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password } = await request.json();

    // Validation
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error:
            "Password harus minimal 8 karakter dengan huruf besar, kecil, angka, dan karakter khusus",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      fullName,
      email,
      password: hashedPassword,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json({
      message: "Akun berhasil dibuat",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
