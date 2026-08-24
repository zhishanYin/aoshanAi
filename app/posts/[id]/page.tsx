import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LikeButton from "../../components/LikeButton";
import { getPostById } from "../../lib/posts";

/**
 * 详情页 —— 动态路由 + 数据缓存策略演示（W2 Day 3）
 *
 * 本页同时演示三种缓存行为的组合：
 * 1. SSG：generateStaticParams 预渲染热门文章（id 1~5），build 时就生成 HTML
 * 2. 按需生成：dynamicParams = true，冷门文章（id > 5）首次访问时在服务端现渲染
 * 3. ISR：revalidate = 60，已生成的页面每 60 秒后台再生一次（增量静态再生）
 *
 * ── fetch 缓存选项速查（当数据真的来自 fetch 时）───────────────────
 * | 写法                                    | 行为                     |
 * |----------------------------------------|--------------------------|
 * | fetch(url)                             | 默认缓存（等价 force-cache）|
 * | fetch(url, { cache: 'no-store' })      | 不缓存，每次请求实时取      |
 * | fetch(url, { next: { revalidate: 60 }})| 缓存 60 秒（fetch 级 ISR） |
 * ──────────────────────────────────────────────────────────────────
 * 本站数据来自本地 mock（lib/posts.ts），不走 fetch，
 * 因此用「路由段级」的 revalidate 配置达到同样的 ISR 效果。
 */

/** 热门文章阈值：id ≤ 5 视为热门，build 时预渲染 */
const HOT_POST_LIMIT = 5;

/**
 * SSG 第一步：告诉 Next 哪些参数要在构建时预渲染。
 * 真实项目里这里通常是一次数据库查询（如「阅读量 TOP N」）。
 */
export async function generateStaticParams() {
  return Array.from({ length: HOT_POST_LIMIT }, (_, i) => ({
    id: String(i + 1),
  }));
}

/** 允许访问未预渲染的 id：冷门文章首次访问时按需生成（然后也会被缓存） */
export const dynamicParams = true;

/** ISR：本路由段所有页面每 60 秒后台重新生成 */
export const revalidate = 60;

/**
 * 动态 SEO：为每篇文章生成独立的 title / description。
 * 这是 Next.js App Router 的约定函数，SSG 页面在构建时就会生成对应 meta 标签。
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(Number(id));
  if (!post) return { title: "文章不存在" };
  return {
    title: `${post.title} · 前端技术内容站`,
    description: post.summary,
  };
}

/** 页面本体：async Server Component，数据获取就在组件里（对标 Nuxt asyncData） */
export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next 15+ 起 params 是 Promise，必须 await（同步访问已废弃）
  const { id } = await params;

  // 参数防御：非数字直接 404（比如 /posts/abc）
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) notFound();

  const post = await getPostById(numericId);
  // 文章不存在 → 抛给最近的 not-found.tsx 渲染 404 页
  if (!post) notFound();

  // 渲染模式徽标：根据 id 判断这份 HTML 是怎么来的（与上面的缓存策略对应）
  const isHot = numericId <= HOT_POST_LIMIT;
  const renderBadge = isHot
    ? { label: "SSG · 构建时预渲染", className: "bg-blue-50 text-blue-700" }
    : { label: "按需生成 · 首次访问时渲染", className: "bg-amber-50 text-amber-700" };

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-16">
      {/* 返回导航：Link 客户端预取 + 无刷新跳转（比 <a> 整页刷新体验好） */}
      <Link
        href="/list"
        className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
      >
        ← 返回列表
      </Link>

      {/* 文章头部信息 */}
      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${renderBadge.className}`}>
          {renderBadge.label}
        </span>
        <span>{post.publishDate}</span>
        <span>·</span>
        <span>{post.author}</span>
        <span>·</span>
        <span>约 {post.readingMinutes} 分钟</span>
      </div>

      <h1 className="mt-4 text-3xl font-semibold leading-snug tracking-tight text-zinc-900">
        {post.title}
      </h1>

      {/* 标签区 */}
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 text-xs text-zinc-500"
          >
            # {tag}
          </span>
        ))}
      </div>

      {/* 摘要块：浅色底突出，快速判断文章是否值得读 */}
      <blockquote className="mt-8 rounded-xl border-l-4 border-zinc-900 bg-zinc-100 px-5 py-4 leading-7 text-zinc-700">
        {post.summary}
      </blockquote>

      {/* 正文：按段落渲染，中文排版行高加大到 2，阅读更舒适 */}
      <div className="mt-8 space-y-5">
        {post.body.map((paragraph, i) => (
          <p key={i} className="text-[15px] leading-9 text-zinc-700">
            {paragraph}
          </p>
        ))}
      </div>

      {/* 底部操作区：客户端孤岛（点赞） */}
      <div className="mt-10 flex items-center justify-between border-t border-zinc-200 pt-6">
        <LikeButton postId={post.id} />
        <span className="text-xs text-zinc-400">
          本文每 60 秒增量再生（ISR）· revalidate = 60
        </span>
      </div>
    </article>
  );
}
