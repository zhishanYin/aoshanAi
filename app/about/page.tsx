"use client";

import { useEffect, useState } from "react";

/**
 * 关于页 —— 纯 CSR（Client-Side Rendering）演示
 *
 * 对比 /list 的流式 SSR，这里是反面教材：
 * ┌────────────────────────────────────────────┐
 * │ ① 浏览器拿到 HTML：只有空壳 + "加载中..."   │ ← 白屏/占位
 * │ ② 下载并执行 JS bundle                      │ ← 这段要等网络
 * │ ③ useEffect 触发"客户端取数"（setTimeout）  │
 * │ ④ 数据回来 → setState → 才真正渲染内容      │
 * └────────────────────────────────────────────┘
 *
 * 验证方法：
 * 1. 刷新本页：先看到"加载中"，约 2 秒后内容才出现
 * 2. 查看 HTML 源码（Ctrl+U）：正文内容不在 HTML 里，只有加载占位
 * 3. 在 DevTools 里禁用 JavaScript 再刷新：永远停在加载态 —— 这就是 CSR 的代价
 */
type AboutData = {
  title: string;
  intro: string;
  points: string[];
};

export default function AboutPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AboutData | null>(null);

  // 模拟客户端取数：CSR 下数据请求发生在浏览器里，不在服务端
  useEffect(() => {
    const timer = setTimeout(() => {
      setData({
        title: "关于",
        intro:
          "这是一个用 Next.js 16（App Router）搭建的学习项目，对标已有的 Nuxt 2 SSR 经验。目标是 3 个月内补齐 React 服务端 / AI 前端方向的能力。",
        points: [
          "App Router：文件夹即路由",
          "Server Components：服务端直接 async 取数",
          "Route Handlers：后续调大模型 API 的服务端入口",
        ],
      });
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <p className="text-zinc-400">加载中……</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{data?.title}</h1>
      <p className="mt-4 leading-8 text-zinc-600">{data?.intro}</p>
      <ul className="mt-6 list-disc space-y-2 pl-6 text-zinc-700">
        {data?.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </div>
  );
}
