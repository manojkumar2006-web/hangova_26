import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Group code is required" }, { status: 400 });
    }

    const group = await prisma.group.findUnique({
      where: { code: code.trim().toUpperCase() },
      include: { _count: { select: { members: true } } },
    });

    if (!group) {
      return NextResponse.json({ error: "Invalid group code. Double-check and try again." }, { status: 404 });
    }

    // Update user's group
    await prisma.user.update({
      where: { id: session.user.id },
      data: { groupId: group.id },
    });

    return NextResponse.json({
      group: {
        id: group.id,
        name: group.name,
        _count: group._count,
      },
    });
  } catch (error) {
    console.error("Join group error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
