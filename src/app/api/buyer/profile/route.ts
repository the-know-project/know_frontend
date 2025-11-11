import { NextRequest, NextResponse } from "next/server";
import { AuthenticatedApiClient } from "@/src/features/api/http/authenticated-client";

export async function GET(request: NextRequest) {
  try {
    const data = await AuthenticatedApiClient.get("/buyer/profile");
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching buyer profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
