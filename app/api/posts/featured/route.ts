import { NextResponse } from "next/server";
import { getFeaturedPosts } from "../../../lib/posts";

// GET /api/posts/featured —— 编辑推荐（阅读时长最长 3 篇）
export async function GET() {
  const featured = await getFeaturedPosts();
  return NextResponse.json(featured);
}
