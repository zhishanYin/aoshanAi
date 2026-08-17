// SSG 演示：构建时预渲染已知 params（generateStaticParams），
// dynamicParams = true 允许构建后访问未预渲染的 id（按需回退到按需生成）
export async function generateStaticParams() {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=5"
  );
  const posts = (await res.json()) as { id: number }[];
  return posts.map((p) => ({ id: String(p.id) }));
}

export const dynamicParams = true;

type Post = { id: number; title: string; body: string };

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
  if (!res.ok) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-semibold">未找到文章 #{id}</h1>
      </div>
    );
  }
  const post = (await res.json()) as Post;
  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-16">
      <p className="text-sm text-zinc-400">文章 #{post.id} · SSG 预渲染</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        {post.title}
      </h1>
      <p className="mt-6 leading-8 text-zinc-700">{post.body}</p>
    </article>
  );
}
