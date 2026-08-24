/**
 * 控制台路由级 loading —— 导航进入 /dashboard 时立即显示。
 * proxy 鉴权通过后、页面数据就绪前，用户看到的是这份骨架而不是白屏。
 */
import { Skeleton } from "../components/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="mt-3 h-4 w-72" />
      {/* 用户卡片骨架：头像圆 + 两行文本 */}
      <div className="mt-8 flex items-center gap-5 rounded-2xl border border-zinc-200 bg-white p-6">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
      {/* 统计卡片骨架 */}
      <div className="mt-10 grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      {/* 最近更新骨架 */}
      <Skeleton className="mt-10 h-56 rounded-xl" />
    </div>
  );
}
