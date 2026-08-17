// Server Component：直接 async 取数（对标 Nuxt 的 asyncData / useFetch）
// 显式声明为动态渲染（SSR）：每次请求都在服务端实时取数，
// 同时避免 build 阶段对外部 API 的强依赖（断网也能成功构建/部署）。
export const dynamic = "force-dynamic";
async function getPosts() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=8");
  if (!res.ok) throw new Error("取数失败");
  return res.json() as Promise<{ id: number; title: string; body: string }[]>;
}

export default async function ListPage() {
  const posts = await getPosts();
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">文章列表（SSR 取数）</h1>
      <p className="mt-2 text-zinc-500">
        数据来自 JSONPlaceholder，在服务端渲染时拉取。
      </p>
      <ul className="mt-6 space-y-4">
        {posts.map((post) => (
          <li
            key={post.id}
            className="rounded-lg border border-zinc-200 bg-white p-5"
          >
            <a
              href={`/posts/${post.id}`}
              className="font-medium text-zinc-900 hover:underline"
            >
              {post.title}
            </a>
            <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
              {post.body}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
