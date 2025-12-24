import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { Readable } from "stream";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing URL parameter", { status: 400 });
  }

  try {
    const targetUrl = decodeURIComponent(url);

    // Filter headers to forward
    const headers: Record<string, string> = {};
    const allowedHeaders = ["range", "user-agent", "accept", "referer"];

    request.headers.forEach((value, key) => {
      if (allowedHeaders.includes(key.toLowerCase())) {
        headers[key] = value;
      }
    });

    // Make request to video server using axios
    const response = await axios.get(targetUrl, {
      headers: headers,
      responseType: "stream",
      validateStatus: () => true, // Accept all status codes to forward them
    });

    // Prepare response headers
    const responseHeaders = new Headers();
    responseHeaders.set(
      "Content-Type",
      response.headers["content-type"] || "video/mp4"
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
      const value = response.headers[header];
      if (value) {
        responseHeaders.set(header, Array.isArray(value) ? value[0] : value);
      }
    });

    // Axios data is a stream in Node.js environment
    const stream = response.data as Readable;

    // Convert Node.js Readable stream to Web ReadableStream
    const webStream = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => controller.enqueue(chunk));
        stream.on("end", () => controller.close());
        stream.on("error", (err) => controller.error(err));
      },
    });

    return new NextResponse(webStream, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
