"use client";

/**
 * 点赞按钮 —— Client Component 边界演示（W2 Day 1 核心知识点）
 *
 * 为什么必须加 "use client"？
 * 1. 用了 useState：状态是浏览器里的东西，服务端渲染时不存在"点击后更新"
 * 2. 用了 onClick：事件处理器只能绑定在客户端的 DOM 上，服务端没有用户交互
 *
 * 边界决策清单（什么时候加 'use client'）：
 * - useState / useReducer / useEffect / use context 交互状态 → 加
 * - onClick / onChange 等事件绑定 → 加
 * - 浏览器 API（localStorage、window、canvas）→ 加
 * - 其余情况（纯展示、async 取数、访问数据库）→ 不加，留在服务端
 *
 * 这个组件会被父级 Server Component（列表页）引用：
 * 服务端渲染它的初始 HTML，客户端只水合（hydrate）这一小块"孤岛"，
 * 其余列表内容仍是零 JS 的 Server Component —— 这就是「孤岛架构」。
 */
import { useState } from "react";

export default function LikeButton({ postId }: { postId: number }) {
  // 点赞状态只存在于浏览器，刷新即重置（真实项目会调接口持久化）
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(12); // 假装每篇有 12 个初始赞

  function handleClick() {
    setLiked((prev) => !prev);
    setCount((prev) => (liked ? prev - 1 : prev + 1));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={liked}
      className={
        // 点赞后切换为实心红心样式，给用户即时反馈
        `inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
          liked
            ? "border-rose-200 bg-rose-50 text-rose-600"
            : "border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
        }`
      }
    >
      <span aria-hidden="true">{liked ? "❤️" : "🤍"}</span>
      <span>{count}</span>
      <span className="sr-only">点赞文章 {postId}</span>
    </button>
  );
}
