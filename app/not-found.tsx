import Link from "next/link";

/**
 * 404 页面（约定文件 not-found.tsx）
 *
 * 两种触发方式：
 * 1. URL 没匹配到任何路由（如访问 /not-exist）
 * 2. 页面组件里主动调用 notFound()（如详情页查不到文章 → app/posts/[id]/page.tsx）
 */
export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      {/* 大号 404：等宽数字 + 弱化色，做视觉主符号 */}
      <p className="font-mono text-7xl font-bold tracking-tight text-zinc-200">
        404
      </p>
      <h1 className="mt-4 text-xl font-semibold text-zinc-900">
        页面走丢了
      </h1>
      <p className="mt-2 text-sm leading-6 text-zinc-500">
        你访问的内容不存在或已被移除。
        <br />
        试试从下面的入口继续浏览。
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          回首页
        </Link>
        <Link
          href="/list"
          className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900"
        >
          看文章列表
        </Link>
      </div>
    </div>
  );
}
