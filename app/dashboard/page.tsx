import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { cookies } from "next/headers";
import ErrorTrigger from "../components/ErrorTrigger";
import { Skeleton } from "../components/Skeleton";
import { logout } from "../(auth)/actions";
import { getRecentPosts, getStudyStats, type Post } from "../lib/posts";
import { SESSION_COOKIE, verifyToken } from "../lib/auth";

/**
 * 控制台（受保护页面）—— W2 鉴权 + 流式渲染整合演示
 *
 * 访问链路：请求 → proxy.ts 校验 JWT（不通过直接 302 到 /login）→ 渲染本页。
 * 本页再从 cookie 二次读取会话信息展示用户卡片（纵深防御：页面不依赖 proxy 也能自保）。
 *
 * 流式结构：页面外壳 + 用户卡片立即上屏，两个数据块按各自延迟"流入"：
 * - 学习统计 1.5s 流入
 * - 最近更新 3s 流入（最慢的一块，观察它最后出现）
 */

// 本页读取 cookie（动态 API），天然是动态渲染 —— 每次请求都实时生成
export const dynamic = "force-dynamic";

/** 统计卡片骨架（一格一个数字卡） */
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-24 rounded-xl" />
      ))}
    </div>
  );
}

/** 学习统计块（1.5s 流入） */
async function StatsSection() {
  const stats = await getStudyStats();
  const items = [
    { label: "已读文章", value: `${stats.postsRead} 篇`, hint: "本周累计" },
    { label: "学习时长", value: `${stats.minutes} 分钟`, hint: "本周累计" },
    { label: "连续打卡", value: `${stats.streakDays} 天`, hint: "保持节奏" },
  ];
  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-zinc-200 bg-white p-5"
        >
          <p className="text-xs text-zinc-400">{item.label}</p>
          {/* 数字用 tabular-nums：等宽数字，骨架→内容切换时宽度不跳动 */}
          <p className="mt-2 text-2xl font-semibold tabular-nums text-zinc-900">
            {item.value}
          </p>
          <p className="mt-1 text-xs text-zinc-400">{item.hint}</p>
        </div>
      ))}
    </div>
  );
}

/** 最近更新块（3s 流入，最慢的一块） */
async function RecentSection() {
  const posts = await getRecentPosts();
  return (
    <ul className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
      {posts.map((post: Post) => (
        <li key={post.id} className="flex items-center gap-4 px-5 py-4">
          <span className="font-mono text-xs text-zinc-300">
            {post.publishDate.slice(5)}
          </span>
          <Link
            href={`/posts/${post.id}`}
            className="truncate text-sm text-zinc-700 hover:text-zinc-900 hover:underline"
          >
            {post.title}
          </Link>
          <span className="ml-auto shrink-0 text-xs text-zinc-400">
            {post.readingMinutes} 分钟
          </span>
        </li>
      ))}
    </ul>
  );
}

export default async function DashboardPage() {
  // 纵深防御：即使 proxy.ts 被误删/改错，页面自己也能识别未登录状态
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;

  // 理论上到不了这里（proxy 已拦截），但兜底处理让页面独立可用
  if (!session) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-zinc-500">未登录，请先</p>
        <Link href="/login" className="text-zinc-900 underline">
          登录
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">控制台</h1>
      <p className="mt-2 text-zinc-500">
        受保护页面：由 proxy.ts 在请求进入前完成 JWT 校验。
      </p>

      {/* ── 用户卡片：读取 cookie 里的会话信息渲染，立即上屏 ── */}
      <div className="mt-8 flex items-center gap-5 rounded-2xl border border-zinc-200 bg-white p-6">
        {/* next/image：自动转码 / 按设备出尺寸 / 懒加载（远程域名需在 next.config.ts 白名单里） */}
        <Image
          src={`https://picsum.photos/seed/${encodeURIComponent(session.email)}/96/96`}
          alt={`${session.name} 的头像`}
          width={64}
          height={64}
          className="rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="text-lg font-semibold text-zinc-900">{session.name}</p>
          <p className="truncate text-sm text-zinc-500">{session.email}</p>
          <p className="mt-1 text-xs text-zinc-400">
            会话有效期至：
            {new Date(session.exp * 1000).toLocaleString("zh-CN")}
          </p>
        </div>
        {/* 登出：form + Server Action，无需任何客户端 JS */}
        <form action={logout} className="ml-auto">
          <button
            type="submit"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900"
          >
            退出登录
          </button>
        </form>
      </div>

      {/* ── 数据块 1：学习统计（1.5s 流入） ── */}
      <section className="mt-10" aria-label="学习统计">
        <h2 className="mb-4 text-sm font-semibold text-zinc-400">学习统计</h2>
        <Suspense fallback={<StatsSkeleton />}>
          <StatsSection />
        </Suspense>
      </section>

      {/* ── 数据块 2：最近更新（3s 流入，最慢，最后出现） ── */}
      <section className="mt-10" aria-label="最近更新">
        <h2 className="mb-4 text-sm font-semibold text-zinc-400">最近更新</h2>
        <Suspense
          fallback={
            <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-5">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          }
        >
          <RecentSection />
        </Suspense>
      </section>

      {/* ── 错误边界演示区 ── */}
      <section className="mt-12 rounded-xl border border-dashed border-zinc-300 p-5">
        <h2 className="text-sm font-semibold text-zinc-400">错误边界演示</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          点击按钮抛出渲染异常，观察 app/dashboard/error.tsx 如何接住错误，
          以及错误页上的「重试」按钮如何调用 reset() 恢复页面。
        </p>
        <div className="mt-4">
          <ErrorTrigger />
        </div>
      </section>
    </div>
  );
}
