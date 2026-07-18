import { NextRequest, NextResponse } from "next/server";
import { isProduction } from "@/src/config/environment";
import { env } from "@/src/config/schemas/env";

type ProxyMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";

function getUpstreamUrl(path: string[], search: string): string {
  const baseUrl = isProduction() ? env.env.PROD_URL : env.env.STAGING_URL;
  return `${baseUrl.replace(/\/$/, "")}/${path.join("/")}${search}`;
}

function getForwardHeaders(request: NextRequest): Headers {
  const headers = new Headers();

  for (const name of ["accept", "content-type", "cookie", "authorization"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const apiKey = process.env.APP_API_KEY;
  if (!apiKey) throw new Error("APP_API_KEY is not configured on the server");
  headers.set("x-api-key", apiKey);

  return headers;
}

async function proxy(
  request: NextRequest,
  path: string[],
  method: ProxyMethod,
) {
  try {
    const body =
      method === "GET" || method === "HEAD"
        ? undefined
        : await request.arrayBuffer();

    const response = await fetch(getUpstreamUrl(path, request.nextUrl.search), {
      method,
      headers: getForwardHeaders(request),
      body,
      redirect: "manual",
      cache: "no-store",
    });

    const responseHeaders = new Headers();
    const contentType = response.headers.get("content-type");
    if (contentType) responseHeaders.set("content-type", contentType);

    for (const cookie of response.headers.getSetCookie()) {
      responseHeaders.append(
        "set-cookie",
        cookie.replace(/;\s*Domain=[^;]*/gi, ""),
      );
    }

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Backend proxy request failed:", error);
    return NextResponse.json(
      { message: "Unable to reach the API" },
      { status: 502 },
    );
  }
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, context: RouteContext) {
  return proxy(request, (await context.params).path, "GET");
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxy(request, (await context.params).path, "POST");
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return proxy(request, (await context.params).path, "PUT");
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxy(request, (await context.params).path, "PATCH");
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxy(request, (await context.params).path, "DELETE");
}

export async function HEAD(request: NextRequest, context: RouteContext) {
  return proxy(request, (await context.params).path, "HEAD");
}
