"use client";

/**
 * 全局错误边界（根级 error.tsx）
 *
 * 职责：兜住「dashboard/error.tsx 覆盖不到的路由段」抛出的渲染异常
 * （例如 /list、/posts/[id] —— 这些页面目前没有自己的 error.tsx）。
 * 注意它依然会渲染在根布局（导航栏）之内，用户还能点导航逃离。
 */
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-24 text-center">
      <div className="rounded-2xl border border-zinc-200 bg-white p-10">
        <p className="text-4xl">🛠️</p>
        <h2 className="mt-4 text-xl font-semibold text-zinc-900">
          页面出了点问题
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          由根级 app/error.tsx 兜底渲染。开发环境请查看终端里的完整错误堆栈。
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          重试
        </button>
      </div>
    </div>
  );
}
