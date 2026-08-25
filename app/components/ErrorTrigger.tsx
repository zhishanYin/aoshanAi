"use client";

/**
 * 错误触发按钮 —— error.tsx 错误边界演示（W2 Day 5）
 *
 * ⚠️ 关键坑：React 错误边界（error.tsx）只捕获「渲染阶段」抛出的错误，
 * 不捕获「事件处理函数（onClick 等）」里抛出的错误。
 * 所以在 onClick 里直接 throw 是没用的——错误会变成未捕获异常，error.tsx 接不到。
 *
 * 正确做法：用 state 在「点击时置位」，再在「渲染阶段」根据 state 抛错。
 * 这样错误发生在 render 中，最近的 error.tsx 才能接住。
 *
 * 演示链路：点击（setError=true）→ 重渲染 → render 阶段抛错 →
 * dashboard/error.tsx 接住渲染兜底页 → 点「重试」reset() →
 * 错误边界重挂子组件（ErrorTrigger 状态重置为 false）→ 页面恢复正常。
 */
import { useState } from "react";

export default function ErrorTrigger() {
  const [shouldThrow, setShouldThrow] = useState(false);

  // 渲染阶段抛错：只有 shouldThrow 为 true 时才在 render 里 throw，
  // 这样错误一定发生在「渲染期」，错误边界才能捕获。
  if (shouldThrow) {
    throw new Error("模拟的渲染错误：捕获到了吗？error.tsx 接手！");
  }

  return (
    <button
      type="button"
      onClick={() => setShouldThrow(true)}
      className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100"
    >
      触发渲染错误（演示 error.tsx）
    </button>
  );
}
