import { NextRequest, NextResponse } from "next/server";
import { AuthenticatedApiClient } from "@/features/api/http/authenticated-client";

export async function POST(request: NextRequest) {
  try {
    const { itemId } = await request.json();

    // Get authenticated user
    const session = await getServerSession(authOptions);
     if (!session?.user?.id) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
     }
     const userId = session.user.id;

    // TODO: Add like to database
     await prisma.like.create({
       data: {
         userId,
         artworkId: itemId,
       }
     });

    return NextResponse.json({ success: true, liked: true });
  } catch (error) {
    console.error("Error liking item:", error);
    return NextResponse.json(
      { error: "Failed to like item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { itemId } = await request.json();

    // Get authenticated user
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
    // const userId = session.user.id;

    // TODO: Remove like from database
    // await prisma.like.delete({
    //   where: {
    //     userId_artworkId: {
    //       userId,
    //       artworkId: itemId,
    //     }
    //   }
    // });

    return NextResponse.json({ success: true, liked: false });
  } catch (error) {
    console.error("Error unliking item:", error);
    return NextResponse.json(
      { error: "Failed to unlike item" },
      { status: 500 }
    );
  }
}