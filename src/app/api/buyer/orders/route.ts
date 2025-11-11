import { NextRequest, NextResponse } from "next/server";
import { AuthenticatedApiClient } from "@/src/features/api/http/authenticated-client";
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "cart";

    const data = await AuthenticatedApiClient.get(`/buyer/orders?type=${type}`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}