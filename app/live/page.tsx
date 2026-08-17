// 强制请求时渲染（SSR）：export const dynamic = 'force-dynamic'
// 每次访问都在服务端实时取数，不走静态缓存
export const dynamic = "force-dynamic";

export default async function LivePage() {
  const now = new Date().toISOString();
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const todo = (await res.json()) as { id: number; title: string; completed: boolean };

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        实时页（force-dynamic SSR）
      </h1>
      <p className="mt-2 text-zinc-500">
        服务端渲染时刻：<code className="rounded bg-zinc-100 px-1.5 py-0.5">{now}</code>
      </p>
      <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-5">
        <p className="text-sm text-zinc-500">Todo #{todo.id}</p>
        <p className="mt-1 font-medium">{todo.title}</p>
        <p className="mt-1 text-sm text-zinc-500">
          状态：{todo.completed ? "已完成" : "未完成"}
        </p>
      </div>
    </div>
  );
}
