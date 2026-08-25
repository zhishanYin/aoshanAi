import { NextResponse } from "next/server";
import { getPostById } from "../../../lib/posts";

// GET /api/posts/[id] —— 按 id 查单篇文章，例如 /api/posts/3
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await getPostById(Number(id));

  if (!post) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }
  return NextResponse.json(post);
}
