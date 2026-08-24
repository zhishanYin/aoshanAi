"use client";

/**
 * Dashboard 路由级错误边界（W2 Day 5）
 *
 * 约定文件 error.tsx 的三条规则：
 * 1. 必须是 Client Component —— 它要在客户端"接住"渲染期异常并渲染兜底 UI
 * 2. 接收两个 props：error（错误对象）、reset（重试函数，重置错误边界重新渲染）
 * 3. 只捕获「子组件」的异常 —— 布局自身的错误要靠上一层 error.tsx / global-error.tsx
 *
 * 局部隔离效果：dashboard 崩了只影响 dashboard 路由段，
 * 根布局的导航、其他页面完全正常（可以点导航离开，或点重试恢复）。
 */
import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // 副作用：真实项目在这里把错误上报到 Sentry 等监控平台
  useEffect(() => {
    console.error("[dashboard error]", error);
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
        <p className="text-3xl">💥</p>
        <h2 className="mt-4 text-xl font-semibold text-rose-900">
          控制台出错了
        </h2>
        <p className="mt-2 text-sm leading-6 text-rose-700">
          这段 UI 由 app/dashboard/error.tsx 渲染 ——
          错误被路由级边界接住了，其他页面不受影响。
        </p>
        {/* digest：Next.js 生产环境的错误指纹，方便在日志/监控里对上具体堆栈 */}
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-rose-500">
            digest: {error.digest}
          </p>
        )}
        <div className="mt-6 flex justify-center gap-3">
          {/* reset()：重置错误边界，React 会重新渲染出错的组件树 */}
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-500"
          >
            重试（reset）
          </button>
          <a
            href="/list"
            className="rounded-lg border border-rose-300 px-5 py-2.5 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100"
          >
            回列表页
          </a>
        </div>
      </div>
    </div>
  );
}
