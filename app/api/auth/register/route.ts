import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

function generateUsername(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 18);
}

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // ── Field presence ──
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // ── Name ──
    if (name.trim().length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }

    // ── Email format ──
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    // ── Password strength ──
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // ── Email uniqueness ──
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    // ── Auto-generate a unique username from name ──
    let username = generateUsername(name);
    if (!username) username = "user";

    // Make unique if taken
    const taken = await prisma.user.findUnique({ where: { username } });
    if (taken) {
      username = `${username}${Math.floor(Math.random() * 9000) + 1000}`;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name: name.trim(), username, email: email.toLowerCase().trim(), password: hashedPassword },
    });

    return NextResponse.json({ id: user.id, name: user.name, username: user.username, email: user.email });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
