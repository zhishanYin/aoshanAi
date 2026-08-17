import { NextResponse } from "next/server";

// Route Handler：后续调大模型 API 的服务端入口（替代自建 Node/Java 服务）
// GET 示例
export async function GET() {
  return NextResponse.json({
    message: "hello from route handler",
    method: "GET",
    time: new Date().toISOString(),
  });
}

// POST 示例：接收 JSON body 并原样回显
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    message: "received",
    method: "POST",
    echo: body,
  });
}
