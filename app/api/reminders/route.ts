import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { scheduledDropId } = await request.json();
  if (!scheduledDropId) {
    return NextResponse.json({ error: "scheduledDropId is required" }, { status: 400 });
  }

  try {
    const reminder = await prisma.reminder.upsert({
      where: {
        userId_scheduledDropId: {
          userId: session.user.id,
          scheduledDropId,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        scheduledDropId,
      },
    });

    return NextResponse.json({ reminder });
  } catch (error) {
    console.error("Reminder error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
