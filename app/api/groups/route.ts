import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

// GET: list all groups (admin only)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const groups = await prisma.group.findMany({
    include: { _count: { select: { members: true, content: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ groups });
}

// POST: create a new group (admin only)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { name, isPublic } = await request.json();

  if (!name) {
    return NextResponse.json({ error: "Group name is required" }, { status: 400 });
  }

  // Generate a unique 8-character invite code
  let code: string;
  let exists = true;
  do {
    code = randomBytes(4).toString("hex").toUpperCase();
    const existing = await prisma.group.findUnique({ where: { code } });
    exists = !!existing;
  } while (exists);

  const group = await prisma.group.create({
    data: { name, code, isPublic: isPublic ?? false },
  });

  return NextResponse.json({ group }, { status: 201 });
}
