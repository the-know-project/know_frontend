// File: src/app/api/buyer/follow/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(request: NextRequest) {
  try {
    const { artistId } = await request.json();

    // Get authenticated user
     const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // TODO: Add follow to database
    await prisma.follow.create({
        data: {
         followerId: userId,
         followingId: artistId,
       }
     });

    return NextResponse.json({ success: true, following: true });
  } catch (error) {
    console.error("Error following artist:", error);
    return NextResponse.json(
      { error: "Failed to follow artist" },
      { status: 500 }
    );
  }
}