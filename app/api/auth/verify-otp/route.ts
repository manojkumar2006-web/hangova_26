import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    // Find the most recent OTP for this email
    const token = await prisma.otpToken.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (!token) {
      return NextResponse.json({ error: "No OTP found. Please request a new one." }, { status: 400 });
    }

    // Check expiry
    if (new Date() > token.expiresAt) {
      await prisma.otpToken.delete({ where: { id: token.id } });
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    // Check match
    if (token.otp !== otp.trim()) {
      return NextResponse.json({ error: "Incorrect OTP. Please try again." }, { status: 400 });
    }

    // Success — clean up the token
    await prisma.otpToken.delete({ where: { id: token.id } });

    return NextResponse.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
  }
}
