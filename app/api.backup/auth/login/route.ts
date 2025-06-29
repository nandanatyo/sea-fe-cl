import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";


const mockUsers = [
  {
    id: "admin-1",
    fullName: "Admin SEA Catering",
    email: "admin@seacatering.id",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "user-1",
    fullName: "John Doe",
    email: "user@seacatering.id",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G",
    role: "user",
    createdAt: "2024-01-15T00:00:00Z",
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }


    const user = mockUsers.find((u) => u.email === email);
    if (!user) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }


    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }


    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      message: "Login berhasil",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
