// 强制请求时渲染（SSR）：export const dynamic = 'force-dynamic'
// 每次访问都在服务端实时取数，不走静态缓存
export const dynamic = "force-dynamic";

/**
 * 实时页 —— fetch 缓存选项对照演示（W2 Day 3 知识点）
 *
 * fetch(url, { cache: 'no-store' })：
 * 本次取数完全不进缓存，每个请求都实时打到源站 ——
 * 适合股票行情、 feed 流这类"多缓存一秒都是错的"的数据。
 * （对比详情页的 ISR 策略：静态内容缓存 60 秒，牺牲新鲜度换性能）
 */
export default async function LivePage() {
  const now = new Date().toISOString();
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
    cache: "no-store", // 显式声明不缓存：每次请求都重新取数
  });
  const todo = (await res.json()) as { id: number; title: string; completed: boolean };

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        实时页（force-dynamic SSR + no-store）
      </h1>
      <p className="mt-2 leading-7 text-zinc-500">
        服务端渲染时刻：
        <code className="rounded bg-zinc-100 px-1.5 py-0.5">{now}</code>
        <br />
        每次刷新时间都会变化 —— 这就是「请求时渲染」+「取数不缓存」的效果。
      </p>
      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-5">
        <p className="text-sm text-zinc-500">Todo #{todo.id}（no-store 实时取数）</p>
        <p className="mt-1 font-medium">{todo.title}</p>
        <p className="mt-1 text-sm text-zinc-500">
          状态：{todo.completed ? "已完成" : "未完成"}
        </p>
      </div>
    </div>
  );
}
