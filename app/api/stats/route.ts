import { NextResponse } from "next/server";
import { getStudyStats } from "../../lib/posts";

// GET /api/stats —— 学习统计（已读文章数 / 分钟 / 连续天数）
export async function GET() {
  const stats = await getStudyStats();
  return NextResponse.json(stats);
}
