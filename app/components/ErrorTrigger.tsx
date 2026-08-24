"use client";

/**
 * 错误触发按钮 —— error.tsx 错误边界演示（W2 Day 5）
 *
 * 为什么是 Client Component：只有客户端才有"点击"这个动作，
 * 点击后抛出的渲染期异常会被最近的 error.tsx（错误边界）捕获。
 *
 * 演示效果：点击 → 整个 dashboard 路由段崩掉并渲染错误页 →
 * 点错误页上的「重试」→ reset() 重置错误边界，页面恢复。
 * 这证明了错误被"局部隔离"：导航栏、其他路由完全不受影响。
 */
export default function ErrorTrigger() {
  function handleClick() {
    // 故意抛错：模拟组件渲染时遇到异常数据 / 空指针的真实场景
    throw new Error("模拟的渲染错误：捕获到了吗？error.tsx 接手！");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100"
    >
      触发渲染错误（演示 error.tsx）
    </button>
  );
}
