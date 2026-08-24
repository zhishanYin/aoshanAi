import Link from "next/link";
import { Suspense } from "react";
import LikeButton from "../components/LikeButton";
import { PostListSkeleton, Skeleton } from "../components/Skeleton";
import { getFeaturedPosts, getPosts } from "../lib/posts";

/**
 * 强制请求时渲染：否则 build 时 Next 会把本页预渲染成静态 HTML，
 * 延迟和流式效果在生产环境就看不到了（学习项目要的就是"每次请求都重新流式"）
 */
export const dynamic = "force-dynamic";

/**
 * 列表页 —— W2 流式渲染主战场（Day 2 交付）
 *
 * 流式渲染的结构策略（重要）：
 * ┌──────────────────────────────┐
 * │ 页面外壳（立即上屏，零等待）      │  ← 标题 + 说明 + 两个骨架屏占位
 * ├──────────────────────────────┤
 * │ <Suspense> 文章列表（0.8s 流入）│  ← 快数据先到先渲染
 * ├──────────────────────────────┤
 * │ <Suspense> 编辑推荐（2.5s 流入）│  ← 慢数据后到，"填"进占位
 * └──────────────────────────────┘
 *
 * 验证方法：
 * 1. 打开 DevTools → Network → 选第一个文档请求 → Response，
 *    能看到 HTML 是分块到达的（不是等全部数据取完才返回）
 * 2. 刷新页面：标题立即出现 → 0.8s 后列表流入 → 2.5s 后推荐区流入
 * 3. 对比传统 CSR：白屏等 JS → 数据回来才整体渲染（可以去 /about 体验）
 */

/**
 * 文章列表块（异步 Server Component）
 * Suspense 的关键机制：异步组件的 Promise 被 Suspense 捕获，
 * 数据就绪前先渲染 fallback（骨架屏），就绪后自动替换为真实内容
 */
async function PostList() {
  const posts = await getPosts();
  return (
    <ul className="space-y-4">
      {posts.map((post) => (
        <li
          key={post.id}
          className="rounded-xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            {/* 点击进入详情页：详情页演示 SSG + SSR 双模式缓存策略 */}
            <Link
              href={`/posts/${post.id}`}
              className="text-lg font-medium text-zinc-900 hover:underline"
            >
              {post.title}
            </Link>
            <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-500">
              {post.readingMinutes} 分钟
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{post.summary}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs text-zinc-500"
              >
                {tag}
              </span>
            ))}
            <span className="ml-auto text-xs text-zinc-400">
              {post.publishDate}
            </span>
          </div>
          {/* 客户端孤岛：整个列表是 Server Component，只有这个按钮会被水合 */}
          <div className="mt-3">
            <LikeButton postId={post.id} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** 编辑推荐块（更慢的数据流）：骨架屏只占一条卡片的位置，避免布局大幅跳动 */
async function FeaturedSection() {
  const featured = await getFeaturedPosts();
  return (
    <ol className="space-y-3">
      {featured.map((post, index) => (
        <li key={post.id} className="flex items-baseline gap-3">
          {/* 排行榜序号：用等宽字体避免数字宽度变化引起的抖动 */}
          <span className="font-mono text-sm font-semibold text-zinc-300">
            {String(index + 1).padStart(2, "0")}
          </span>
          <Link
            href={`/posts/${post.id}`}
            className="text-sm text-zinc-700 hover:text-zinc-900 hover:underline"
          >
            {post.title}
          </Link>
          <span className="ml-auto shrink-0 text-xs text-zinc-400">
            {post.author}
          </span>
        </li>
      ))}
    </ol>
  );
}

/** 编辑推荐区的骨架（在页面组件外定义，保证引用稳定不被意外重建） */
function FeaturedSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-baseline gap-3">
          <Skeleton className="h-4 w-6" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-3 w-14" />
        </div>
      ))}
    </div>
  );
}

export default function ListPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      {/* ── 页面外壳：不依赖任何异步数据，服务端第一时间就把它发给浏览器 ── */}
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          前端技术内容站
        </h1>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
          流式渲染 · Live
        </span>
      </div>
      <p className="mt-2 leading-7 text-zinc-500">
        本页使用 React <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px]">Suspense</code> +
        Next.js 流式 SSR：标题立即上屏，文章列表约 0.8 秒后流入，
        编辑推荐约 2.5 秒后流入 —— 打开 Network 面板可看到 HTML 分块传输。
      </p>

      {/* ── 快数据块：列表（0.8s 流入） ── */}
      <section className="mt-10" aria-label="文章列表">
        <h2 className="mb-4 text-sm font-semibold text-zinc-400">全部文章</h2>
        <Suspense fallback={<PostListSkeleton count={5} />}>
          <PostList />
        </Suspense>
      </section>

      {/* ── 慢数据块：编辑推荐（2.5s 流入），故意和列表拉开延迟差 ── */}
      <section className="mt-12" aria-label="编辑推荐">
        <h2 className="mb-4 text-sm font-semibold text-zinc-400">编辑推荐</h2>
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <Suspense fallback={<FeaturedSkeleton />}>
            <FeaturedSection />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
