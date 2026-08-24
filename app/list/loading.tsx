/**
 * 路由级加载态（约定文件 loading.tsx）
 *
 * 作用时机：从其他页面「导航进入」/list 的瞬间。
 * Next.js 会把页面内容包进内置的 Suspense，先把这个 loading UI 发给浏览器，
 * 服务端取数完成后再流式替换为真实页面 —— 用户永远不用盯着白屏。
 *
 * 和 page.tsx 里手写 Suspense 的分工：
 * - loading.tsx   → 整个路由段的兜底（外壳本身也要等数据时）
 * - 手写 Suspense → 页面内部的精细分块（本站列表页两种都用到了）
 */
import { PostListSkeleton, Skeleton } from "../components/Skeleton";

export default function ListLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      {/* 标题区骨架：形状对齐真实页面，视觉上"无缝切换" */}
      <Skeleton className="h-9 w-64" />
      <Skeleton className="mt-3 h-4 w-full max-w-xl" />

      <div className="mt-10">
        <Skeleton className="mb-4 h-4 w-20" />
        <PostListSkeleton count={5} />
      </div>

      <div className="mt-12">
        <Skeleton className="mb-4 h-4 w-20" />
        <Skeleton className="h-36 w-full rounded-xl" />
      </div>
    </div>
  );
}
