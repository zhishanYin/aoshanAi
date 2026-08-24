/**
 * 骨架屏组件（Skeleton）
 *
 * 用途：Suspense 的 fallback 占位。样式上用「灰色色块 + 闪烁动画」
 * 模拟内容即将出现的感觉，比转圈 loading 用户感知更好。
 *
 * 注意：这是 Server Component（没有 'use client'，也没有任何交互），
 * 纯展示组件默认在服务端渲染，不增加客户端 bundle 体积。
 */

/** 闪烁动画：Tailwind 的 animate-pulse 透明度在 40% ~ 100% 之间循环 */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-zinc-200 ${className}`} />;
}

/** 文章卡片骨架：标题条 + 两行摘要条，布局和真实卡片完全一致，避免内容流入时跳动 */
export function PostCardSkeleton() {
  return (
    <li className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-11/12" />
      <div className="mt-4 flex items-center gap-3">
        <Skeleton className="h-6 w-14 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="ml-auto h-3 w-20" />
      </div>
    </li>
  );
}

/** 文章列表骨架：n 张卡片骨架，和真实列表的 DOM 结构保持一致 */
export function PostListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <ul className="space-y-4" aria-busy="true" aria-label="加载中">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </ul>
  );
}
