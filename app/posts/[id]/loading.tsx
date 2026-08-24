/**
 * 详情页路由级 loading（约定文件）
 *
 * 生效场景：冷门文章（id > 5）首次访问时按需生成页面，
 * 生成期间先展示这份骨架，页面就绪后流式替换。
 * 热门文章是构建时预渲染的静态页，访问时不会经过这个 loading。
 */
import { Skeleton } from "../../components/Skeleton";

export default function PostLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <Skeleton className="h-4 w-20" />
      {/* 模式徽标 + 日期行 */}
      <div className="mt-6 flex gap-3">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      {/* 标题两行 */}
      <Skeleton className="mt-4 h-9 w-full" />
      <Skeleton className="mt-2 h-9 w-3/5" />
      {/* 摘要块 */}
      <Skeleton className="mt-8 h-20 w-full rounded-xl" />
      {/* 正文段落 */}
      <div className="mt-8 space-y-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}
