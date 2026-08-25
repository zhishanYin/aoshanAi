import { NextResponse } from "next/server";
import { getRecentPosts } from "../../../lib/posts";

// GET /api/posts/recent —— 最近更新（按发布日期倒序前 4 篇）
export async function GET() {
  const recent = await getRecentPosts();
  return NextResponse.json(recent);
}
