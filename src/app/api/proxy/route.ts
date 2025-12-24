import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing URL parameter", { status: 400 });
  }

  try {
    const targetUrl = decodeURIComponent(url);

    // Filter headers to forward
    const headers = new Headers();
    const allowedHeaders = ["range", "user-agent", "accept", "referer"];

    request.headers.forEach((value, key) => {
      if (allowedHeaders.includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    });

    // Make request to video server
    const response = await fetch(targetUrl, {
      headers: headers,
      // Important to disable caching or handle it properly for streaming
      cache: "no-store",
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch video: ${response.statusText}`, {
        status: response.status,
      });
    }

    // Prepare response headers
    const responseHeaders = new Headers();
    responseHeaders.set(
      "Content-Type",
      response.headers.get("Content-Type") || "video/mp4"
    );
    responseHeaders.set("Access-Control-Allow-Origin", "*");

    // Forward key headers for streaming
    const forwardResponseHeaders = [
      "content-length",
      "content-range",
      "accept-ranges",
      "content-encoding",
    ];

    forwardResponseHeaders.forEach((header) => {
      const value = response.headers.get(header);
      if (value) {
        responseHeaders.set(header, value);
      }
    });

    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
