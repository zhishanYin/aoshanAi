import { NextResponse } from "next/server";
import { getPosts, getPostById } from "../../lib/posts";

// POST /api/posts —— 通过 POST 对外提供文章数据
// 请求体（JSON）：
//   {}                 → 返回全部文章
//   { id: 3 }          → 返回单篇文章（不存在返回 404）
//   { tag: "React" }   → 按标签筛选
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  // 按 id 查单篇
  if (body.id != null) {
    const post = await getPostById(Number(body.id));
    if (!post) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }
    return NextResponse.json(post);
  }

  // 按标签筛选（或返回全部）
  const posts = await getPosts();
  if (body.tag) {
    return NextResponse.json(posts.filter((p) => p.tags.includes(body.tag)));
  }
  return NextResponse.json(posts);
}
