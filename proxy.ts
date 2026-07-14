import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// UI prototype mode — all routes open, no auth checks
export async function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
